<?php
session_start();
require_once 'db.php'; // Connect to the database

$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // 1. Find the user in the database
    $stmt = $pdo->prepare("SELECT * FROM Users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // 2. Check if user exists AND password is correct
    if ($user && password_verify($password, $user['password_hash'])) {
        // Save their info in the session
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['role'] = $user['role'];

        // 3. THE TRAFFIC COP LOGIC
        if ($user['role'] == 'Admin') {
            header("Location: dashboard.php"); // Send Admin here
        } else {
            header("Location: assessor_dashboard.php"); // Send Assessor here
        }
        exit;
    } else {
        $error = "<p style='color:red;'>Invalid username or password.</p>";
    }
}
?>

<!DOCTYPE html>
<html>

<body>
    <h2>System Login</h2>
    <?php echo $error; ?>
    <form method="post">
        <label>Username:</label><br>
        <input type="text" name="username" required><br><br>

        <label>Password:</label><br>
        <input type="password" name="password" required><br><br>

        <button type="submit">Login</button>
    </form>
</body>

</html>