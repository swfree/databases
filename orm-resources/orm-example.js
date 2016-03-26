/* You'll need to
 * npm install sequelize
 * before running this example. Documentation is at http://sequelizejs.com/
 */

 var Sequelize = require('sequelize');
 var db = new Sequelize('chat', 'root', 'rootroot');
/* TODO this constructor takes the database name, username, then password.
* Modify the arguments if you need to */

/* first define the data structure by giving property names and datatypes
* See http://sequelizejs.com for other datatypes you can use besides STRING. */
var SeqUser = db.define('SeqUser', {
  username: {type: Sequelize.STRING, unique: true}
});

var SeqMessage = db.define('SeqMessage', {
  text: Sequelize.STRING,
  roomname: Sequelize.STRING
});

SeqMessage.belongsTo(SeqUser);

/* .sync() makes Sequelize create the database table for us if it doesn't
*  exist already: */
SeqUser.sync().then(function() {
  /* This callback function is called once sync succeeds. */

  // now instantiate an object and save it:
  var newUser = SeqUser.build({username: 'Jean Valjean'});
  newUser.save({ ignore: true }).then(function() {

    /* This callback function is called once saving succeeds. */

    // Retrieve objects from the database:
    SeqUser.findAll({ where: {username: 'Jean Valjean'} }).then(function(users) {
      // This function is called back with an array of matches.
      for (var i = 0; i < users.length; i++) {
        console.log(users[i].username + ' exists');
      }
    });

    SeqMessage.sync().then(function() {
      return SeqUser.findAll({attributes: ['id'], where: { username: 'Jean Valjean'} });
    })
    .then(function(id) {
      console.log(id[0].dataValues.id);
      SeqMessage.build({ roomname: 'lobby', text: 'tryingagain', SeqUserId: id[0].dataValues.id }).save();
    }).catch(function(err) { throw err; });
  }).catch(function(err) { throw err; });
});


// GOAL: return all messages for a given user
