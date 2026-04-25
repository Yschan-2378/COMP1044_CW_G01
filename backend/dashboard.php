<?php
session_start();
require_once 'db.php';

//check
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Admin') {
    die("Access Denied. Please log in as an Admin.");
}

$message = "";

//adding a new studebnt
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_student'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO Students (student_id, student_name, programme) VALUES (?, ?, ?)");
        $stmt->execute([$_POST['student_id'], $_POST['student_name'], $_POST['programme']]);
        $message = "<p style='color: green;'>Success! Student added.</p>";
    } catch (PDOException $e) {
        $message = "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    }
}

//creating a new Assessor
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['add_assessor'])) {
    try {
        $hashed_password = password_hash($_POST['assessor_password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO Users (username, password_hash, role) VALUES (?, ?, 'Assessor')");
        $stmt->execute([$_POST['assessor_username'], $hashed_password]);
        $message = "<p style='color: green;'>Success! Assessor account created.</p>";
    } catch (PDOException $e) {
        $message = "<p style='color: red;'>Error: Username might already exist.</p>";
    }
}

//assigning the Internship
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['assign_internship'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO Internships (student_id, assessor_id, company_name) VALUES (?, ?, ?)");
        $stmt->execute([$_POST['student_id'], $_POST['assessor_id'], $_POST['company_name']]);
        $message = "<p style='color: green;'>Success! Internship assigned.</p>";
    } catch (PDOException $e) {
        $message = "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
    }
}

// get all students to populate the dropdown
$students = $pdo->query("SELECT student_id, student_name FROM Students")->fetchAll();
// get all assessors to populate the dropdown
$assessors = $pdo->query("SELECT user_id, username FROM Users WHERE role = 'Assessor'")->fetchAll();
?>

<!DOCTYPE html>
<html>

<body>
    <h1>Welcome to the Admin Dashboard</h1>
    <a href="view_results.php"><button>View All Results & Search</button></a>
    <a href="logout.php">Logout</a>
    <hr>

    <?php echo $message; ?>

    <h2>1. Add New Student</h2>
    <form method="post">
        <label>Student ID:</label><br>
        <input type="text" name="student_id" required><br><br>
        <label>Student Name:</label><br>
        <input type="text" name="student_name" required><br><br>
        <label>Programme:</label><br>
        <input type="text" name="programme" required><br><br>
        <button type="submit" name="add_student">Save Student</button>
    </form>
    <hr>

    <h2>2. Create Assessor Account</h2>
    <form method="post">
        <label>Assessor Username:</label><br>
        <input type="text" name="assessor_username" required><br><br>
        <label>Temporary Password:</label><br>
        <input type="password" name="assessor_password" required><br><br>
        <button type="submit" name="add_assessor">Create Assessor</button>
    </form>
    <hr>

    <h2>3. Assign Internship</h2>
    <form method="post">
        <label>Select Student:</label><br>
        <select name="student_id" required>
            <option value="">-- Choose a Student --</option>
            <?php foreach ($students as $student): ?>
                <option value="<?php echo htmlspecialchars($student['student_id']); ?>">
                    <?php echo htmlspecialchars($student['student_id'] . " - " . $student['student_name']); ?>
                </option>
            <?php endforeach; ?>
        </select><br><br>

        <label>Select Assessor:</label><br>
        <select name="assessor_id" required>
            <option value="">-- Choose an Assessor --</option>
            <?php foreach ($assessors as $assessor): ?>
                <option value="<?php echo htmlspecialchars($assessor['user_id']); ?>">
                    <?php echo htmlspecialchars($assessor['username']); ?>
                </option>
            <?php endforeach; ?>
        </select><br><br>

        <label>Company Name:</label><br>
        <input type="text" name="company_name" placeholder="e.g. Tech Corp" required><br><br>

        <button type="submit" name="assign_internship">Assign Internship</button>
    </form>

</body>

</html>