var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(res);
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req.body);
    } // a function which handles posting a message to the database
  },

  // users: {
  //   // Ditto as above
  //   get: function () {
  //     res.send(models.users.get());
  //   },
  //   post: function (user) { 
  //     models.users.post(req.body);
  //   }
  // }
};

