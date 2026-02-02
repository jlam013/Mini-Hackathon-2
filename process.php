<?php
// process.php - Handles upvote/downvote/comment actions
//ai generated
// Enable error display for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.php');
    exit;
}

$action = $_POST['action'] ?? '';
$post_id = $_POST['post_id'] ?? '';
$user_id = $_POST['user_id'] ?? '';
$comment_text = $_POST['comment_text'] ?? '';

// Build command for C++ program
$command = '';

if ($action == 'upvote' || $action == 'downvote') {
    $command = "forum_backend.exe $action $post_id $user_id";
}
else if ($action == 'comment' && !empty($comment_text)) {
    $escaped_text = escapeshellarg($comment_text);
    $command = "forum_backend.exe comment $post_id $user_id $escaped_text";
}

// Execute C++ program
if (!empty($command)) {
    // Change to the directory where forum_backend.exe is located
    chdir(__DIR__);
    
    // Debug: Show what we're running
    echo "Running command: " . htmlspecialchars($command) . "<br><br>";
    
    exec($command, $output, $return_code);
    
    // Debug: Show results
    echo "Return code: $return_code<br>";
    echo "Output:<br>";
    echo "<pre>" . htmlspecialchars(implode("\n", $output)) . "</pre>";
    
    // Check if the C++ program ran successfully
    if ($return_code == 0 || !empty($output)) {
        echo "<br><strong>Success! The vote was recorded.</strong><br>";
        echo "<a href='index.php'>Go back to forum</a>";
    } else {
        echo "<br><strong>Error: C++ program didn't run properly</strong><br>";
        echo "<a href='index.php'>Go back to forum</a>";
    }
    
} else {
    echo "No valid action provided<br>";
    echo "<a href='index.php'>Go back to forum</a>";
}
?>