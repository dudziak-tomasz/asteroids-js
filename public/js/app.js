import { api } from './api.js'
import { game } from './game.js'
import { Menu } from './menu.js'

const app = () => {

    game.createGame(document.body)

    new Menu(document.body)

    api.profile()

    document.body.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

}

window.onload = app
