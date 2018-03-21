const Client = {}
Client.socket = io.connect()

/* REMOVE THIS PART */
Client.sendTest = () => {
    Client.socket.emit('test')
}
/**/

Client.askGameConfig = () => {
    Client.socket.emit('gameConfig')
}

Client.submitPassword = pass => {
    Client.socket.emit('gamePassword', pass)
    Client.socket.on('gamePassword', data => {
        if (data.status === 200) {
            SplashState.startGame()
        } else {
            SplashState.writeError(data.error)
        }
    })
}

Client.socket.on('gameConfig', config => {
    if (config.error) {
        SplashState.instanceIsFull(config.error)
    } else {
        SplashState.instanceIsPublic(config.public)
    }
})

Client.askNewPlayer = () => {
    Client.socket.emit('newplayer', config.id, config.character)
}

Client.sendClick = (x, y, velocityX, velocityY, direction) => {
  Client.socket.emit('click',
    {
        x: x,
        y: y,
        velocityX: velocityX,
        velocityY: velocityY,
        direction: direction
    })
}

Client.socket.on('newplayer', data => GameState.addNewPlayer(data.id, data.x, data.y, data.velocityX, data.velocityY, data.direction, data.character))

Client.socket.on('allplayers', data => {
    data.forEach(o => GameState.addNewPlayer(o.id, o.x, o.y, o.velocityX, o.velocityY, o.direction, o.character))

    Client.socket.on('move', data => GameState.movePlayer(data.id, data.x, data.y, data.velocityX, data.velocityY, data.direction))

    Client.socket.on('remove', id => GameState.removePlayer(id))
})
