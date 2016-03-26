var db = require('../db');

module.exports = {
  messages: {
    get: function (res) {
      var messages;
      db.query('SELECT m.text, u.username, r.roomname FROM Messages m INNER JOIN Users u ON u.id = m.user_id INNER JOIN Rooms r ON r.id = m.room_id', function(err, rows, fields) {
        if (err) throw err;
        res.send({results: rows});
      });
    }, // a function which produces all the messages
    post: function (message) {
      // 1. get user id (if DNE make new user and get id)
        // get id for message.username in Users
        // INSERT IGNORE INTO Users 
      // 2. get room id (if DNE make new room and get id)
      // 3. query insert into messages user id, room id, text


      var roomId = 1; // TODO: replace with real room id
      // 1. insert id to user
      // 2. select id of user
      // 3. 
      /* try to find id of user */
      db.query('SELECT id FROM Users WHERE username = ?', [message.username], function(err, rows) {
        if (err) { throw err; }
        var userId;
        /* if user doesn't exist... */
        if (rows.length < 1) {
          /* insert user... */
          db.query('INSERT INTO Users VALUES (null, ?)', [message.username], function(err) {
            if (err) { throw err; }
            /* and find its id */
            db.query('SELECT id FROM Users WHERE username = ?', [message.username], function(err, rows) {
              userId = rows[0].id;
              db.query('INSERT INTO Messages VALUES (null, ?, ?, ?)', [roomId, userId, message.text], function(err, row) {
                if (err) { throw err; }
              });
            });
          });
        } else {
          /* if user already existed, use its id */
          userId = rows[0].id;
          console.log(userId);
          db.query('INSERT INTO Messages VALUES (null, ?, ?, ?)', [roomId, userId, message.text], function(err, row) {
            if (err) { throw err; }
          });
        }
      });
      // db.query('INSERT INTO Users values ()');
      // add user
      // add room
      // add messages with room
    } // a function which can be used to insert a message into the database
  },

  // users: {
  //   // Ditto as above.
  //   get: function () {},
  //   post: function (newUser) {}
  // }
};

