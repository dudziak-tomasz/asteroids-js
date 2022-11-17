import { game } from './game.js'
import { Menu } from './menu.js'

const app = () => {

    game.createGame(document.body)

    new Menu(document.body)

    document.body.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

}

window.onload = app
