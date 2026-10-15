import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())
app.get('/', (req,res)=> res.send('Sesli Hobi Server Ayakta!'))

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: "*" }
})

let users = []

io.on('connection', (socket) => {
  socket.on('join', ({ nick, oda }) => {
    socket.data.nick = nick
    socket.data.oda = oda
    socket.join(oda)
    users.push({ id: socket.id, nick, oda })
    io.to(oda).emit('users', users.filter(u=>u.oda===oda))
  })

  socket.on('disconnect', () => {
    users = users.filter(u=> u.id !== socket.id)
    if(socket.data.oda){
      io.to(socket.data.oda).emit('users', users.filter(u=>u.oda===socket.data.oda))
    }
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, ()=> console.log('Server '+PORT+' de'))
