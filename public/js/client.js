const Client = {}
Client.socket = io.connect()

Client.sendTest = () => {
    console.log('test sent')
    Client.socket.emit('test')
}

Client.askNewPlayer = () => {
    Client.socket.emit('newplayer', config.id)
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

Client.socket.on('newplayer', data => GameState.addNewPlayer(data.id, data.x, data.y, data.velocityX, data.velocityY, data.direction))

Client.socket.on('allplayers', data => {
    data.forEach(o => GameState.addNewPlayer(o.id, o.x, o.y, o.velocityX, o.velocityY, o.direction))

    Client.socket.on('move', data => GameState.movePlayer(data.id, data.x, data.y, data.velocityX, data.velocityY, data.direction))

    Client.socket.on('remove', id => GameState.removePlayer(id))
})
