import { api } from './api.js'
import { messages } from './messages.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const passwordResetBox = {
    
    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PASSWORD RESET'))
        this.boxPasswordResetInfo = new Box(parentElement, pages.get('PASSWORD RESET INFO'))
    },

    openBox() {
        passwordResetBox.box.open()
        passwordResetBox.handleElements()
    },

    handleElements() {
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxErrorMessage.innerHTML = ''

        this.$passwordResetForm = document.getElementById('box-password-reset-form')
        this.$passwordResetForm.onsubmit = (e) => this.resetFormSubmit(e)

        this.$email = document.getElementById('email')
        this.$email.value = ''
        this.$email.focus()
        this.$email.oninput = () => this.$boxErrorMessage.innerHTML = ''
    },

    async resetFormSubmit(event) {
        event.preventDefault()

        const user = { email: this.$email.value }

        this.$boxErrorMessage.innerHTML = 'SENDING...'
        this.$passwordResetForm.submit.disabled = true

        const res = await api.passwordReset(user)

        this.$passwordResetForm.submit.disabled = false

        if (res.status === 200)
            this.boxPasswordResetInfo.open()
        else if (res.status === 400)
            this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
        else if (res.status === 403) 
            this.$boxErrorMessage.innerHTML = messages.PasswordResetFail
        else 
            this.$boxErrorMessage.innerHTML = messages.ConnectionProblem
    }
}