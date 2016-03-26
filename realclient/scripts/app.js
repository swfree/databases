
var app = {

  //TODO: The current 'addFriend' function just adds the class 'friend'
  //to all messages sent by the user
  baseServer: 'http://127.0.0.1:3000/classes/messages/',
  server: 'http://127.0.0.1:3000/classes/messages/',
  baseQuery: { order: '-createdAt'},
  query: { order: '-createdAt'},
  username: 'anonymous',
  roomname: 'lobby',
  lastMessageId: 0,
  friends: {},
  selectedUser: '',

  init: function() {
    // Get username
    app.username = window.location.search.substr(10);

    // Cache jQuery selectors
    app.$main = $('#main');
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$userSelect = $('#userSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.username', app.addFriend);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.saveRoom);
    app.$userSelect.on('change', app.saveUser);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(app.fetch, 3000);
  },

  send: function(data) {
    app.startSpinner();
    // Clear messages input
    app.$message.val('');

    // POST the message to the server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (data) {
        // Trigger a fetch to update the messages, pass true to animate
        app.fetch();
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  fetch: function(animate) {
    if (app.selectedUser.length > 0) {
      app.server = 'http://127.0.0.1:3000/classes/users/';
      app.query = { order: '-createdAt', user: app.selectedUser};
    } else {
      app.server = app.baseServer;
      app.query = app.baseQuery;
    }
    $.ajax({
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: app.query,
      success: function(data) {
        // Don't bother if we have nothing to work with
        app.stopSpinner();
        if (!data.results || !data.results.length) { return; }

        // Get the last message
        var mostRecentMessage = data.results[data.results.length - 1];
        var displayedRoom = $('.chat span').first().data('roomname');
        // Only bother updating the DOM if we have a new message
        // if (mostRecentMessage.objectId !== app.lastMessageId || app.roomname !== displayedRoom) {
          app.populateMessages(data.results, animate);
          app.populateUsers();
          if (app.roomname !== displayedRoom) {
          // Update the UI with the fetched rooms
          app.populateRooms(data.results);

          // Update the UI with the fetched messages

          // Store the ID of the most recent message
          // app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(data) {
        console.error('chatterbox: Failed to fetch messages');
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  populateMessages: function(results, animate) {
    // Clear existing messages

    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(results)) {
      // Add all fetched messages
      results.forEach(app.addMessage);
    }

    // Make it scroll to the bottom
    var scrollTop = app.$chats.prop('scrollHeight');
    if (animate) {
      app.$chats.animate({
        scrollTop: scrollTop
      });
    } else {
      app.$chats.scrollTop(scrollTop);
    }
  },

  populateRooms: function(results) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option></select>');

    if (results) {
      var rooms = {};
      results.forEach(function(data) {
        var roomname = data.roomname;
        if (roomname && !rooms[roomname]) {
          // Add the room to the select menu
          app.addRoom(roomname);

          // Store that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.roomname);
  },

  populateUsers: function() {
    if (app.selectedUser.length) {
      app.$userSelect.html(`<option value="${app.selectedUser}">${app.selectedUser}</option><option value="">--</option>`);
    } else {
      app.$userSelect.html('<option value="">--</option>');
    }
    var userServer = 'http://127.0.0.1:3000/classes/users/';

    $.ajax({
      url: userServer,
      type: 'GET',
      success: function(data) {
        var results = data.results;
        if (results) {
          var users = {};
          results.forEach(function(user) {
            var currUser = user.username;
            if (currUser === app.selectedUser) {
              return;
            }
            if (currUser && !users[currUser]) {
              // Add the room to the select menu
              app.addUser(currUser);

              // Store that we've added this room already
              users[currUser] = true;
            }
          });
        }
      },
      error: function(data) {
        console.log('failed to populate user dropdown', data);
      }
    });

    // Select the menu option
    app.$userSelect.val(app.selectedUser);
  },

  addRoom: function(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    app.$roomSelect.append($option);
  },

  addUser: function(username) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(username).text(username);

    // Add to select
    app.$userSelect.append($option);
  },

  addMessage: function(data) {
    if (!data.roomname) {
      data.roomname = 'lobby';
    }

    // Only add messages that are in our current room
    if (data.roomname === app.roomname) {
      // Create a div to hold the chats
      var $chat = $('<div class="chat"/>');

      // Add in the message data using DOM methods to avoid XSS
      // Store the username in the element's data
      var $username = $('<span class="username"/>');
      $username.text(data.username + ': ').attr('data-username', data.username).attr('data-roomname', data.roomname).appendTo($chat);

      // Add the friend class
      if (app.friends[data.username] === true) {
        $username.addClass('friend');
      }

      var $message = $('<br><span/>');
      $message.text(data.text).appendTo($chat);

      // Add the message to the UI
      app.$chats.prepend($chat);
    }
  },

  addFriend: function(evt) {
    var username = $(evt.currentTarget).attr('data-username');

    if (username !== undefined) {
      // Store as a friend
      app.friends[username] = true;

      // Bold all previous messages
      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';
      var $usernames = $(selector).addClass('friend');
    }
  },

  saveRoom: function(evt) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;

        // Add the room to the menu
        app.addRoom(roomname);

        // Select the menu option
        app.$roomSelect.val(roomname);

        // Fetch messages again
        app.fetch();
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.roomname = app.$roomSelect.val();

      // Fetch messages again
      app.fetch();
    }
  },

  saveUser: function(evt) {
    var selectIndex = app.$userSelect.prop('selectedIndex');
    // New room is always the first option
    app.startSpinner();
    // Store as undefined for empty names
    app.selectedUser = app.$userSelect.val();

    // Fetch messages again
    app.fetch();
  },

  handleSubmit: function(evt) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    };

    app.send(message);

    // Stop the form from submitting
    evt.preventDefault();
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};

