<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    method_not_allowed();
}

$data = read_json_body();
require_fields($data, ['username', 'password']);

$username = validate_string($data['username'], 'username', 50, 1);
$password = validate_string($data['password'], 'password', 100, 1);

$stmt = $pdo->prepare('SELECT user_id, username, password_hash, role FROM Users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'Invalid username or password.'], 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['user_id'];
$_SESSION['username'] = $user['username'];
$_SESSION['role'] = $user['role'];

json_response([
    'user' => [
        'user_id' => (int) $user['user_id'],
        'username' => $user['username'],
        'role' => $user['role'],
    ],
]);
?>
