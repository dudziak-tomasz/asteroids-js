import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const passwordResetBox = {
    
    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PASSWORD RESET'))
        this.boxPasswordResetInfo = new Box(parentElement, pages.get('PASSWORD RESET INFO'))
    },

    openBox() {
        passwordResetBox.box.open()
        passwordResetBox.handlePasswordReset()
    },

    handlePasswordReset() {
        this.$passwordResetForm = document.getElementById('box-password-reset-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')

        this.$passwordResetForm.email.focus()

        this.$passwordResetForm.onsubmit = async (e) => {
            e.preventDefault()

            const user = {
                email: this.$passwordResetForm.email.value
            }

            this.$boxErrorMessage.innerHTML = 'SENDING...'
            this.$passwordResetForm.submit.disabled = true

            const res = await api.passwordReset(user)

            this.$passwordResetForm.submit.disabled = false

            if (res.status === 200) {
                this.boxPasswordResetInfo.open()
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'PASSWORD RESET FAILED. PLEASE TRY AGAIN LATER.'
            } else {
                this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
            }
        }
    }
}