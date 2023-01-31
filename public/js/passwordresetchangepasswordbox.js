import { api } from './api.js'
import { messages } from './messages.js'
import { Box} from './box.js'
import { pages } from './pages.js'
import { loginBox } from './loginbox.js'

export const passwordResetChangePasswordBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PASSWORD RESET CHANGE PASSWORD'))
    },

    openBox(tokenFromURL) {
        this.token = tokenFromURL
        passwordResetChangePasswordBox.box.open()
        passwordResetChangePasswordBox.handleElements()
    },

    handleElements() {
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxErrorMessage.innerHTML = ''

        this.$changePasswordForm = document.getElementById('box-change-password-form')
        this.$changePasswordForm.onsubmit = (e) => this.changePasswordFormSubmit(e)

        this.$newPassword = document.getElementById('new-password')
        this.$newPassword.value = ''
        this.$newPassword.focus()
        this.$newPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = messages.getCapsLockError(e)

        this.$retypeNewPassword = document.getElementById('retype-new-password')
        this.$retypeNewPassword.value = ''
        this.$retypeNewPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = messages.getCapsLockError(e)
    },

    async changePasswordFormSubmit(event) {
        event.preventDefault()

        if (this.$newPassword.value !== this.$retypeNewPassword.value) 
            return this.$boxErrorMessage.innerHTML = messages.NewPasswordNotMatchRetyped

        const user = { password: this.$newPassword.value }

        this.$boxErrorMessage.innerHTML = 'CHANGING PASSWORD...'
        this.$changePasswordForm.submit.disabled = true

        const res = await api.passwordUpdate(user, this.token)

        this.$changePasswordForm.submit.disabled = false

        if (res.status === 200)
            loginBox.openBox('PASSWORD CHANGED. YOU CAN LOG IN.')
        else if (res.status === 400)
            this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
        else if (res.status === 403)
            this.$boxErrorMessage.innerHTML = messages.PasswordResetFail
        else
            this.$boxErrorMessage.innerHTML = messages.ConnectionProblem
    }
}