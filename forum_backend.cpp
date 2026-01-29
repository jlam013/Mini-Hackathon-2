#include <iostream>
#include <string>
#include <sqlite3.h>


using namespace std;

//Database connection function (Claude generated)
sqlite3* connectDB() {
    sqlite3* db;
    int rc = sqlite3_open("forum.db", &db);
    
    if (rc != SQLITE_OK) {
        cerr << "Cannot open database: " << sqlite3_errmsg(db) << endl;
        return nullptr;
    }
    
    return db;
}


//obtains the upvote count from SQL thingy
int getUpvoteCount(string post_id) {
    return 1;
}

//obtains the downvote count from SQL thingy
int getDownvoteCount(string post_id) {
    return 1;
}

//obtains the comment count from SQL thingy
int getCommentCount(string post_id) {
    return 1;
}

//handles the upvoting functionality that counts the score up when clicked
void handleUpvote(string post_id, string user_id) {
    int upvoteCount = getUpvoteCount(post_id);
}

//handles the downvoting functionality that counts the score down when clicked
void handleDownvote(string post_id, string user_id) {
}

//handles the comment count and its functionality I think
void handleComment(string post_id, string user_id, string text) {
}

//handles functionalities of a forum website
int main (int argc, char* argv[]) {

    // argv[0] = "./forum_backend" (program name)
    // argv[1] = "upvote" or "downvote" or "comment"
    // argv[2] = post_id
    // argv[3] = user_id
    // argv[4] = comment_text (if commenting)

    string action = argv[1];

    if (action == "upvote") {
        handleUpvote(argv[2], argv[3]);
        }

    else if (action == "downvote") {
        handleDownvote(argv[2], argv[3]);
    }

    else if (action == "comment") {
        handleComment(argv[2], argv[3], argv[4]);
    }

    else { //error handling, perhaps the strings dont match with the ones in php from Hao
        cout << "Error: Unknown action" << endl;
    }
        
    return 0;
}

