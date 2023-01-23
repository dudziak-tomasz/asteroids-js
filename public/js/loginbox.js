import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'
import { registerBox } from './registerbox.js'
import { passwordResetBox } from './passwordresetbox.js'

export const loginBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('LOGIN'))
    },

    openBox(message = '') {
        loginBox.box.open()
        loginBox.handleLogin(message)
    },

    handleLogin(message = '') {
        this.$loginForm = document.getElementById('box-login-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxRegisterButton = document.getElementById('box-register-button')
        this.$boxPasswordResetButton = document.getElementById('box-password-reset-button')

        this.$loginForm.username.value = ''
        this.$loginForm.password.value = ''
        this.$boxErrorMessage.innerHTML = message

        this.$loginForm.username.focus()

        this.$loginForm.onsubmit = async (e) => {
            e.preventDefault()

            const user = {
                username: this.$loginForm.username.value,
                password: this.$loginForm.password.value
            }

            this.$boxErrorMessage.innerHTML = 'LOGIN...'
            this.$loginForm.submit.disabled = true

            const res = await api.login(user)

            this.$loginForm.submit.disabled = false

            if (res.status === 200) {
                this.box.close()
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'USERNAME OR PASSWORD IS INCORECT. PLEASE TRY AGAIN.'
            } else {
                this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
            }
        }

        this.$loginForm.password.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
        this.$loginForm.username.oninput = () => this.$boxErrorMessage.innerHTML = ''
        this.$boxRegisterButton.onclick = () => registerBox.openBox()
        this.$boxPasswordResetButton.onclick = () => passwordResetBox.openBox()
    }
}