import { api } from './api.js'
import { errors } from './errors.js'
import { Box} from './box.js'
import { pages } from './pages.js'
import { changePasswordBox } from './changepasswordbox.js'

export const profileBox = {

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PROFILE'))
    },

    openBox() {
        profileBox.box.open()
        profileBox.handleProfile()
    },

    async handleProfile() {
        this.$boxProfileErrorMessage = document.getElementById('box-profile-error-message')
        this.$boxProfileDiv = document.getElementById('box-profile-div')

        this.$boxProfileForm = document.getElementById('box-profile-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$logoutButton = document.getElementById('box-logout-button')
        this.$changePasswordButton = document.getElementById('box-change-password-button')
        this.$logoutAllButton = document.getElementById('box-logoutall-button')
        this.$boxLogoutAllErrorMessage = document.getElementById('box-logoutall-error-message')
        this.$closeAccountButton = document.getElementById('box-close-account-button')
        this.$boxCloseMessage = document.getElementById('box-close-message')
        this.$boxCloseYes = document.getElementById('box-close-yes')
        this.$boxCloseNo = document.getElementById('box-close-no')
        this.$boxCloseErrorMessage = document.getElementById('box-close-error-message')

        const closeMessages = () => {
            this.$boxProfileErrorMessage.innerHTML = ''
            this.$boxErrorMessage.innerHTML = ''
            this.$boxLogoutAllErrorMessage.innerHTML = ''
            this.$boxCloseErrorMessage.innerHTML = ''
            this.$boxCloseMessage.style.display = 'none'
        }

        this.$boxProfileErrorMessage.innerHTML = 'LOADING PROFILE...'
        await api.updateUser()
        const res = await api.profile()

        if (res.status === 200) {
            closeMessages()
            this.$boxProfileDiv.style.display = 'block'

            this.$boxProfileForm.username.value = api.user.username
            this.$boxProfileForm.email.value = api.user.email
            this.$boxProfileForm.highscore.value = api.user.highscore

        } else if (res.status === 403) {
            this.$boxProfileErrorMessage.innerHTML = errors.NotLogged
        } else {
            this.$boxProfileErrorMessage.innerHTML = errors.ConnectionProblem
        }
        
        this.$boxProfileForm.onsubmit = async (e) => {
            e.preventDefault()

            const user = {}
            const username = this.$boxProfileForm.username.value.toLowerCase()
            const email = this.$boxProfileForm.email.value.toLowerCase()

            if (username !== api.user.username) user.username = username
            else if (email !== api.user.email) user.email = email
            else return this.$boxErrorMessage.innerHTML = 'NO CHANGE, NO SAVE'

            closeMessages()
            this.$boxErrorMessage.innerHTML = 'SAVING... '
            this.$boxProfileForm.submit.disabled = true

            const res = await api.updateUser(user)

            this.$boxProfileForm.submit.disabled = false
            
            if (res.status === 200) {
                this.$boxErrorMessage.innerHTML = 'SAVED'
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
                if (res.error === 'username is invalid') this.$boxErrorMessage.innerHTML += `: ${errors.UsernameInvalid}`
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = errors.NotLogged
            } else {
                this.$boxErrorMessage.innerHTML = errors.ConnectionProblem    
            }
        }

        this.$logoutButton.onclick = async () => {
            closeMessages()
            this.$boxErrorMessage.innerHTML = 'LOGOUT...'
            this.$logoutButton.disabled = true

            const res = await api.logout()

            this.$logoutButton.disabled = false
            
            res.status === 200 || res.status === 403 ? this.box.close() : this.$boxErrorMessage.innerHTML = errors.ConnectionProblem
        }

        this.$logoutAllButton.onclick = async () => {
            if (this.$logoutAllButton.disabled) return
            closeMessages()
            this.$boxLogoutAllErrorMessage.innerHTML = 'LOGOUT...'
            this.$logoutAllButton.disabled = true

            const res = await api.logoutAll()

            this.$logoutAllButton.disabled = false
            
            res.status === 200 || res.status === 403 ? this.box.close() : this.$boxLogoutAllErrorMessage.innerHTML = errors.ConnectionProblem
        }

        this.$changePasswordButton.onclick = () => changePasswordBox.openBox()

        this.$closeAccountButton.onclick = () => {
            closeMessages()
            this.$boxCloseMessage.style.display = 'block'

            this.$boxCloseNo.onclick = () => closeMessages()

            this.$boxCloseYes.onclick = async () => {
                closeMessages()
                this.$boxCloseErrorMessage.innerHTML = 'CLOSING ACCOUNT...'

                const res = await api.deleteUser()

                if (res.status === 200) this.box.close()
                else if (res.status === 403) this.$boxCloseErrorMessage.innerHTML = errors.NotLogged
                else this.$boxCloseErrorMessage.innerHTML = errors.ConnectionProblem
            }
        }
    }
}