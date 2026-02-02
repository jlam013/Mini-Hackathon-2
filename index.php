<?php
//ai generated
// index.php - Main forum page

try {
    $db = new PDO('sqlite:forum.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

// Get all posts with user info
$query = $db->query("
    SELECT posts.*, users.username 
    FROM posts 
    JOIN users ON posts.author_id = users.id 
    ORDER BY posts.created_at DESC
");
$posts = $query->fetchAll(PDO::FETCH_ASSOC);

// Current user (hardcoded for now)
$current_user_id = 1;

// Function to check if user voted on a post
function getUserVote($db, $user_id, $post_id) {
    $stmt = $db->prepare("SELECT vote_type FROM votes WHERE user_id = ? AND post_id = ?");
    $stmt->execute([$user_id, $post_id]);
    $result = $stmt->fetch();
    return $result ? $result['vote_type'] : null;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Forum</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .post {
            background: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .post-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .post-meta {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
        }
        .post-content {
            color: #444;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        .vote-section {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        .vote-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .upvote-btn {
            background-color: #4CAF50;
            color: white;
        }
        .upvote-btn:hover {
            background-color: #45a049;
        }
        .upvote-btn.active {
            background-color: #2d7a30;
            font-weight: bold;
        }
        .downvote-btn {
            background-color: #f44336;
            color: white;
        }
        .downvote-btn:hover {
            background-color: #da190b;
        }
        .downvote-btn.active {
            background-color: #b71c0c;
            font-weight: bold;
        }
        .vote-count {
            font-weight: bold;
            padding: 0 10px;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <h1>🎓 Student Forum</h1>
    
    <?php foreach ($posts as $post): ?>
        <?php $user_vote = getUserVote($db, $current_user_id, $post['id']); ?>
        <div class="post">
            <div class="post-title"><?php echo htmlspecialchars($post['title']); ?></div>
            <div class="post-meta">
                Posted by <?php echo htmlspecialchars($post['username']); ?> 
                on <?php echo date('M j, Y', strtotime($post['created_at'])); ?>
            </div>
            <div class="post-content">
                <?php echo nl2br(htmlspecialchars($post['content'])); ?>
            </div>
            
            <div class="vote-section">
                <!-- Upvote button -->
                <form method="POST" action="process.php" style="display: inline;">
                    <input type="hidden" name="action" value="upvote">
                    <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                    <input type="hidden" name="user_id" value="<?php echo $current_user_id; ?>">
                    <button type="submit" class="vote-btn upvote-btn <?php echo $user_vote === 'upvote' ? 'active' : ''; ?>">
                        👍 Upvote <?php echo $user_vote === 'upvote' ? '✓' : ''; ?>
                    </button>
                </form>
                
                <span class="vote-count">
                    <?php echo $post['upvotes']; ?> upvotes
                </span>
                
                <!-- Downvote button -->
                <form method="POST" action="process.php" style="display: inline;">
                    <input type="hidden" name="action" value="downvote">
                    <input type="hidden" name="post_id" value="<?php echo $post['id']; ?>">
                    <input type="hidden" name="user_id" value="<?php echo $current_user_id; ?>">
                    <button type="submit" class="vote-btn downvote-btn <?php echo $user_vote === 'downvote' ? 'active' : ''; ?>">
                        👎 Downvote <?php echo $user_vote === 'downvote' ? '✓' : ''; ?>
                    </button>
                </form>
                
                <span class="vote-count">
                    <?php echo $post['downvotes']; ?> downvotes
                </span>
            </div>
        </div>
    <?php endforeach; ?>
    
</body>
</html>