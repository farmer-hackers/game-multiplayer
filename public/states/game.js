class Game extends Phaser.State {
    init() {
        //game.stage.disableVisibilityChange = true
    }

    preload() {
        //game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON)
        game.load.image('bg', 'assets/map/map.png')
        game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON)

        game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32)
        game.load.spritesheet('player','assets/sprites/characters.png', 32, 32)
    }

    create() {
        this.world.resize(2500, 1500)
        this.playerMap = {}
        const testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        testKey.onDown.add(Client.sendTest, this)
        game.add.image(0, 0, 'bg')
        const map = game.add.tilemap('map')
        map.addTilesetImage('tilesheet', 'tileset')
        this.layers = {}
        map.layers.map(m => this.layers[m.name] = map.createLayer(m.name))
        map.setCollisionBetween(1, 10000, true, this.layers['Collider'])
        console.log(this.layers)
        this.layers['Collider'].renderable = false
        this.cursors = this.input.keyboard.createCursorKeys()
        this.cursors.up.onDown.add(this.getCoordinates, this)
        this.cursors.down.onDown.add(this.getCoordinates, this)
        this.cursors.left.onDown.add(this.getCoordinates, this)
        this.cursors.right.onDown.add(this.getCoordinates, this)
        this.cursors.up.onUp.add(this.getCoordinates, this)
        this.cursors.down.onUp.add(this.getCoordinates, this)
        this.cursors.left.onUp.add(this.getCoordinates, this)
        this.cursors.right.onUp.add(this.getCoordinates, this)

        this.collider = game.add.group()
        this.collider.enableBody = true
        //this.collider = game.add.sprite(200, 200, 'Collider')

        Client.askNewPlayer()
    }

    update() {
        Object.keys(this.playerMap).forEach(key => {
            game.physics.arcade.collide(this.playerMap[key], this.layers['Collider'])
            if (key !== config.id) {
                game.physics.arcade.collide(this.playerMap[config.id], this.collider)
            }
        })
        //game.physics.arcade.overlap(this.playerMap[config.id], this.layers['Collider'], (p, p2) => console.log(p, p2), null, this)
    }

    getCoordinates(layer) {
        console.log(layer)
        console.log(this.playerMap[config.id])
        const player = this.playerMap[config.id]
        const infos = {
            velocityX: 0,
            velocityY: 0,
            direction: layer.event.key,
            x: player.position.x,
            y: player.position.y
        }

        if (layer.isDown) {
            console.log()
            switch (layer.event.key) {
                case CONSTANTES.ARROWDOWN:
                    infos.velocityY = 160
                    break
                case CONSTANTES.ARROWUP:
                    infos.velocityY = -160
                    break
                case CONSTANTES.ARROWLEFT:
                    infos.velocityX = -160
                    break
                case CONSTANTES.ARROWRIGHT:
                    infos.velocityX = 160
                    break
                default:

            }
        }
        console.log(infos)
        Client.sendClick(infos.x, infos.y, infos.velocityX, infos.velocityY, infos.direction)
    }

    addNewPlayer(id, x, y, velocityX, velocityY, direction) {
        this.playerMap[id] = game.add.sprite(x, y, 'player')
        game.physics.enable(this.playerMap[id], Phaser.Physics.ARCADE)
        this.playerMap[id].body.immovable = true
        this.playerMap[id].body.collideWorldBounds = true
        this.playerMap[id].body.velocity.x = velocityX
        this.playerMap[id].body.velocity.y = velocityY
        this.playerMap[id].direction = direction
        this.playerMap[id].animations.add(CONSTANTES.ARROWLEFT, [12, 13, 14, 13], 6, true)
        this.playerMap[id].animations.add(CONSTANTES.ARROWRIGHT, [24, 25, 26, 25], 6, true)
        this.playerMap[id].animations.add(CONSTANTES.ARROWUP, [36, 37, 38, 37], 6, true)
        this.playerMap[id].animations.add(CONSTANTES.ARROWDOWN, [0, 1, 2, 1], 6, true)
        if (id === config.id){
            game.camera.follow(this.playerMap[config.id])
        } else {
            this.collider.add(this.playerMap[id])
        }
    }

    movePlayer(id, x, y, velocityX, velocityY, direction) {
        //change mouvement engine to moveToXY function
        console.log('movePlayer ', id, velocityX, velocityY, direction)
        this.playerMap[id].position.x = x
        this.playerMap[id].position.y = y
        this.playerMap[id].body.velocity.x = velocityX
        this.playerMap[id].body.velocity.y = velocityY
        this.playerMap[id].direction = direction

        const isMouving = (velocityX === 0 && velocityY === 0) ? false : true
        this.animPlayer(this.playerMap[id], direction, isMouving)
    }

    animPlayer(player, direction, isMouving) {
        if(isMouving) {
            player.animations.play(direction)
        } else {
            player.animations.stop()
        }
    }

    removePlayer(id) {
        this.playerMap[id].destroy()
        delete this.playerMap[id]
    }
}

const GameState = new Game()
console.log(GameState)
