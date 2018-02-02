import Phaser, { State } from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends State {
    init () {}

    preload () {
        this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
        this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
        centerGameObjects([this.loaderBg, this.loaderBar])

        this.load.setPreloadSprite(this.loaderBar)
        //
        // load your assets
        //
        this.load.image('mushroom', 'assets/images/mushroom2.png')
        this.load.image('ground', 'assets/images/platform.png')
        this.load.image('diamond', 'assets/images/diamond.png')
        this.load.image('bg', 'assets/images/fond-cloud.jpg')
        this.load.spritesheet('dog', 'assets/images/player.png', 32, 32)
        this.load.atlas('ground', 'assets/textures/tiles.png', 'assets/textures/tiles.json')
        this.load.atlas('objects', 'assets/images/objects.png', 'assets/images/objects.json')
        this.load.atlas('joystick', 'assets/images/generic-joystick.png', 'assets/images/generic-joystick.json')
        this.load.spritesheet('coin', 'assets/images/coin.png', 32, 32)
    }

    create () {
        this.state.start('Game')
    }
}
