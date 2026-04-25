<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    require_role('Admin');

    $stmt = $pdo->query(
        "SELECT u.user_id, u.username, u.role, COUNT(i.internship_id) AS assigned_count
         FROM Users u
         LEFT JOIN Internships i ON u.user_id = i.assessor_id
         WHERE u.role = 'Assessor'
         GROUP BY u.user_id, u.username, u.role
         ORDER BY u.username"
    );

    json_response(['assessors' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

if ($method === 'POST') {
    require_role('Admin');
    $data = read_json_body();
    require_fields($data, ['username', 'password']);

    $hashed_password = password_hash((string) $data['password'], PASSWORD_DEFAULT);
    $stmt = $pdo->prepare(
        "INSERT INTO Users (username, password_hash, role)
         VALUES (?, ?, 'Assessor')"
    );
    $stmt->execute([trim((string) $data['username']), $hashed_password]);

    json_response([
        'message' => 'Assessor account created.',
        'user_id' => (int) $pdo->lastInsertId(),
    ], 201);
}

if ($method === 'PUT') {
    require_role('Admin');
    $data = read_json_body();
    require_fields($data, ['user_id', 'username']);

    if (isset($data['password']) && trim((string) $data['password']) !== '') {
        $stmt = $pdo->prepare(
            "UPDATE Users
             SET username = ?, password_hash = ?
             WHERE user_id = ? AND role = 'Assessor'"
        );
        $stmt->execute([
            trim((string) $data['username']),
            password_hash((string) $data['password'], PASSWORD_DEFAULT),
            (int) $data['user_id'],
        ]);
    } else {
        $stmt = $pdo->prepare(
            "UPDATE Users
             SET username = ?
             WHERE user_id = ? AND role = 'Assessor'"
        );
        $stmt->execute([
            trim((string) $data['username']),
            (int) $data['user_id'],
        ]);
    }

    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Assessor not found or no changes made.'], 404);
    }

    json_response(['message' => 'Assessor account updated.']);
}

if ($method === 'DELETE') {
    require_role('Admin');
    $data = read_json_body();
    $user_id = (int) ($data['user_id'] ?? $_GET['user_id'] ?? 0);
    if ($user_id <= 0) {
        json_response(['error' => 'Missing required field: user_id.'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM Users WHERE user_id = ? AND role = 'Assessor'");
    $stmt->execute([$user_id]);

    if ($stmt->rowCount() === 0) {
        json_response(['error' => 'Assessor not found.'], 404);
    }

    json_response(['message' => 'Assessor account deleted.']);
}

method_not_allowed();
?>
