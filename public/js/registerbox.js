import { api } from './api.js'
import { messages } from './messages.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const registerBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('REGISTER'))
        this.boxWelcome = new Box(parentElement, pages.get('REGISTER OK'))
    },

    openBox() {
        this.box.open()
        this.handleElements()
    },

    handleElements() {
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxErrorMessage.innerHTML = ''

        this.$boxUsernameInfo = document.getElementById('box-username-info')
        this.$boxUsernameInfo.innerHTML = messages.UsernameInvalid

        this.$boxPasswordInfo = document.getElementById('box-password-info')
        this.$boxPasswordInfo.innerHTML = messages.PasswordInvalid

        this.$boxEmailInfo = document.getElementById('box-email-info')
        this.$boxEmailInfo.innerHTML = messages.ForPasswordResetOnly

        this.$registerForm = document.getElementById('box-register-form')
        this.$registerForm.onsubmit = (e) => this.registerFormSubmit(e)

        this.$username = document.getElementById('username')
        this.$username.value = ''
        this.$username.focus()
        this.$username.oninput = () => this.$boxErrorMessage.innerHTML = ''

        this.$password = document.getElementById('password')
        this.$password.value = ''
        this.$password.onkeydown = (e) => this.$boxErrorMessage.innerHTML = messages.getCapsLockError(e)

        this.$email = document.getElementById('email')
        this.$email.value = ''
        this.$email.oninput = () => this.$boxErrorMessage.innerHTML = ''
    },

    async registerFormSubmit(event) {
        event.preventDefault()

        const user = {
            username: this.$username.value,
            password: this.$password.value,
            email: this.$email.value
        }

        this.$boxErrorMessage.innerHTML = 'USER REGISTRATION...'
        this.$registerForm.submit.disabled = true

        const res = await api.newUser(user)

        this.$registerForm.submit.disabled = false

        if (res.status === 201)
            this.boxWelcome.open()
        else if (res.status === 400)
            this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
        else
            this.$boxErrorMessage.innerHTML = messages.ConnectionProblem
    }
}