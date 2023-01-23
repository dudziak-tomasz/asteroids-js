import { api } from './api.js'
import { chat } from './chat.js'
import { game } from './game.js'
import { Menu } from './menu.js'
import { preferencesBox } from './preferencesbox.js'
import { profileBox } from './profilebox.js'
import { loginBox } from './loginbox.js'
import { changePasswordBox } from './changepasswordbox.js'
import { registerBox } from './registerbox.js'
import { passwordResetChangePasswordBox } from './passwordresetchangepasswordbox.js'
import { passwordResetBox } from './passwordresetbox.js'

const app = () => {

    game.createGame(document.body)

    loginBox.createBox(document.body)
    registerBox.createBox(document.body)
    passwordResetBox.createBox(document.body)
    passwordResetChangePasswordBox.createBox(document.body)
    profileBox.createBox(document.body)
    changePasswordBox.createBox(document.body)
    preferencesBox.createBox(document.body)
    
    chat.createChat(game.mainDiv)

    new Menu(document.body)

    api.profile()

    document.body.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })

}

window.onload = app
