import { api } from './api.js'
import { messages } from './messages.js'
import { Box } from './box.js'
import { pages } from './pages.js'
import { registerBox } from './registerbox.js'
import { passwordResetBox } from './passwordresetbox.js'

export const loginBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('LOGIN'))
    },

    openBox(message = '') {
        this.box.open()
        this.handleElements(message)
    },

    handleElements(message = '') {
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxErrorMessage.innerHTML = message
 
        this.$boxRegisterButton = document.getElementById('box-register-button')
        this.$boxRegisterButton.onclick = () => registerBox.openBox()
 
        this.$boxPasswordResetButton = document.getElementById('box-password-reset-button')
        this.$boxPasswordResetButton.onclick = () => passwordResetBox.openBox()
 
        this.$loginForm = document.getElementById('box-login-form')
        this.$loginForm.onsubmit = (e) => this.loginFormSubmit(e)

        this.$username = document.getElementById('username')
        this.$username.value = ''
        this.$username.focus()
        this.$username.oninput = () => this.$boxErrorMessage.innerHTML = ''

        this.$password = document.getElementById('password')
        this.$password.value = ''
        this.$password.onkeydown = (e) => this.$boxErrorMessage.innerHTML = messages.getCapsLockError(e)
    },

    async loginFormSubmit(event) {
        event.preventDefault()

        const user = {
            username: this.$username.value,
            password: this.$password.value
        }

        this.$boxErrorMessage.innerHTML = 'LOGIN...'
        this.$loginForm.submit.disabled = true

        const res = await api.login(user)

        this.$loginForm.submit.disabled = false

        if (res.status === 200)
            this.box.close()
        else if (res.status === 403)
            this.$boxErrorMessage.innerHTML = messages.UsernameOrPasswordIncorect
        else
            this.$boxErrorMessage.innerHTML = messages.ConnectionProblem
    }
}