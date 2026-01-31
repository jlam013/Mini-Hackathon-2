<?php
// setup_database.php - Run this ONCE to create your database

try {
    // Create/connect to SQLite database file
    $db = new PDO('sqlite:forum.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create users table
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    
    // Create posts table
    $db->exec("CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        upvotes INTEGER DEFAULT 0,
        downvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id)
    )");
    
    // Create votes table (prevents duplicate voting)
    $db->exec("CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        post_id INTEGER NOT NULL,
        vote_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
    )");
    
    // Create comments table
    $db->exec("CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )");
    
    // Insert sample users
    $db->exec("INSERT OR IGNORE INTO users (id, username, email, password_hash) VALUES 
        (1, 'john_doe', 'john@example.com', 'hashed_password_123'),
        (2, 'jane_smith', 'jane@example.com', 'hashed_password_456'),
        (3, 'bob_jones', 'bob@example.com', 'hashed_password_789')");
    
    // Insert sample posts
    $db->exec("INSERT OR IGNORE INTO posts (id, title, content, author_id, upvotes, downvotes) VALUES 
        (1, 'How do I learn C++?', 'I am new to programming and want to learn C++. Any tips?', 1, 5, 1),
        (2, 'What is a pointer?', 'Can someone explain pointers in simple terms?', 2, 12, 0),
        (3, 'Best IDE for C++?', 'What IDE do you recommend for C++ development?', 1, 8, 2),
        (4, 'Understanding References', 'What is the difference between pointers and references?', 3, 15, 0)");
    
    // Insert sample comments
    $db->exec("INSERT OR IGNORE INTO comments (id, post_id, user_id, content) VALUES 
        (1, 1, 2, 'Check out CS50! Great course for beginners.'),
        (2, 1, 3, 'I recommend learncpp.com as well!'),
        (3, 2, 1, 'Think of pointers as addresses to memory locations.')");
    
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Database Setup</title>
        <style>
            body { font-family: Arial; padding: 20px; }
            .success { color: green; }
            .btn { background: #4CAF50; color: white; padding: 10px 20px; 
                   text-decoration: none; display: inline-block; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h1 class='success'>✓ Database Setup Complete!</h1>
        <p>✓ Tables created: users, posts, votes, comments</p>
        <p>✓ Sample data inserted</p>
        <p>Database file: forum.db</p>
        <a href='index.php' class='btn'>View Forum →</a>
    </body>
    </html>";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>