const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

// nametoid = {}
idtoname = {}

io.on('connection', (socket) => {
  console.log(socket.id)

  socket.on('login', (data) => {
    //nametoid[data.username] = socket.id;
    idtoname[socket.id] = data.username;

    socket.join(data.username)

    socket.emit('logged-in', {success: 'true'})
  })

  socket.on('send_message', (data) => {

    // console.log("message received: " + data.message)


    if(idtoname[socket.id]) {
      if(data.message.charAt(0) === '@'){
        let username = data.message.split(' ')[0].substring(1)
        let msgArray = data.message.split(' ')
        msgArray.splice(0,1);
        io.in(username).emit('receive_message', {
          message: msgArray.join(' '),
          username: idtoname[socket.id],
          timestamp: new Date().getTime()
        })
      }else {
        io.emit('receive_message', {
          message: data.message,
          username: idtoname[socket.id],
          timestamp: new Date().getTime()
        })
      }
    }
  })


})

app.use('/', express.static(__dirname + '/public'));

server.listen(4000, () => {
  console.log("Server started at port 4000")
})