<?php
declare(strict_types=1);

$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$secure_cookie = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secure_cookie,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

require_once __DIR__ . '/../db.php';

set_exception_handler(function (Throwable $exception): void {
    $message = $exception instanceof PDOException
        ? 'Database error: ' . $exception->getMessage()
        : 'Server error: ' . $exception->getMessage();

    json_response(['error' => $message], 500);
});

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['error' => 'Invalid JSON body.'], 400);
    }

    return $data;
}

function current_user(): ?array
{
    if (!isset($_SESSION['user_id'], $_SESSION['username'], $_SESSION['role'])) {
        return null;
    }

    return [
        'user_id' => (int) $_SESSION['user_id'],
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role'],
    ];
}

function require_auth(): array
{
    $user = current_user();
    if ($user === null) {
        json_response(['error' => 'Authentication required.'], 401);
    }

    return $user;
}

function require_role(string $role): array
{
    $user = require_auth();
    if ($user['role'] !== $role) {
        json_response(['error' => 'Forbidden.'], 403);
    }

    return $user;
}

function require_fields(array $data, array $fields): void
{
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            json_response(['error' => "Missing required field: $field."], 400);
        }
    }
}

function method_not_allowed(): void
{
    json_response(['error' => 'Method not allowed.'], 405);
}

function normalize_decimal($value, string $field): float
{
    if (!is_numeric($value)) {
        json_response(['error' => "$field must be numeric."], 400);
    }

    $number = (float) $value;
    if ($number < 0 || $number > 100) {
        json_response(['error' => "$field must be between 0 and 100."], 400);
    }

    return $number;
}
?>
