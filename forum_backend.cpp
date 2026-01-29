#include <iostream>
#include <string>
#include <mysql/mysql.h>


using namespace std;

//Database connection function (Claude generated)
MYSQL* connectDB() {
    MYSQL* conn = mysql_init(NULL);
    
    if (conn == NULL) {
        cerr << "mysql_init() failed" << endl;
        return NULL;
    }
    
    // Connect to database
    if (mysql_real_connect(conn, "localhost", "root", "", "forum_db", 0, NULL, 0) == NULL) {
        cerr << "mysql_real_connect() failed: " << mysql_error(conn) << endl;
        mysql_close(conn);
        return NULL;
    }
    
    return conn;
}

//obtains the upvote count from SQL thingy
int getUpvoteCount(string post_id) {
}

//obtains the downvote count from SQL thingy
int getDownvoteCount(string post_id) {
}

//obtains the comment count from SQL thingy
int getCommentCount(string post_id) {
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

    if (action == "downvote") {
        handleDownvote(argv[2], argv[3]);
    }

    if (action == "comment") {
        handleComment(argc[2], argv[3], argv[4]);
    }

    else { //error handling, perhaps the strings dont match with the ones in php from Hao
        cout << "Error: Unknown action" << endl;
    }
        
    return 0;
}

