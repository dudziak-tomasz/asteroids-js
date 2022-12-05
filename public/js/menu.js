import { Box} from './box.js'
import { pages } from './pages.js'
import { game } from './game.js'
import { Spacetime } from './spacetime.js'
import { api } from './api.js'

export class Menu extends Box {
    constructor(parentElement) {

        super(parentElement)

        this.container.className = 'menu-container'
        
        this.menuStart.classList.toggle('menu-x')

        this.content.className = 'menu-content'

        this.errorNotLogged = `YOU'RE NOT LOGGED IN... PLEASE LOG IN.`
        this.errorConnectionProblem = 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER.'
        this.errorUsernameInvalid = 'MINIMUM 3 CHARACTERS, ONLY LETTERS, NUMBERS AND UNDERSCORES.'
        this.errorPasswordInvalid = 'MINIMUM 8 CHARACTERS, 1 CAPITAL LETTER, 1 SMALL LETTER, 1 NUMBER'
        this.errorCapsLock = 'CAPS LOCK IS ON!'

        this.items = [{
            text: 'LOGIN',
            enabled: true
        }, {
            text: 'PROFILE',
            enabled: false
        }, {
            text: 'PREFERENCES',
            enabled: true
        }, {
        }, {
            text: 'FULLSCREEN',
            enabled: true
        }, {
            text: 'EXIT FS',
            enabled: false
        }, {
            text: 'HOW TO PLAY',
            enabled: true
        }, {
        }, {
            text: 'ABOUT',
            enabled: true
        }]    

        this.box = undefined

        this.audio = new Audio('/audio/fire.mp3')

        this.initializeMenuItems()

        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('q')) {
            this.handlePasswordResetChangePassword(urlParams.get('q'))
        }

    }

    initializeMenuItems() {
        const stateUser = (api.user !== undefined) 
        this.items.find(item => item.text === 'LOGIN').enabled = !stateUser
        this.items.find(item => item.text === 'PROFILE').enabled = stateUser

        const stateFs = (document.fullscreenElement !== null) 
        this.items.find(item => item.text === 'FULLSCREEN').enabled = !stateFs
        this.items.find(item => item.text === 'EXIT FS').enabled = stateFs

        this.content.innerHTML = ''

        this.items.forEach((item, i) => {
            const menuItem = document.createElement('div')
            menuItem.className = 'menu-item'
            menuItem.id = 'menu-item-' + i
            menuItem.innerHTML = item.text
            if (!item.enabled) menuItem.classList.toggle('menu-item-disabled')
            this.content.appendChild(menuItem)
        })
        
    }

    menuStartClick() {
        this.menuStart.classList.toggle('menu-x')
        this.content.classList.toggle('menu-content-show')
        
        if (this.content.classList.length === 2) {
            game.mainDiv.dispatchEvent(new CustomEvent('boxopen'))
        } else {
            game.mainDiv.dispatchEvent(new CustomEvent('boxclose'))
        }
    }

    openBox(pageName) {
        const innerHTML = pages.get(pageName)
        if (this.box) this.box.close()
        this.box = new Box(this.parentElement, innerHTML, pageName)
    }

    async menuItemClick(itemId) {
        this.menuStartClick()

        if (pages.has(this.items[itemId].text)) {
            this.openBox(this.items[itemId].text)
        } else {
            if (this.items[itemId].text === 'FULLSCREEN') {
                try {
                    await document.body.requestFullscreen()
                } catch { }
            } else if(this.items[itemId].text === 'EXIT FS') {
                try {
                    await document.exitFullscreen()
                } catch { }     
            } else {
                if (this.box) this.box.close()
                this.box = new Box(this.parentElement, `<p class="box-title">${this.items[itemId].text}</p><p>UNDER CONSTRUCTION</p>`)
            }
        }  
    }

    handlePreferences() {

        this.$boxSliderMusic = document.getElementById('box-slider-music')
        this.$boxSliderSound = document.getElementById('box-slider-sound')
        this.$boxRadios = document.querySelectorAll('input[name="box-radio-background"]')

        this.$boxSliderMusic.value = game.getAudioVolume()
        this.$boxSliderMusic.oninput = () => {
            const volume = parseFloat(this.$boxSliderMusic.value)
            game.setAudioVolume(volume)
            game.playAudio()
        }

        this.$boxSliderSound.value = Spacetime.getAudioVolume()
        this.$boxSliderSound.oninput = async () => {
            const volume = parseFloat(this.$boxSliderSound.value)
            Spacetime.setAudioVolume(volume)
            this.audio.volume = Spacetime.audioVolume
            try {
                await this.audio.play()
            } catch { }
        }

        const track = game.audioTrack
        this.$boxRadios.forEach((radio) => {
            if (radio.value === track) radio.checked = true
            radio.oninput = (e) => {
                game.setAudioTrack(e.target.value)
                game.playAudio()
            }
        })
    }

    handleLogin() {
        this.$loginForm = document.getElementById('box-login-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$boxRegisterButton = document.getElementById('box-register-button')
        this.$boxPasswordResetButton = document.getElementById('box-password-reset-button')

        this.$loginForm.username.focus()

        this.$loginForm.onsubmit = async (e) => {
            e.preventDefault()

            const user = {
                username: this.$loginForm.username.value,
                password: this.$loginForm.password.value
            }

            this.$boxErrorMessage.innerHTML = 'LOGIN...'
            this.$loginForm.submit.disabled = true

            const res = await api.login(user)

            this.$loginForm.submit.disabled = false

            if (res.status === 200) {
                this.box.close()
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'USERNAME OR PASSWORD IS INCORECT. PLEASE TRY AGAIN.'
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem
            }
        }

        this.$loginForm.username.oninput = () => {
            this.$boxErrorMessage.innerHTML = ''
        }

        this.$loginForm.password.addEventListener('keydown', (e) => {
            if (e.getModifierState("CapsLock")) this.$boxErrorMessage.innerHTML = this.errorCapsLock
            else this.$boxErrorMessage.innerHTML = ''
        })

        this.$boxRegisterButton.onclick = (e) => {
            e.preventDefault()
            this.openBox('REGISTER')
        }

        this.$boxPasswordResetButton.onclick = (e) => {
            e.preventDefault()
            this.openBox('PASSWORD RESET')
        }

    }

    handleRegister() {
        this.$registerForm = document.getElementById('box-register-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')

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
                this.openBox('REGISTER OK')
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
                if (res.error === 'username is invalid') this.$boxErrorMessage.innerHTML += `: ${this.errorUsernameInvalid}`
                else if (res.error === 'password too weak') this.$boxErrorMessage.innerHTML += `: ${this.errorPasswordInvalid}`
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem
            }

        }

        this.$registerForm.username.oninput = () => {
            this.$boxErrorMessage.innerHTML = ''
        }

        this.$registerForm.password.addEventListener('keydown', (e) => {
            if (e.getModifierState("CapsLock")) this.$boxErrorMessage.innerHTML = this.errorCapsLock
            else this.$boxErrorMessage.innerHTML = ''
        })

        this.$registerForm.email.oninput = () => {
            this.$boxErrorMessage.innerHTML = ''
        }

    }

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
                this.openBox('PASSWORD RESET INFO')
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'PASSWORD RESET FAILED. PLEASE TRY AGAIN LATER.'
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem
            }

        }

    }

    handlePasswordResetChangePassword(token) {

        this.openBox('PASSWORD RESET CHANGE PASSWORD')

        this.$changePasswordForm = document.getElementById('box-change-password-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')

        this.$changePasswordForm.newPassword.focus()

        this.$changePasswordForm.onsubmit = async (e) => {
            e.preventDefault()

            const newPassword = this.$changePasswordForm.newPassword.value
            const retypeNewPassword = this.$changePasswordForm.retypeNewPassword.value

            if (newPassword !== retypeNewPassword) return this.$boxErrorMessage.innerHTML = 'NEW PASSWORD DOES NOT MATCH RETYPED PASSWORD'

            const user = {
                password: newPassword,
                token
            }

            this.$boxErrorMessage.innerHTML = 'CHANGING PASSWORD...'
            this.$changePasswordForm.submit.disabled = true

            const res = await api.passwordUpdate(user)

            this.$changePasswordForm.submit.disabled = false

            if (res.status === 200) {
                this.$boxErrorMessage.innerHTML = 'PASSWORD CHANGED. YOU CAN LOG IN.'
            } else if (res.status === 400) {
                this.$boxErrorMessage.innerHTML = res.error.toUpperCase()
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'PASSWORD RESET FAILED. PLEASE TRY AGAIN LATER.'
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem
            }
        }

        const capsLock = (e) => {
            if (e.getModifierState("CapsLock")) this.$boxErrorMessage.innerHTML = this.errorCapsLock
            else this.$boxErrorMessage.innerHTML = ''
        }

        this.$changePasswordForm.newPassword.addEventListener('keydown', (e) => {
            capsLock(e)
        })
        this.$changePasswordForm.retypeNewPassword.addEventListener('keydown', (e) => {
            capsLock(e)
        })

    }

    handleChangePassword() {

        this.$changePasswordForm = document.getElementById('box-change-password-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')

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
            user.test = true

            // is currentPassword matches?
            let res = await api.login(user)

            if (res.status === 200) {

                    delete user.username
                    user.password = newPassword

                    // change password
                    res = await api.updateUser(user)
    
                    if (res.status === 200) {
                        this.$boxErrorMessage.innerHTML = 'PASSWORD CHANGED'
                    } else if (res.status === 400) {
                        this.$boxErrorMessage.innerHTML = res.error.toUpperCase() + `: ${this.errorPasswordInvalid}`
                    } else if (res.status === 403) {
                        this.$boxErrorMessage.innerHTML = this.errorNotLogged
                    } 
                    else {
                        this.$boxErrorMessage.innerHTML = this.errorConnectionProblem   
                    }

            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = 'INCORRECT CURRENT PASSWORD...'
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem
            }

            this.$changePasswordForm.submit.disabled = false

        }

        const capsLock = (e) => {
            if (e.getModifierState("CapsLock")) this.$boxErrorMessage.innerHTML = this.errorCapsLock
            else this.$boxErrorMessage.innerHTML = ''
        }

        this.$changePasswordForm.currentPassword.addEventListener('keydown', (e) => {
            capsLock(e)
        })
        this.$changePasswordForm.newPassword.addEventListener('keydown', (e) => {
            capsLock(e)
        })
        this.$changePasswordForm.retypeNewPassword.addEventListener('keydown', (e) => {
            capsLock(e)
        })
    }

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
            this.$boxProfileErrorMessage.innerHTML = this.errorNotLogged
        } else {
            this.$boxProfileErrorMessage.innerHTML = this.errorConnectionProblem
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
                if (res.error === 'username is invalid') this.$boxErrorMessage.innerHTML += `: ${this.errorUsernameInvalid}`
            } else if (res.status === 403) {
                this.$boxErrorMessage.innerHTML = this.errorNotLogged
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem    
            }
        }

        this.$logoutButton.onclick = async (e) => {
            e.preventDefault()

            closeMessages()
            this.$boxErrorMessage.innerHTML = 'LOGOUT...'
            this.$logoutButton.disabled = true

            const res = await api.logout()

            this.$logoutButton.disabled = false
            
            if (res.status === 200 || res.status === 403) {
                this.box.close()
            } else {
                this.$boxErrorMessage.innerHTML = this.errorConnectionProblem    
            }
        }

        this.$logoutAllButton.onclick = async (e) => {
            e.preventDefault()

            if (this.$logoutAllButton.disabled === true) return

            closeMessages()
            this.$boxLogoutAllErrorMessage.innerHTML = 'LOGOUT...'
            this.$logoutAllButton.disabled = true

            const res = await api.logoutAll()

            this.$logoutAllButton.disabled = false
            
            if (res.status === 200 || res.status === 403) {
                this.box.close()
            } else {
                this.$boxLogoutAllErrorMessage.innerHTML = this.errorConnectionProblem
            }
        }

        this.$changePasswordButton.onclick = (e) => {
            e.preventDefault()

            closeMessages()

            this.openBox('CHANGE PASSWORD')
        }

        this.$closeAccountButton.onclick = (e) => {
            e.preventDefault()

            closeMessages()
            this.$boxCloseMessage.style.display = 'block'

            this.$boxCloseNo.onclick = (e) => {
                e.preventDefault()
                closeMessages()
            }

            this.$boxCloseYes.onclick = async (e) => {
                e.preventDefault()

                closeMessages()
                this.$boxCloseErrorMessage.innerHTML = 'CLOSING ACCOUNT...'

                const res = await api.deleteUser()

                if (res.status === 200) {
                    this.box.close()
                } else {
                    if (res.status === 403) this.$boxCloseErrorMessage.innerHTML = this.errorNotLogged
                    else this.$boxCloseErrorMessage.innerHTML = this.errorConnectionProblem
                }    
            }
        }
        
    }

    handlePageElements(name = '') {
        if (name === 'PREFERENCES') this.handlePreferences()
        else if (name === 'LOGIN') this.handleLogin()
        else if (name === 'CHANGE PASSWORD') this.handleChangePassword()
        else if (name === 'PROFILE') this.handleProfile()
        else if (name === 'REGISTER') this.handleRegister()
        else if (name === 'PASSWORD RESET') this.handlePasswordReset()
    }

    initializeEvents() {
        this.menuStart.addEventListener('click', () => this.menuStartClick())

        this.content.addEventListener('click', (event) => {
            const target = event.target.id
            if (target.startsWith('menu-item-')) this.menuItemClick(parseInt(target.replace('menu-item-', '')))
        })

        document.addEventListener('fullscreenchange', () => {
            this.initializeMenuItems()
        })

        game.mainDiv.addEventListener('boxopen', (e) => {
            if (e.detail) {
                this.handlePageElements(e.detail.name)
            }
        })

        game.mainDiv.addEventListener('login', () => {
            this.initializeMenuItems()
        })

        game.mainDiv.addEventListener('logout', () => {
            this.initializeMenuItems()
        })

    }
}