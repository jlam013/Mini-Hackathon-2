#include <iostream>
#include <string>
#include <sqlite3.h>


using namespace std;

//database connection function (Claude generated) that returns the database
sqlite3* connectDB() {
    sqlite3* db;
    int rc = sqlite3_open("forum.db", &db);
    
    if (rc != SQLITE_OK) {
        cerr << "Cannot open database: " << sqlite3_errmsg(db) << endl;
        return nullptr;
    }
    
    return db;
}

//obtains the upvote count from SQL thingy (claude generated)
int getUpvoteCount(string post_id) {
    sqlite3* db = connectDB();
    if (db == nullptr) {
        return -1;
    }

    string query = "Select the upvotes from posts where id = " + post_id;

    sqlite3_stmt* stmt;

    int upvotes = 0;
    if (sqlite3_step(stmt) == SQLITE_ROW)   {
        upvotes = sqlite3_column_int(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);
    return upvotes;
}

//obtains the downvote count from SQL thingy (claude generated)
int getDownvoteCount(string post_id) {
     sqlite3* db = connectDB();
    if (db == nullptr) return -1;
    
    string query = "SELECT downvotes FROM posts WHERE id = " + post_id;
    
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr);
    
    int downvotes = 0;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        downvotes = sqlite3_column_int(stmt, 0);
    }
    
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    
    return downvotes;
}

//obtains the comment count from SQL thingy (claude generated)
int getCommentCount(string post_id) {
     sqlite3* db = connectDB();
    if (db == nullptr) return -1;
    
    string query = "SELECT COUNT(*) FROM comments WHERE post_id = " + post_id;
    
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr);
    
    int count = 0;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        count = sqlite3_column_int(stmt, 0);
    }
    
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    
    return count;
}

//check if user already voted on a post (claude generated)
bool hasUserVoted(string user_id, string post_id) {
    sqlite3* db = connectDB();
    if (db == nullptr) return false;
    
    string query = "SELECT COUNT(*) FROM votes WHERE user_id = " + user_id + 
                   " AND post_id = " + post_id;
    
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr);
    
    bool voted = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        int count = sqlite3_column_int(stmt, 0);
        voted = (count > 0);
    }
    
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    
    return voted;
}

//handles the upvoting functionality that counts the score up when clicked (claude generated)
int handleUpvote(string post_id, string user_id) {
 //check if user already voted
    if (hasUserVoted(user_id, post_id)) {
        cout << "ERROR: Already voted" << endl;
        return -1;
    }
    
    sqlite3* db = connectDB();
    if (db == nullptr) return -1;
    
    char* errMsg = nullptr;
    
    //start transaction
    sqlite3_exec(db, "BEGIN TRANSACTION", nullptr, nullptr, &errMsg);
    
    //increment upvote count
    string updateQuery = "UPDATE posts SET upvotes = upvotes + 1 WHERE id = " + post_id;
    int rc = sqlite3_exec(db, updateQuery.c_str(), nullptr, nullptr, &errMsg);
    
    if (rc != SQLITE_OK) {
        cerr << "UPDATE failed: " << errMsg << endl;
        sqlite3_free(errMsg);
        sqlite3_exec(db, "ROLLBACK", nullptr, nullptr, nullptr);
        sqlite3_close(db);
        return -1;
    }
    
    //record the vote
    string insertQuery = "INSERT INTO votes (user_id, post_id, vote_type) VALUES (" +
                        user_id + ", " + post_id + ", 'upvote')";
    rc = sqlite3_exec(db, insertQuery.c_str(), nullptr, nullptr, &errMsg);
    
    if (rc != SQLITE_OK) {
        cerr << "INSERT failed: " << errMsg << endl;
        sqlite3_free(errMsg);
        sqlite3_exec(db, "ROLLBACK", nullptr, nullptr, nullptr);
        sqlite3_close(db);
        return -1;
    }
    
    //commit transaction
    sqlite3_exec(db, "COMMIT", nullptr, nullptr, nullptr);
    
    //get new upvote count
    int newCount = getUpvoteCount(post_id);
    cout << "SUCCESS: Post " << post_id << " now has " << newCount << " upvotes" << endl;
    
    sqlite3_close(db);
    return newCount;
}

//handles the downvoting functionality that counts the score down when clicked (claude generated)
int handleDownvote(string post_id, string user_id) {
     //check if user already voted
    if (hasUserVoted(user_id, post_id)) {
        cout << "ERROR: Already voted" << endl;
        return -1;
    }
    
    sqlite3* db = connectDB();
    if (db == nullptr) return -1;
    
    char* errMsg = nullptr;
    
    sqlite3_exec(db, "BEGIN TRANSACTION", nullptr, nullptr, &errMsg);
    
    //increment downvote count
    string updateQuery = "UPDATE posts SET downvotes = downvotes + 1 WHERE id = " + post_id;
    sqlite3_exec(db, updateQuery.c_str(), nullptr, nullptr, &errMsg);
    
    //record the vote
    string insertQuery = "INSERT INTO votes (user_id, post_id, vote_type) VALUES (" +
                        user_id + ", " + post_id + ", 'downvote')";
    sqlite3_exec(db, insertQuery.c_str(), nullptr, nullptr, &errMsg);
    
    sqlite3_exec(db, "COMMIT", nullptr, nullptr, nullptr);
    
    int newCount = getDownvoteCount(post_id);
    cout << "SUCCESS: Post " << post_id << " now has " << newCount << " downvotes" << endl;
    
    sqlite3_close(db);
    return newCount;
}

//handles the comment count and its functionality I think (claude generated)
void handleComment(string post_id, string user_id, string text) {
     sqlite3* db = connectDB();
    if (db == nullptr) return;
    
    //escape single quotes to prevent SQL errors
    string escaped_text = text;
    size_t pos = 0;
    while ((pos = escaped_text.find("'", pos)) != string::npos) {
        escaped_text.replace(pos, 1, "''");
        pos += 2;
    }
    
    char* errMsg = nullptr;
    string insertQuery = "INSERT INTO comments (post_id, user_id, content) VALUES (" +
                        post_id + ", " + user_id + ", '" + escaped_text + "')";
    
    int rc = sqlite3_exec(db, insertQuery.c_str(), nullptr, nullptr, &errMsg);
    
    if (rc != SQLITE_OK) {
        cerr << "ERROR: " << errMsg << endl;
        sqlite3_free(errMsg);
    } else {
        int commentCount = getCommentCount(post_id);
        cout << "SUCCESS: Comment added. Post " << post_id << " now has " << commentCount << " comments" << endl;
    }
    
    sqlite3_close(db);
}

//handles functionalities of a forum website
int main (int argc, char* argv[]) {

    // argv[0] = "./forum_backend" (program name)
    // argv[1] = "upvote" or "downvote" or "comment"
    // argv[2] = post_id
    // argv[3] = user_id
    // argv[4] = comment_text (if commenting)

   if (argc < 4) {
        cerr << "Usage: ./forum_backend <action> <post_id> <user_id> [text]" << endl;
        return 1;
    }

    string action = argv[1];
    string post_id = argv[2];
    string user_id = argv[3];

    if (action == "upvote") {
        handleUpvote(post_id, user_id);
    }
    else if (action == "downvote") {
        handleDownvote(post_id, user_id);
    }
    else if (action == "comment") {
        if (argc < 5) {
            cerr << "ERROR: Comment text required" << endl;
            return 1;
        }
        handleComment(post_id, user_id, argv[4]);
    }
    else {
        cout << "Error: Unknown action" << endl;
        return 1;
    }
        
    return 0;
}

