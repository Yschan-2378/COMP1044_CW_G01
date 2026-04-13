<?php
session_start();
require_once 'db.php'; // Bring in your database connection

$error = '';

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = trim($_POST['username']);
    $pass = trim($_POST['password']);

    // Basic Validation
    if (empty($user) || empty($pass)) {
        $error = "Please enter both username and password.";
    } else {
        // Prepare a secure SQL statement to prevent SQL injection
        $stmt = $pdo->prepare("SELECT user_id, password_hash, role FROM Users WHERE username = :username");
        $stmt->bindParam(':username', $user);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $row = $stmt->fetch();
            // Verify the hashed password
            if (password_verify($pass, $row['password_hash'])) {
                // Password is correct, start the session
                $_SESSION['user_id'] = $row['user_id'];
                $_SESSION['role'] = $row['role'];

                // Redirect based on role
                if ($row['role'] == 'Admin') {
                    header("location: admin_dashboard.php");
                } else {
                    header("location: assessor_dashboard.php");
                }
                exit;
            } else {
                $error = "Invalid password.";
            }
        } else {
            $error = "No account found with that username.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Result Management System - Login</title>
    <style>
        /* Basic CSS to keep the UI clean */
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f9;
        }

        .login-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 300px;
        }

        .login-container h2 {
            text-align: center;
            color: #333;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
        }

        .form-group input {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }

        .btn {
            width: 100%;
            padding: 10px;
            background: #0056b3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn:hover {
            background: #004494;
        }

        .error {
            color: red;
            text-align: center;
            margin-bottom: 10px;
            font-size: 0.9em;
        }
    </style>
</head>

<body>

    <div class="login-container">
        <h2>System Login</h2>

        <?php
        // Display error messages if validation fails
        if (!empty($error)) {
            echo '<div class="error">' . $error . '</div>';
        }
        ?>

        <form action="index.php" method="post">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" required>
            </div>
            <div class="form-group">
                <input type="submit" class="btn" value="Login">
            </div>
        </form>
    </div>

</body>

</html>