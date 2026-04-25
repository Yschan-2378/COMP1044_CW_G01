<?php
declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    method_not_allowed();
}

json_response(['user' => require_auth()]);
?>
