<?php
session_start();
require_once 'db.php'; // Bring in the database connection

// Security check
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Assessor') {
    die("Access Denied.");
}

$message = "";

// get the ID from the URL when the page first loads
if (isset($_GET['internship_id'])) {
    $internship_id = $_GET['internship_id'];
} elseif (isset($_POST['internship_id'])) {
    $internship_id = $_POST['internship_id'];
} else {
    die("Error: No student selected.");
}

// handle Form Submission and Calculation
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // grab all marks from your HTML inputs
    $task = floatval($_POST['task']);
    $safety = floatval($_POST['safety']);
    $connectivity = floatval($_POST['connectivity']);
    $present = floatval($_POST['present']);
    $clarity = floatval($_POST['clarity']);
    $learn = floatval($_POST['learn']);
    $manage = floatval($_POST['manage']);
    $time = floatval($_POST['time']);
    $comment = trim($_POST['comment']);

    $final_score = ($task * 0.10) +
        ($safety * 0.10) +
        ($connectivity * 0.10) +
        ($present * 0.15) +
        ($clarity * 0.10) +
        ($learn * 0.15) +
        ($manage * 0.15) +
        ($time * 0.15);

    // round to 2 decimal
    $final_score = round($final_score, 2);

    // insert everything into Assessments table
    try {
        $sql = "INSERT INTO Assessments (
                    internship_id, task_mark, safety_mark, knowledge_mark, 
                    report_mark, clarity_mark, learning_mark, project_mgt_mark, 
                    time_mgt_mark, qualitative_comments, final_calculated_score
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $internship_id,
            $task,
            $safety,
            $connectivity,
            $present,
            $clarity,
            $learn,
            $manage,
            $time,
            $comment,
            $final_score
        ]);

        $message = "<p style='color: green;'>Success! Final Score Calculated: <strong>" . $final_score . "/100</strong> and saved to database.</p>";
    } catch (PDOException $e) {
        $message = "<p style='color: red;'>Database Error: " . $e->getMessage() . "</p>";
    }
}
?>

<!DOCTYPE html>

<body>
    <h2>Internship Result Entry and Mark Calculation </h2>
    <a href="assessor_dashboard.php">Back to Dashboard</a><br><br>

    <?php echo $message; ?>

    <form action="grade_student.php" method="post">

        <input type="hidden" name="internship_id" value="<?php echo htmlspecialchars($internship_id); ?>">

        <label for="task"> Undertaking Tasks/Projects:</label>
        <input type="number" id="task" name="task" max="100" min="0" required><br><br>

        <label for="safety"> Health and Safety Requirements at the Workplace:</label>
        <input type="number" id="safety" name="safety" max="100" min="0" required><br><br>

        <label for="connectivity"> Connectivity and Use of Theoretical Knowledge:</label>
        <input type="number" id="connectivity" name="connectivity" max="100" min="0" required><br><br>

        <label for="present"> Presentation of the Report as a Written Document:</label>
        <input type="number" id="present" name="present" max="100" min="0" required><br><br>

        <label for="clarity"> Clarity of Language and Illustration:</label>
        <input type="number" id="clarity" name="clarity" max="100" min="0" required><br><br>

        <label for="learn"> Lifelong Learning Activities:</label>
        <input type="number" id="learn" name="learn" max="100" min="0" required><br><br>

        <label for="manage"> Project Management:</label>
        <input type="number" id="manage" name="manage" max="100" min="0" required><br><br>

        <label for="time"> Time Management:</label>
        <input type="number" id="time" name="time" max="100" min="0" required><br><br>

        <textarea name="comment" rows="10" cols="50"></textarea><br><br>
        <input type="submit" value="Submit Grade">

    </form>
</body>

</html>