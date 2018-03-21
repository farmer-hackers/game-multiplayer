class Splash extends Phaser.State {
    init() {}

    preload() {
        $('#game').addClass('hidden')
    }

    create() {
        Client.askGameConfig()
    }

    startGame() {
        $('#game').removeClass('hidden')
        $('#form').remove()
        this.state.start('Game')
    }

    writeError(error) {
        $('#error')[0].innerText = error
    }

    instanceIsPublic(isPublic) {
        $('#form').load('../assets/components/form.html', () => {
            $('#start').click(() => {
                if (isPublic) {
                    this.startGame(isPublic)
                } else {
                    Client.submitPassword($('#password')[0].value)
                }
            })
            $('input[type=radio]').click(e => config.character = e.target.value)
            if (isPublic) {
                $('#password').remove()
            }
        })
    }

    instanceIsFull() {
        $('#form').load('../assets/components/full.html')
    }
}

const SplashState = new Splash()
