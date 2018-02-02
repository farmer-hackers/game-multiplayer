import express from 'express'
import http from 'http'
import socket from 'socket.io'

const app = express()
const server = http.Server(app)
const io = socket.listen(server)

app.use('/css',express.static(`${__dirname}/public/css`))
app.use('/js',express.static(`${__dirname}/public/js`))
app.use('/states',express.static(`${__dirname}/public/states`))
app.use('/assets',express.static(`${__dirname}/public/assets`))

app.get('/', (req,res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

server.lastPlayderID = 0

server.listen(process.env.PORT || 8081, () => {
    console.log('Listening on '+server.address().port)
})

io.on('connection', socket => {

    socket.on('newplayer', id => {
        socket.player = {
            id: id,
            x: 300,
            y: 300,
            velocityX: 0,
            velocityY: 0,
            direction: 'ArrowDown'
        }
        socket.emit('allplayers', getAllPlayers())
        socket.broadcast.emit('newplayer', socket.player)

        socket.on('click', data => {
            console.log('click to '+data.velocityX+', '+data.velocityY)
            socket.player.x = data.x
            socket.player.y = data.y
            socket.player.velocityX = data.velocityX
            socket.player.velocityY = data.velocityY
            socket.player.direction = data.direction
            io.emit('move', socket.player)
        })

        socket.on('disconnect', () => {
            io.emit('remove',socket.player.id)
        })
    })

    socket.on('test', () => {
        console.log('test received')
    })
})

function getAllPlayers(){
    const players = []
    Object.keys(io.sockets.connected).forEach(socketID => {
        const player = io.sockets.connected[socketID].player
        if (player) players.push(player)
    })
    return players
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}
