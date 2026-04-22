<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['user_id'])) {
    die("Access Denied. Please log in.");
}

$role = $_SESSION['role'];
$user_id = $_SESSION['user_id'];

$search_query = "";
$search_param = "%"; //"match anything"

if (isset($_GET['search'])) {
    $search_query = $_GET['search'];
    $search_param = "%" . $search_query . "%"; 
}


if ($role == 'Admin') {
    // fetch ALL students and their grades
    $sql = "SELECT s.student_id, s.student_name, i.company_name, a.final_calculated_score 
            FROM Students s
            JOIN Internships i ON s.student_id = i.student_id
            LEFT JOIN Assessments a ON i.internship_id = a.internship_id
            WHERE s.student_name LIKE :search OR s.student_id LIKE :search";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['search' => $search_param]);

} else {
    // fetch ONLY assigned students
    $sql = "SELECT s.student_id, s.student_name, i.company_name, a.final_calculated_score 
            FROM Students s
            JOIN Internships i ON s.student_id = i.student_id
            LEFT JOIN Assessments a ON i.internship_id = a.internship_id
            WHERE i.assessor_id = :user_id 
            AND (s.student_name LIKE :search OR s.student_id LIKE :search)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['user_id' => $user_id, 'search' => $search_param]);
}

$results = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<body>
    <h1>Internship Results</h1>
    
    <?php if ($role == 'Admin'): ?>
        <a href="dashboard.php">← Back to Admin Dashboard</a>
    <?php else: ?>
        <a href="assessor_dashboard.php">← Back to Assessor Dashboard</a>
    <?php endif; ?>
    <hr>

    <form method="GET" action="view_results.php">
        <label>Search by Name or ID:</label>
        <input type="text" name="search" value="<?php echo htmlspecialchars($search_query); ?>" placeholder="e.g. S12345">
        <button type="submit">Search</button>
        <a href="view_results.php"><button type="button">Clear</button></a>
    </form>
    <br>

    <table border="1" cellpadding="10">
        <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Company</th>
            <th>Final Score</th>
        </tr>
        
        <?php if (count($results) > 0): ?>
            <?php foreach ($results as $row): ?>
                <tr>
                    <td><?php echo htmlspecialchars($row['student_id']); ?></td>
                    <td><?php echo htmlspecialchars($row['student_name']); ?></td>
                    <td><?php echo htmlspecialchars($row['company_name']); ?></td>
                    <td>
                        <?php 
                        if ($row['final_calculated_score'] !== null) {
                            echo "<strong>" . htmlspecialchars($row['final_calculated_score']) . "%</strong>";
                        } else {
                            echo "<span style='color:gray;'>Not Graded Yet</span>";
                        }
                        ?>
                    </td>
                </tr>
            <?php endforeach; ?>
            
        <?php else: ?>
            <tr><td colspan="4">No results found.</td></tr>
        <?php endif; ?>
    </table>

</body>
</html>