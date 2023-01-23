import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'
import { loginBox } from './loginbox.js'

export const passwordResetChangePasswordBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PASSWORD RESET CHANGE PASSWORD'))
    },

    openBox(token) {
        passwordResetChangePasswordBox.box.open()
        passwordResetChangePasswordBox.handlePasswordResetChangePassword(token)
    },

    handlePasswordResetChangePassword(token) {
        this.$changePasswordForm = document.getElementById('box-change-password-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')

        this.$changePasswordForm.newPassword.focus()

        this.$changePasswordForm.onsubmit = async (e) => {
            e.preventDefault()

            const newPassword = this.$changePasswordForm.newPassword.value
            const retypeNewPassword = this.$changePasswordForm.retypeNewPassword.value

            if (newPassword !== retypeNewPassword) return this.$boxErrorMessage.innerHTML = 'NEW PASSWORD DOES NOT MATCH RETYPED PASSWORD'

            const user = {
                password: newPassword
            }

            this.$boxErrorMessage.innerHTML = 'CHANGING PASSWORD...'
            this.$changePasswordForm.submit.disabled = true

            const res = await api.passwordUpdate(user, token)

            this.$changePasswordForm.submit.disabled = false

            if (res.status === 200) {
                loginBox.openBox('PASSWORD CHANGED. YOU CAN LOG IN.')
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'PASSWORD RESET FAILED. PLEASE TRY AGAIN LATER.'
            } else {
                this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
            }
        }

        this.$changePasswordForm.newPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
        this.$changePasswordForm.retypeNewPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
    }
}