import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const registerBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('REGISTER'))
        this.boxRegisterOK = new Box(parentElement, pages.get('REGISTER OK'))
    },

    openBox() {
        registerBox.box.open()
        registerBox.handleRegister()
    },

    handleRegister() {
        this.$registerForm = document.getElementById('box-register-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxUsernameInfo = document.getElementById('box-username-info')
        this.$boxPasswordInfo = document.getElementById('box-password-info')
        this.$boxEmailInfo = document.getElementById('box-email-info')

        this.$boxUsernameInfo.innerHTML = errors.UsernameInvalid
        this.$boxPasswordInfo.innerHTML = errors.PasswordInvalid
        this.$boxEmailInfo.innerHTML = 'FOR PASSWORD RESET ONLY'

        this.$registerForm.username.value = ''
        this.$registerForm.password.value = ''
        this.$registerForm.email.value = ''

        this.$registerForm.username.focus()

        this.$registerForm.onsubmit = async (e) => {
            e.preventDefault()

            const user = {
                username: this.$registerForm.username.value,
                password: this.$registerForm.password.value,
                email: this.$registerForm.email.value
            }

            this.$boxErrorMessage.innerHTML = 'LOGIN...'
            this.$registerForm.submit.disabled = true

            const res = await api.newUser(user)

            this.$registerForm.submit.disabled = false

            if (res.status === 201) {
                this.boxRegisterOK.open()
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
            } else {
                this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
            }
        }

        this.$registerForm.password.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
        this.$registerForm.username.oninput = () => this.$boxErrorMessage.innerHTML = ''
        this.$registerForm.email.oninput = () => this.$boxErrorMessage.innerHTML = ''
    }
}