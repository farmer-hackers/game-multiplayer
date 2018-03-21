import express from 'express'
import http from 'http'
import socket from 'socket.io'

require('dotenv').config()

const app = express()
const server = http.Server(app)
const io = socket.listen(server)
const PORT = process.env.PORT
const NB_PLAYERS = process.env.NB_PLAYER || 2
const PUBLIC_INSTANCE = process.env.PUBLIC_INSTANCE || "1"
const PASSWORD = process.env.PASSWORD

app.use('/css',express.static(`${__dirname}/public/css`))
app.use('/js',express.static(`${__dirname}/public/js`))
app.use('/states',express.static(`${__dirname}/public/states`))
app.use('/assets',express.static(`${__dirname}/public/assets`))

app.get('/', (req,res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

server.lastPlayderID = 0

server.listen(PORT || 8081, () => {
    console.log('Listening on '+server.address().port)
})

io.on('connection', socket => {
    socket.on('gameConfig', () => {
        socket.emit('gameConfig', getGameConfig())
    })

    socket.on('gamePassword', pass => {
        socket.emit('gamePassword', getAuthorize(pass))
    })

    socket.on('newplayer', (id, character) => {
        socket.player = {
            id: id,
            x: 300,
            y: 300,
            velocityX: 0,
            velocityY: 0,
            direction: 'ArrowDown',
            character: character || 1
        }

        socket.emit('allplayers', getAllPlayers())
        socket.broadcast.emit('newplayer', socket.player)

        socket.on('click', data => {
            socket.player.x = data.x
            socket.player.y = data.y
            socket.player.velocityX = data.velocityX
            socket.player.velocityY = data.velocityY
            socket.player.direction = data.direction
            io.emit('move', socket.player)
        })

        socket.on('disconnect', () => {
            io.emit('remove', socket.player.id)
        })
    })
})

function getAllPlayers() {
    return Object.keys(io.sockets.connected)
        .filter(socketID => io.sockets.connected[socketID].player)
        .map(socketID => io.sockets.connected[socketID].player)
}

function countPlayers() {
    return Object.keys(io.sockets.connected)
        .filter(socketID => io.sockets.connected[socketID].player)
        .length
}

function getGameConfig() {
    if (countPlayers() < NB_PLAYERS) {
        return {
            public: !!parseInt(PUBLIC_INSTANCE)
        }
    }
    return {
        error: 'This instance is already full'
    }
}

function getAuthorize(pass) {
    if (pass === PASSWORD) {
        return {
            status: 200
        }
    }
    return {
        status: 403,
        error: 'Sorry.. Wrong password'
    }
}

/* REMOVE THIS PART */
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low)
}
