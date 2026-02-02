<?php
//ai generated
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "PHP is working!<br>";

// Test database connection
try {
    $db = new PDO('sqlite:forum.db');
    echo "Database connection: SUCCESS<br>";
    
    // Test query
    $result = $db->query("SELECT COUNT(*) as count FROM posts");
    $row = $result->fetch();
    echo "Number of posts in database: " . $row['count'] . "<br>";
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
