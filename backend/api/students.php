<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function student_payload(array $row): array
{
    return [
        'student_id' => $row['student_id'],
        'student_name' => $row['student_name'],
        'programme' => $row['programme'],
    ];
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    require_auth();

    $search = substr(trim((string) ($_GET['search'] ?? '')), 0, 100);
    if ($search !== '') {
        $stmt = $pdo->prepare(
            'SELECT student_id, student_name, programme
             FROM Students
             WHERE student_id LIKE ? OR student_name LIKE ?
             ORDER BY student_name'
        );
        $term = '%' . $search . '%';
        $stmt->execute([$term, $term]);
    } else {
        $stmt = $pdo->query(
            'SELECT student_id, student_name, programme
             FROM Students
             ORDER BY student_name'
        );
    }

    json_response(['students' => array_map('student_payload', $stmt->fetchAll(PDO::FETCH_ASSOC))]);
}

if ($method === 'POST') {
    require_role('Admin');
    $data = read_json_body();
    require_fields($data, ['student_id', 'student_name', 'programme']);

    $student_id = validate_string($data['student_id'], 'student_id', 8, 8, '/^20\d{6}$/');
    $student_name = validate_string($data['student_name'], 'student_name', 100, 2);
    $programme = validate_string($data['programme'], 'programme', 100, 2);

    $stmt = $pdo->prepare(
        'INSERT INTO Students (student_id, student_name, programme)
         VALUES (?, ?, ?)'
    );
    $stmt->execute([$student_id, $student_name, $programme]);

    json_response(['message' => 'Student created.'], 201);
}

if ($method === 'PUT') {
    require_role('Admin');
    $data = read_json_body();
    require_fields($data, ['student_id', 'student_name', 'programme']);

    $student_id = validate_string($data['student_id'], 'student_id', 8, 8, '/^20\d{6}$/');
    $student_name = validate_string($data['student_name'], 'student_name', 100, 2);
    $programme = validate_string($data['programme'], 'programme', 100, 2);

    $stmt = $pdo->prepare(
        'UPDATE Students
         SET student_name = ?, programme = ?
         WHERE student_id = ?'
    );
    $stmt->execute([$student_name, $programme, $student_id]);

    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Student not found or no changes made.'], 404);
    }

    json_response(['message' => 'Student updated.']);
}

if ($method === 'DELETE') {
    require_role('Admin');
    $data = read_json_body();
    $student_id = validate_string(
        $data['student_id'] ?? $_GET['student_id'] ?? '',
        'student_id',
        8,
        8,
        '/^20\d{6}$/'
    );

    $stmt = $pdo->prepare('DELETE FROM Students WHERE student_id = ?');
    $stmt->execute([$student_id]);

    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Student not found.'], 404);
    }

    json_response(['message' => 'Student deleted.']);
}

method_not_allowed();
?>
