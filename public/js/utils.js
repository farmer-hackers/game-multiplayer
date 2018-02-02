const centerGameObjects = objects => {
    objects.forEach(object => {
        object.anchor.setTo(0.5)
    })
}

const CONSTANTES = {
    ARROWDOWN: 'ArrowDown',
    ARROWUP: 'ArrowUp',
    ARROWLEFT: 'ArrowLeft',
    ARROWRIGHT: 'ArrowRight'
}
