import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const changePasswordBox = {
    
    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('CHANGE PASSWORD'))
    },

    openBox() {
        changePasswordBox.box.open()
        changePasswordBox.handleChangePassword()
    },

    handleChangePassword() {
        this.$changePasswordForm = document.getElementById('box-change-password-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')

        this.$changePasswordForm.currentPassword.value = ''
        this.$changePasswordForm.newPassword.value = ''
        this.$changePasswordForm.retypeNewPassword.value = ''

        this.$changePasswordForm.currentPassword.focus()

        this.$changePasswordForm.onsubmit = async (e) => {
            e.preventDefault()

            let user = {}

            const currentPassword = this.$changePasswordForm.currentPassword.value
            const newPassword = this.$changePasswordForm.newPassword.value
            const retypeNewPassword = this.$changePasswordForm.retypeNewPassword.value

            if (newPassword !== retypeNewPassword) return this.$boxErrorMessage.innerHTML = 'NEW PASSWORD DOES NOT MATCH RETYPED PASSWORD'
            if (newPassword === currentPassword) return this.$boxErrorMessage.innerHTML = 'NEW PASSWORD SHOULD BE DIFFERENT FROM CURRENT PASSWORD'

            this.$boxErrorMessage.innerHTML = 'CHANGING PASSWORD...'
            this.$changePasswordForm.submit.disabled = true

            user.username = api.user.username
            user.password = currentPassword
            user.checkPasswordOnly = true

            // currentPassword matches?
            let res = await api.login(user)

            if (res.status === 200) {
                    delete user.username
                    user.password = newPassword

                    // change password
                    res = await api.updateUser(user)
    
                    if (res.status === 200) {
                        this.$boxErrorMessage.innerHTML = 'PASSWORD CHANGED'

                        this.$changePasswordForm.currentPassword.value = ''
                        this.$changePasswordForm.newPassword.value = ''
                        this.$changePasswordForm.retypeNewPassword.value = ''
                    } else if (res.status === 400) {
                        this.$boxErrorMessage.innerHTML = res.error.toUpperCase() + `: ${errors.PasswordInvalid}`
                    } else if (res.status === 403) {
                        this.$boxErrorMessage.innerHTML = errors.NotLogged
                    } 
                    else {
                        this.$boxErrorMessage.innerHTML = errors.ConnectionProblem   
                    }

            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'INCORRECT CURRENT PASSWORD...'
            } else {
                this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
            }

            this.$changePasswordForm.submit.disabled = false
        }

        this.$changePasswordForm.currentPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
        this.$changePasswordForm.newPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
        this.$changePasswordForm.retypeNewPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
    }
}