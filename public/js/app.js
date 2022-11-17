import { game } from './game.js'
import { Menu } from './menu.js'

const app = () => {

    // Start game
    game.createGame(document.body)

    new Menu(document.body)

    // Events
    document.body.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

    window.addEventListener('orientationchange', (event) => game.eventOrientationChange(event))

}

window.onload = app
