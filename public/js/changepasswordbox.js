import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const changePasswordBox = {
    
    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('CHANGE PASSWORD'))
        this.boxPasswordChangedInfo = new Box(parentElement, pages.get('NEW PASSWORD'))
    },

    openBox() {
        changePasswordBox.box.open()
        changePasswordBox.handleElements()
    },

    handleElements() {
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxErrorMessage.innerHTML = ''

        this.$boxPasswordInfo = document.getElementById('box-password-info')
        this.$boxPasswordInfo.innerHTML = errors.PasswordInvalid

        this.$changePasswordForm = document.getElementById('box-change-password-form')
        this.$changePasswordForm.onsubmit = (e) => this.changePasswordFormSubmit(e)
        this.$changePasswordForm.submit.disabled = false

        this.$currentPassword = document.getElementById('current-password')
        this.$currentPassword.value = ''
        this.$currentPassword.focus()
        this.$currentPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)

        this.$newPassword = document.getElementById('new-password')
        this.$newPassword.value = ''
        this.$newPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)

        this.$retypeNewPassword = document.getElementById('retype-new-password')
        this.$retypeNewPassword.value = ''
        this.$retypeNewPassword.onkeydown = (e) => this.$boxErrorMessage.innerHTML = errors.getCapsLockError(e)
    },

    async changePasswordFormSubmit(event) {
        event.preventDefault()

        if (this.$newPassword.value !== this.$retypeNewPassword.value) 
            return this.$boxErrorMessage.innerHTML = errors.NewPasswordNotMatchRetyped
        if (this.$newPassword.value === this.$currentPassword.value) 
            return this.$boxErrorMessage.innerHTML = errors.NewPasswordShouldBeDifferent

        this.$boxErrorMessage.innerHTML = 'CHANGING PASSWORD...'
        this.$changePasswordForm.submit.disabled = true

        const res = await this.checkCurrentPassword()

        if (res.status === 200)
            await this.changePassword()
        else if (res.status === 403)
            this.$boxErrorMessage.innerHTML = errors.IncorrectCurrentPassword
        else
            this.$boxErrorMessage.innerHTML = errors.ConnectionProblem

        this.$changePasswordForm.submit.disabled = false
    },

    async checkCurrentPassword() {
        const user = {
            username: api.user.username,
            password: this.$currentPassword.value,
            checkPasswordOnly: true
        }

        return await api.login(user)
    },

    async changePassword() {
        const user = { password: this.$newPassword.value }

        const res = await api.updateUser(user)

        if (res.status === 200)
            this.boxPasswordChangedInfo.open()
        else if (res.status === 400)
            this.$boxErrorMessage.innerHTML = res.error.toUpperCase() + `: ${errors.PasswordInvalid}`
        else if (res.status === 403)
            this.$boxErrorMessage.innerHTML = errors.NotLogged
        else
            this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
    }
}