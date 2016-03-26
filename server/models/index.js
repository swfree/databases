var db = require('../db');
var Promise = require('bluebird');

var PQ = Promise.promisify(db.query, {context: db});

module.exports = {
  messages: {
    get: function (res) {
      var messages;
      PQ('SELECT m.text, u.username, r.roomname FROM Messages m INNER JOIN Users u ON u.id = m.user_id INNER JOIN Rooms r ON r.id = m.room_id')
        .then(function(rows, fields) {
          res.send({results: rows});
        })
        .catch(function(err) { console.log(err); });
    },
    
    post: function (message) {
      var roomId; 
      var userId; 

      Promise.all([
        PQ('INSERT IGNORE INTO Users VALUES (null, ?)', [message.username])
          .then(function() { 
            return PQ('SELECT id FROM Users WHERE username = ?', [message.username]);
          }),
        PQ('INSERT IGNORE INTO Rooms VALUES (null, ?)', [message.roomname])
          .then(function() { 
            return PQ('SELECT id FROM Rooms WHERE roomname = ?', [message.roomname]);
          })
      ]).then(function(userAndRoom) {
        console.log(userAndRoom);
        userId = userAndRoom[0][0].id;
        roomId = userAndRoom[1][0].id;
        PQ('INSERT INTO Messages VALUES (null, ?, ?, ?)', [roomId, userId, message.text]);
      });
    } // a function which can be used to insert a message into the database
  },

  // users: {
  //   // Ditto as above.
  //   get: function () {},
  //   post: function (newUser) {}
  // }
};

