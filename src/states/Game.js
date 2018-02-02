import Phaser, { State, VirtualJoystick } from 'phaser'
import Player from '../sprites/Player'
import Coin from '../sprites/Coin'
import Objects from '../sprites/Objects'
import Ground from '../grounds/Ground'
import Water from '../grounds/Water'
import Config from '../Config'
import Atlas from '../grounds/Atlas'

class Game extends State {
    init () {
        this.stage.backgroundColor = '#FFFFFF'
        this.score = 0
    }

    preload () {}

    create () {
        this.world.resize(1500, 400)
        this.game.physics.startSystem(Phaser.Physics.ARCADE)
    	this.game.physics.arcade.gravity.y = Config.gravity
        this.game.world.setBounds(0, 0, this.game.world.width, this.game.world.height)
    	this.cursors = this.input.keyboard.createCursorKeys()

        this.bg = this.game.add.tileSprite(0, 0, 1500, 400, 'bg', null)

        this.groups = {}
        this.groups['killables'] = this.game.add.group()
        this.groups['killables'].enableBody = true
        new Water(this.game, 470, this.game.world.height - 70, 150, 70, '17', this.groups['killables'])

        this.groups['grounds'] = this.game.add.group()
        this.groups['grounds'].enableBody = true

        this.groups['colliders'] = this.game.add.group()
        this.groups['colliders'].enableBody = true

        this.groups['backGameObjects'] = this.game.add.group()
        this.groups['backGameObjects'].position.setTo(-11, -7)

        this.player = new Player(this.game, 300, 150, this.cursors)
        this.game.camera.follow(this.player)

        this.groups['frontGameObjects'] = this.game.add.group()
        this.groups['frontGameObjects'].position.setTo(-11, -7)

        /*  MAIN GROUNDS  */
        new Ground(this.game, 0, this.game.world.height - 105, 400, 105, '2', this.groups['grounds'])
        new Objects(this.game, 384, this.game.world.height - 105, 'ground', this.groups['grounds'], '3')

        new Objects(this.game, 583, this.game.world.height - 105, 'ground', this.groups['grounds'], '1')
        new Ground(this.game, 710, this.game.world.height - 105, this.game.world.width - 710, 105, '2', this.groups['grounds'])


        new Ground(this.game, 0, this.game.world.height - 100, 400, 100, '2', this.groups['colliders'])
        new Ground(this.game, 384, this.game.world.height - 100, 128, 100, '3', this.groups['colliders'])

        new Ground(this.game, 582, this.game.world.height - 100, 128, 100, '1', this.groups['colliders'])
        new Ground(this.game, 710, this.game.world.height - 100, this.game.world.width - 710, 100, '2', this.groups['colliders'])
        /******************/

        /*  FOATING GROUNDS  */
        new Objects(this.game, 800, this.game.world.height - 205, 'ground', this.groups['grounds'], '13')
        new Objects(this.game, 927, this.game.world.height - 205, 'ground', this.groups['grounds'], '14')
        new Objects(this.game, 1054, this.game.world.height - 205, 'ground', this.groups['grounds'], '15')

        new Ground(this.game, 800, this.game.world.height - 200, 128, 20, '13', this.groups['colliders'])
        new Ground(this.game, 928, this.game.world.height - 200, 128, 20, '14', this.groups['colliders'])
        new Ground(this.game, 1056, this.game.world.height - 200, 128, 20, '15', this.groups['colliders'])
        /*********************/

        /*  GAME OBJECTS  */
        new Objects(this.game, 20, 9, 'objects', this.groups['frontGameObjects'], 'Tree_2')
        new Objects(this.game, 350, 263, 'objects', this.groups['backGameObjects'], 'Mushroom_2')
        new Objects(this.game, 1050, 140, 'objects', this.groups['backGameObjects'], 'Bush (1)')
        /******************/

        this.coins = this.game.add.group()
        this.coins.enableBody = true

        const coinsPosition = [{width: 400, height: 170}, {width: 600, height: 210}, {width: 850, height: 100}, {width: 900, height: 100}, {width: 950, height: 100}, {width: 1000, height: 100}]
        coinsPosition.forEach(o => new Coin(this.game, o.width, o.height, this.coins, this.cursor))

        this.scoreText = this.game.add.text(16, 16, 'Coins: 0', { fontSize: '32px', fill: '#633a19' })
        this.scoreText.fixedToCamera = true
        this.lifesUI = this.game.add.text(16, 50, `Lifes: 1`, { fontSize: '32px', fill: '#633a19' })
        this.lifesUI.fixedToCamera = true

        Object.keys(this.groups).map(o => {
            if (this.groups[o].enableBody) {
                this.groups[o].setAll('body.allowGravity', false)
                this.groups[o].setAll('body.immovable', true)
            }
        })

        this.groups['colliders'].setAll('renderable', false)
        this.groups['colliders'].setAll('body.checkCollision.down', false)

    }

    update() {
        this.bg.tilePosition.x = - this.camera.x/6
        this.game.physics.arcade.collide(this.player, this.groups['colliders'])
        this.game.physics.arcade.collide(this.coins, this.groups['colliders'])
        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoins, null, this)
        this.game.physics.arcade.overlap(this.player, this.groups['killables'], this.player.isHurt, null, this)
    }

    collectCoins (player, coin) {
        coin.body.enable = false
        this.score += 1
        this.scoreText.text = `Coins: ${this.score}`

        this.add.tween(coin).to({
    		y : coin.y - 50
    	}, 500, 'Expo.easeOut', true)

        this.add.tween(coin.scale).to({
    		x : 1.6,
    		y : 1.6
    	}, 800, 'Linear', true)

        this.add.tween(coin).to({
    		alpha : 0.2
    	}, 500, 'Expo.easeOut', true).onComplete.add(coin.kill, coin)
    }

    render () {
        if (__DEV__) {
            //this.game.debug.spriteInfo(this.player, 32, 32)
        }
    }
}

export default Game
