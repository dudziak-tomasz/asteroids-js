import { api } from './api.js'
import { messages } from './messages.js'
import { Box} from './box.js'
import { pages } from './pages.js'
import { changePasswordBox } from './changepasswordbox.js'

export const profileBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PROFILE'))
    },

    async openBox() {
        this.box.open()
        this.handleElements()
        await this.loadProfile()
    },

    handleElements() {
        this.$boxProfileErrorMessage = document.getElementById('box-profile-error-message')
        this.$boxProfileErrorMessage.innerHTML = 'LOADING PROFILE...'

        this.$boxProfileDiv = document.getElementById('box-profile-div')
        this.$boxProfileDiv.style.display = 'none'

        this.$profileForm = document.getElementById('box-profile-form')
        this.$profileForm.onsubmit = (e) => this.profileFormSubmit(e)

        this.$username = document.getElementById('username')
        this.$username.value = ''
        this.$username.oninput = () => this.clearMessages()

        this.$email = document.getElementById('email')
        this.$email.value = ''
        this.$email.oninput = () => this.clearMessages()

        this.$highscore = document.getElementById('highscore')
        this.$highscore.value = ''

        this.$boxErrorMessage = document.getElementById('box-error-message')


        this.$logoutButton = document.getElementById('box-logout-button')
        this.$logoutButton.onclick = () => this.logoutButtonClick()


        this.$changePasswordButton = document.getElementById('box-change-password-button')
        this.$changePasswordButton.onclick = () => changePasswordBox.openBox()

        this.$logoutAllButton = document.getElementById('box-logoutall-button')
        this.$logoutAllButton.onclick = () => this.logoutAllButtonClick()

        this.$boxLogoutAllErrorMessage = document.getElementById('box-logoutall-error-message')


        this.$closeAccountButton = document.getElementById('box-close-account-button')
        this.$closeAccountButton.onclick = () => this.closeAccountButtonClick()

        this.$boxCloseMessage = document.getElementById('box-close-message')
        this.$boxCloseMessage.style.display = 'none'

        this.$closeYesButton = document.getElementById('box-close-yes-button')
        this.$closeYesButton.onclick = () => this.closeYesButtonClick()

        this.$closeNoButton = document.getElementById('box-close-no-button')
        this.$closeNoButton.onclick = () => this.closeNoButtonClick()

        this.$boxCloseErrorMessage = document.getElementById('box-close-error-message')
    },

    async loadProfile() {
        await api.updateUser()
        const res = await api.profile()

        if (res.status === 200) {
            this.clearMessages()
            this.$boxProfileDiv.style.display = 'block'

            this.$username.value = api.user.username
            this.$email.value = api.user.email
            this.$highscore.value = api.user.highscore

        } else if (res.status === 403)
            this.$boxProfileErrorMessage.innerHTML = messages.NotLogged
        else
            this.$boxProfileErrorMessage.innerHTML = messages.ConnectionProblem
    },

    async profileFormSubmit(event) {
        event.preventDefault()

        this.clearMessages()

        const user = {}
        const username = this.$username.value.toLowerCase()
        const email = this.$email.value.toLowerCase()

        if (username !== api.user.username) user.username = username
        else if (email !== api.user.email) user.email = email
        else return this.$boxErrorMessage.innerHTML = 'NO CHANGE, NO SAVE'

        this.$boxErrorMessage.innerHTML = 'SAVING...'
        this.$profileForm.submit.disabled = true

        const res = await api.updateUser(user)

        this.$profileForm.submit.disabled = false
        
        if (res.status === 200)
            this.$boxErrorMessage.innerHTML = 'SAVED'
        else if (res.status === 400) {
            this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
            if (res.error === 'username is invalid') this.$boxErrorMessage.innerHTML += `: ${messages.UsernameInvalid}`
        } else if (res.status === 403)
            this.$boxErrorMessage.innerHTML = messages.NotLogged
        else
            this.$boxErrorMessage.innerHTML = messages.ConnectionProblem
    },

    async logoutButtonClick() {
        this.clearMessages()

        this.$boxErrorMessage.innerHTML = 'LOGOUT...'
        this.$logoutButton.disabled = true

        const res = await api.logout()

        this.$logoutButton.disabled = false
        
        if (res.status === 200 || res.status === 403) this.box.close() 
        else this.$boxErrorMessage.innerHTML = messages.ConnectionProblem
    },

    async logoutAllButtonClick() {
        if (this.$logoutAllButton.disabled) return
        this.clearMessages()

        this.$boxLogoutAllErrorMessage.innerHTML = 'LOGOUT...'
        this.$logoutAllButton.disabled = true

        const res = await api.logoutAll()

        this.$logoutAllButton.disabled = false
        
        if (res.status === 200 || res.status === 403) this.box.close() 
        else this.$boxLogoutAllErrorMessage.innerHTML = messages.ConnectionProblem
    },

    closeAccountButtonClick() {
        this.clearMessages()
        this.$boxCloseMessage.style.display = 'block'
    },

    async closeYesButtonClick() {
        this.clearMessages()

        this.$boxCloseErrorMessage.innerHTML = 'CLOSING ACCOUNT...'

        const res = await api.deleteUser()

        if (res.status === 200) this.box.close()
        else if (res.status === 403) this.$boxCloseErrorMessage.innerHTML = messages.NotLogged
        else this.$boxCloseErrorMessage.innerHTML = messages.ConnectionProblem
    },

    closeNoButtonClick() {
        this.clearMessages()
    },

    clearMessages () {
        this.$boxProfileErrorMessage.innerHTML = ''
        this.$boxErrorMessage.innerHTML = ''
        this.$boxLogoutAllErrorMessage.innerHTML = ''
        this.$boxCloseErrorMessage.innerHTML = ''
        this.$boxCloseMessage.style.display = 'none'
    }

}