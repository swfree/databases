var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      db.query('SELECT * FROM Messages', function(err, rows, fields) {
        if (err) throw err;
       
        console.log('All rows: ', rows);
        console.log('All fields: ', fields);
      });
    }, // a function which produces all the messages
    post: function (message) {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function (newUser) {}
  }
};

