const app = () => {

    // Start game
    game.createGame(document.body)

    // Events
    document.body.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

    document.body.addEventListener('mousedown', (event) => game.eventMouseDown(event))

    document.body.addEventListener('mouseup', (event) => game.eventMouseUp(event))

    document.body.addEventListener('keydown', (event) => game.eventKeyDown(event))

    document.body.addEventListener('keyup', (event) => game.eventKeyUp(event))

    document.body.addEventListener('touchstart', (event) => game.eventTouchStart(event))
        
    document.body.addEventListener('touchmove', (event) => game.eventTouchMove(event))
        
    document.body.addEventListener('touchend', (event) => game.eventTouchEnd(event))
        
    window.addEventListener('orientationchange', (event) => game.eventOrientationChange(event))

}

window.onload = app
