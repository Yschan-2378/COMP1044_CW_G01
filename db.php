<?php
$host = 'localhost';
$dbname = 'comp1044_internship_db'; // Ensure this matches what you named it in phpMyAdmin
$username = 'root'; // Default XAMPP/MAMP username
$password = ''; // Default XAMPP/MAMP password is usually blank or 'root'

try {
    // We use PDO for secure database connections
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set PDO error mode to exception for easier debugging
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("ERROR: Could not connect to the database. " . $e->getMessage());
}
?>