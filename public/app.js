// COMP 3133 
// Lab Test 1
// Author: Andrew Stewart
// Student ID: 101418564

$(document).ready(() => {
    const socket = io('http://localhost:3000');
    let currentUser = null;
    let currentRoom = null;

    // Show signup page
    $('#show-signup').click(() => {
        $('#login-page').hide();
        $('#signup-page').show();
    });

    // Show login page
    $('#show-login').click(() => {
        $('#signup-page').hide();
        $('#login-page').show();
    });

    // Signup form submission
    $('#signup-form').submit((e) => {
        e.preventDefault();
        const userData = {
            username: $('#signup-username').val(),
            firstname: $('#signup-firstname').val(),
            lastname: $('#signup-lastname').val(),
            password: $('#signup-password').val()
        };

        $.ajax({
            url: 'http://localhost:3000/api/auth/signup',
            method: 'POST',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: (response) => {
                alert('Signup successful. Please login.');
                $('#signup-page').hide();
                $('#login-page').show();
            },
            error: (xhr) => {
                alert(`Signup failed: ${xhr.responseJSON.error}`);
            }
        });
    });

    // Login form submission
    $('#login-form').submit((e) => {
        e.preventDefault();
        const loginData = {
            username: $('#login-username').val(),
            password: $('#login-password').val()
        };

        $.ajax({
            url: 'http://localhost:3000/api/auth/login',
            method: 'POST',
            data: JSON.stringify(loginData),
            contentType: 'application/json',
            success: (response) => {
                currentUser = response.user;
                localStorage.setItem('user', JSON.stringify(currentUser));
                showChatPage();
            },
            error: (xhr) => {
                alert(`Login failed: ${xhr.responseJSON.error}`);
            }
        });
    });

    // Join room
    $('#join-room').click(() => {
    currentRoom = $('#room-select').val();
    if (currentUser && currentUser.username && currentRoom) {
      socket.emit('join room', { username: currentUser.username, room: currentRoom });
      $('#chat-window').show();
      $('#join-room').hide();
      $('#leave-room').show();
    } else {
      console.error('Unable to join room: missing user or room information');
      alert('Unable to join room. Please make sure you are logged in and have selected a room.');
    }
  });
  
  // Leave room
  $('#leave-room').click(() => {
    if (currentUser && currentUser.username && currentRoom) {
      socket.emit('leave room', { username: currentUser.username, room: currentRoom });
      currentRoom = null;
      $('#chat-window').hide();
      $('#join-room').show();
      $('#leave-room').hide();
      $('#messages').empty();
      $('#users').empty();
    } else {
      console.error('Unable to leave room: missing user or room information');
    }
  });

    // Send message
    $('#chat-form').submit((e) => {
        e.preventDefault();
        const message = $('#chat-input').val();
        if (message && currentRoom) {
            socket.emit('chat message', { username: currentUser.username, room: currentRoom, message });
            $('#chat-input').val('');
        }
    });

    // Receive message
    socket.on('chat message', (data) => {
        $('#messages').append($('<p>').text(`${data.username}: ${data.message}`));
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
    });

    // Typing indicator
    let typingTimer;
    $('#chat-input').on('input', () => {
        clearTimeout(typingTimer);
        socket.emit('typing', { username: currentUser.username, room: currentRoom });
        typingTimer = setTimeout(() => {
            socket.emit('stop typing', { username: currentUser.username, room: currentRoom });
        }, 1000);
    });

    socket.on('typing', (username) => {
        $('#typing-indicator').text(`${username} is typing...`);
    });

    socket.on('stop typing', () => {
        $('#typing-indicator').text('');
    });

    // Logout
    $('#logout').click(() => {
        localStorage.removeItem('user');
        currentUser = null;
        currentRoom = null;
        showLoginPage();
    });

    // Helper functions
    function showChatPage() {
        $('#login-page, #signup-page').hide();
        $('#chat-page').show();
    }

    function showLoginPage() {
        $('#chat-page').hide();
        $('#login-page').show();
    }

    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showChatPage();
    }
});