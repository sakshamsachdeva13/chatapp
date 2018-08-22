socket = io();

console.log(socket.id)

$(function () {
  let loginContainer = $('#login-container');
  let chatContainer = $('#chat-container');

  chatContainer.hide();

  let username = $('#username');
  let login = $('#login');
  let message = $('#message');
  let send = $('#send');
  let list = $('#list');

  login.click(function () {
    socket.emit('login', {username: username.val()})
  })

  socket.on('logged-in', (data) => {
    chatContainer.show();
    loginContainer.hide();
  })

  send.click(function () {
    socket.emit('send_message', {message: message.val()})
  })

  socket.on('receive_message', (data) => {

    list.append(`<li>${data.username} : ${data.message} : ${data.timestamp}</li>`)
  })
})
