class MultiGame extends Phaser.Game {
    constructor () {
        super(config.gameWidth, config.gameHeight, Phaser.AUTO, 'game', null)
        //this.state.add('Boot', BootState, false)
        this.state.add('Splash', SplashState, false)
        this.state.add('Game', GameState, false)

        this.state.start('Splash')
    }
}

const game = new MultiGame()
