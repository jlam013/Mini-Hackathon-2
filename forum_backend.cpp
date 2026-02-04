#include <iostream>
#include <string>
#include <sqlite3.h>

using namespace std;
//half ai generated
//database connection function
sqlite3* connectDB() {
    sqlite3* db;
    int rc = sqlite3_open("forum.db", &db);
    
    if (rc != SQLITE_OK) {
        cerr << "Cannot open database: " << sqlite3_errmsg(db) << endl;
        return nullptr;
    }
    
    return db;
}

//get user's current vote on a post (returns "upvote", "downvote", or "" if no vote)
string getUserVote(string user_id, string post_id) {
    sqlite3* db = connectDB();
    if (db == nullptr) return "";
    
    string query = "SELECT vote_type FROM votes WHERE user_id = " + user_id + 
                   " AND post_id = " + post_id;
    
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr);
    
    string vote_type = "";
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char* result = sqlite3_column_text(stmt, 0);
        if (result) {
            vote_type = string((char*)result);
        }
    }
    
    sqlite3_finalize(stmt);
    sqlite3_close(db);
    
    return vote_type;
}

//remove a user's vote
void removeVote(sqlite3* db, string user_id, string post_id, string old_vote_type) {
    //decrement the appropriate counter
    string updateQuery;
    if (old_vote_type == "upvote") {
        updateQuery = "UPDATE posts SET upvotes = upvotes - 1 WHERE id = " + post_id;
    } else {
        updateQuery = "UPDATE posts SET downvotes = downvotes - 1 WHERE id = " + post_id;
    }
    sqlite3_exec(db, updateQuery.c_str(), nullptr, nullptr, nullptr);
    
    //delete the vote record
    string deleteQuery = "DELETE FROM votes WHERE user_id = " + user_id + 
                        " AND post_id = " + post_id;
    sqlite3_exec(db, deleteQuery.c_str(), nullptr, nullptr, nullptr);
}

//add a vote
void addVote(sqlite3* db, string user_id, string post_id, string vote_type) {
    //increment the appropriate counter
    string updateQuery;
    if (vote_type == "upvote") {
        updateQuery = "UPDATE posts SET upvotes = upvotes + 1 WHERE id = " + post_id;
    } else {
        updateQuery = "UPDATE posts SET downvotes = downvotes + 1 WHERE id = " + post_id;
    }
    sqlite3_exec(db, updateQuery.c_str(), nullptr, nullptr, nullptr);
    
    //insert the vote record
    string insertQuery = "INSERT INTO votes (user_id, post_id, vote_type) VALUES (" +
                        user_id + ", " + post_id + ", '" + vote_type + "')";
    sqlite3_exec(db, insertQuery.c_str(), nullptr, nullptr, nullptr);
}

//handle upvote with toggle functionality
void handleUpvote(string post_id, string user_id) {
    string current_vote = getUserVote(user_id, post_id);
    
    sqlite3* db = connectDB();
    if (db == nullptr) return;
    
    sqlite3_exec(db, "BEGIN TRANSACTION", nullptr, nullptr, nullptr);
    
    if (current_vote == "upvote") {
        //already upvoted - remove the upvote (toggle off)
        removeVote(db, user_id, post_id, "upvote");
        cout << "SUCCESS: Upvote removed from post " << post_id << endl;
    }
    else if (current_vote == "downvote") {
        //currently downvoted - switch to upvote
        removeVote(db, user_id, post_id, "downvote");
        addVote(db, user_id, post_id, "upvote");
        cout << "SUCCESS: Changed to upvote on post " << post_id << endl;
    }
    else {
        //no vote yet - add upvote
        addVote(db, user_id, post_id, "upvote");
        cout << "SUCCESS: Upvoted post " << post_id << endl;
    }
    
    sqlite3_exec(db, "COMMIT", nullptr, nullptr, nullptr);
    sqlite3_close(db);
}

//handle downvote with toggle functionality
void handleDownvote(string post_id, string user_id) {
    string current_vote = getUserVote(user_id, post_id);
    
    sqlite3* db = connectDB();
    if (db == nullptr) return;
    
    sqlite3_exec(db, "BEGIN TRANSACTION", nullptr, nullptr, nullptr);
    
    if (current_vote == "downvote") {
        //already downvoted - remove the downvote (toggle off)
        removeVote(db, user_id, post_id, "downvote");
        cout << "SUCCESS: Downvote removed from post " << post_id << endl;
    }
    else if (current_vote == "upvote") {
        //currently upvoted - switch to downvote
        removeVote(db, user_id, post_id, "upvote");
        addVote(db, user_id, post_id, "downvote");
        cout << "SUCCESS: Changed to downvote on post " << post_id << endl;
    }
    else {
        //no vote yet - add downvote
        addVote(db, user_id, post_id, "downvote");
        cout << "SUCCESS: Downvoted post " << post_id << endl;
    }
    
    sqlite3_exec(db, "COMMIT", nullptr, nullptr, nullptr);
    sqlite3_close(db);
}

// handle adding a comment
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
        cout << "SUCCESS: Comment added to post " << post_id << endl;
    }
    
    sqlite3_close(db);
}

//main
int main(int argc, char* argv[]) {
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