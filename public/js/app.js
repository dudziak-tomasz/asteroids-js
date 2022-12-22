import { api } from './api.js'
import { chat } from './chat.js'
import { game } from './game.js'
import { Menu } from './menu.js'

const app = () => {

    game.createGame(document.body)

    new Menu(document.body)

    chat.createChat(game.mainDiv)

    api.profile()

    document.body.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

}

window.onload = app
