<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    method_not_allowed();
}

$user = require_auth();
$search = trim((string) ($_GET['search'] ?? ''));

$sql = "SELECT s.student_id, s.student_name, s.programme,
               i.internship_id, i.company_name,
               u.user_id AS assessor_id, u.username AS assessor_username,
               a.assessment_id,
               a.task_mark, a.safety_mark, a.knowledge_mark, a.report_mark,
               a.clarity_mark, a.learning_mark, a.project_mgt_mark, a.time_mgt_mark,
               a.qualitative_comments, a.final_calculated_score
        FROM Students s
        JOIN Internships i ON s.student_id = i.student_id
        JOIN Users u ON i.assessor_id = u.user_id
        LEFT JOIN Assessments a ON i.internship_id = a.internship_id";

$where = [];
$params = [];

if ($user['role'] === 'Assessor') {
    $where[] = 'i.assessor_id = ?';
    $params[] = $user['user_id'];
}

if ($search !== '') {
    $where[] = '(s.student_id LIKE ? OR s.student_name LIKE ?)';
    $term = '%' . $search . '%';
    $params[] = $term;
    $params[] = $term;
}

if (count($where) > 0) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}

$sql .= ' ORDER BY s.student_name';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

json_response(['results' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
?>
