<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $user = require_auth();

    $sql = "SELECT i.internship_id, i.student_id, s.student_name, s.programme,
                   i.assessor_id, u.username AS assessor_username,
                   i.company_name,
                   a.assessment_id,
                   a.final_calculated_score
            FROM Internships i
            JOIN Students s ON i.student_id = s.student_id
            JOIN Users u ON i.assessor_id = u.user_id
            LEFT JOIN Assessments a ON i.internship_id = a.internship_id";

    $params = [];
    if ($user['role'] === 'Assessor') {
        $sql .= ' WHERE i.assessor_id = ?';
        $params[] = $user['user_id'];
    }

    $sql .= ' ORDER BY s.student_name';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    json_response(['internships' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

if ($method === 'POST') {
    require_role('Admin');
    $data = read_json_body();
    require_fields($data, ['student_id', 'assessor_id', 'company_name']);

    $stmt = $pdo->prepare(
        'INSERT INTO Internships (student_id, assessor_id, company_name)
         VALUES (?, ?, ?)'
    );
    $stmt->execute([
        trim((string) $data['student_id']),
        (int) $data['assessor_id'],
        trim((string) $data['company_name']),
    ]);

    json_response([
        'message' => 'Internship assigned.',
        'internship_id' => (int) $pdo->lastInsertId(),
    ], 201);
}

if ($method === 'PUT') {
    require_role('Admin');
    $data = read_json_body();
    require_fields($data, ['internship_id', 'student_id', 'assessor_id', 'company_name']);

    $stmt = $pdo->prepare(
        'UPDATE Internships
         SET student_id = ?, assessor_id = ?, company_name = ?
         WHERE internship_id = ?'
    );
    $stmt->execute([
        trim((string) $data['student_id']),
        (int) $data['assessor_id'],
        trim((string) $data['company_name']),
        (int) $data['internship_id'],
    ]);

    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Internship not found or no changes made.'], 404);
    }

    json_response(['message' => 'Internship updated.']);
}

if ($method === 'DELETE') {
    require_role('Admin');
    $data = read_json_body();
    $internship_id = (int) ($data['internship_id'] ?? $_GET['internship_id'] ?? 0);
    if ($internship_id <= 0) {
        json_response(['error' => 'Missing required field: internship_id.'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM Internships WHERE internship_id = ?');
    $stmt->execute([$internship_id]);

    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Internship not found.'], 404);
    }

    json_response(['message' => 'Internship deleted.']);
}

method_not_allowed();
?>
