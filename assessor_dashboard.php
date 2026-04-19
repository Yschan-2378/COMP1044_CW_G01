<?php
session_start();
require_once 'db.php';

//only let Assessors in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Assessor') {
    die("Access Denied. Please log in as an Assessor.");
}

$assessor_id = $_SESSION['user_id'];

//fetch only the students assigned to this login Assessor
$sql = "SELECT i.internship_id, s.student_id, s.student_name, i.company_name 
        FROM Internships i
        JOIN Students s ON i.student_id = s.student_id
        WHERE i.assessor_id = :assessor_id";

$stmt = $pdo->prepare($sql);
$stmt->execute([':assessor_id' => $assessor_id]);
$assigned_students = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>

<body>
    <h1>Assessor Portal</h1>
    <a href="logout.php">Logout</a>
    <hr>

    <h2>Your Assigned Students</h2>

    <?php if (count($assigned_students) > 0): ?>
        <table border="1" cellpadding="10">
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Company</th>
                <th>Action</th>
            </tr>
            <?php foreach ($assigned_students as $student): ?>
                <tr>
                    <td><?php echo htmlspecialchars($student['student_id']); ?></td>
                    <td><?php echo htmlspecialchars($student['student_name']); ?></td>
                    <td><?php echo htmlspecialchars($student['company_name']); ?></td>
                    <td>
                        <a href="grade_student.php?internship_id=<?php echo $student['internship_id']; ?>">
                            Enter Marks
                        </a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php else: ?>
        <p>You have no students assigned to you yet.</p>
    <?php endif; ?>

</body>

</html>