<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function required_mark(array $data, string $field): float
{
    if (!array_key_exists($field, $data)) {
        json_response(['error' => "Missing required field: $field."], 400);
    }

    return normalize_decimal($data[$field], $field);
}

function calculate_final_score(array $marks): float
{
    $score = ($marks['task_mark'] * 0.10)
        + ($marks['safety_mark'] * 0.10)
        + ($marks['knowledge_mark'] * 0.10)
        + ($marks['report_mark'] * 0.15)
        + ($marks['clarity_mark'] * 0.10)
        + ($marks['learning_mark'] * 0.15)
        + ($marks['project_mgt_mark'] * 0.15)
        + ($marks['time_mgt_mark'] * 0.15);

    return round($score, 2);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user = require_auth();
    $internship_id = validate_int($_GET['internship_id'] ?? 0, 'internship_id', 1);

    $sql = "SELECT a.*
            FROM Assessments a
            JOIN Internships i ON a.internship_id = i.internship_id
            WHERE a.internship_id = ?";
    $params = [$internship_id];

    if ($user['role'] === 'Assessor') {
        $sql .= ' AND i.assessor_id = ?';
        $params[] = $user['user_id'];
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $assessment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$assessment) {
        json_response(['error' => 'Assessment not found.'], 404);
    }

    json_response(['assessment' => $assessment]);
}

if ($method === 'POST' || $method === 'PUT') {
    $user = require_role('Assessor');
    $data = read_json_body();
    require_fields($data, ['internship_id']);

    $internship_id = validate_int($data['internship_id'], 'internship_id', 1);

    $assigned = $pdo->prepare(
        'SELECT internship_id
         FROM Internships
         WHERE internship_id = ? AND assessor_id = ?'
    );
    $assigned->execute([$internship_id, $user['user_id']]);
    if (!$assigned->fetch(PDO::FETCH_ASSOC)) {
        json_response(['error' => 'Internship not found for this assessor.'], 403);
    }

    $marks = [
        'task_mark' => required_mark($data, 'task_mark'),
        'safety_mark' => required_mark($data, 'safety_mark'),
        'knowledge_mark' => required_mark($data, 'knowledge_mark'),
        'report_mark' => required_mark($data, 'report_mark'),
        'clarity_mark' => required_mark($data, 'clarity_mark'),
        'learning_mark' => required_mark($data, 'learning_mark'),
        'project_mgt_mark' => required_mark($data, 'project_mgt_mark'),
        'time_mgt_mark' => required_mark($data, 'time_mgt_mark'),
    ];
    $comments_raw = (string) ($data['qualitative_comments'] ?? '');
    $comments = $comments_raw === '' ? '' : validate_string($comments_raw, 'qualitative_comments', 2000, 0);
    $final_score = calculate_final_score($marks);

    $stmt = $pdo->prepare(
        'INSERT INTO Assessments (
            internship_id, task_mark, safety_mark, knowledge_mark,
            report_mark, clarity_mark, learning_mark, project_mgt_mark,
            time_mgt_mark, qualitative_comments, final_calculated_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            task_mark = VALUES(task_mark),
            safety_mark = VALUES(safety_mark),
            knowledge_mark = VALUES(knowledge_mark),
            report_mark = VALUES(report_mark),
            clarity_mark = VALUES(clarity_mark),
            learning_mark = VALUES(learning_mark),
            project_mgt_mark = VALUES(project_mgt_mark),
            time_mgt_mark = VALUES(time_mgt_mark),
            qualitative_comments = VALUES(qualitative_comments),
            final_calculated_score = VALUES(final_calculated_score)'
    );

    $stmt->execute([
        $internship_id,
        $marks['task_mark'],
        $marks['safety_mark'],
        $marks['knowledge_mark'],
        $marks['report_mark'],
        $marks['clarity_mark'],
        $marks['learning_mark'],
        $marks['project_mgt_mark'],
        $marks['time_mgt_mark'],
        $comments,
        $final_score,
    ]);

    json_response([
        'message' => 'Assessment saved.',
        'internship_id' => $internship_id,
        'final_calculated_score' => $final_score,
    ], $method === 'POST' ? 201 : 200);
}

method_not_allowed();
?>
