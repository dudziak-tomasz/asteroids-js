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

    async menuItemClick(itemId) {
        this.menuStartClick()

        if (pages.has(this.items[itemId].text)) {
            const innerHTML = pages.get(this.items[itemId].text)
            if (this.box) this.box.close()
            this.box = new Box(this.parentElement, innerHTML, this.items[itemId].text)
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

        this.$loginForm.username.focus()

        this.$loginForm.onsubmit = async (e) => {
            e.preventDefault()

            const user = {
                username: this.$loginForm.username.value,
                password: this.$loginForm.password.value
            }

            this.$boxErrorMessage.innerHTML = 'LOGIN...'
            this.$loginForm.submit.setAttribute('disabled', 'disabled')

            const res = await api.login(user)

            this.$loginForm.submit.removeAttribute('disabled')

            if (res.status === 200) {
                this.box.close()
            } else {
                if (res.status === 403) this.$boxErrorMessage.innerHTML = 'YOUR USERNAME OR PASSWORD IS INCORECT.<br>PLEASE TRY AGAIN.'
                else this.$boxErrorMessage.innerHTML = 'CONNECTION PROBLEM...<br>PLEASE TRY AGAIN LATER.'
            }
        }

        this.$loginForm.username.oninput = () => {
            this.$boxErrorMessage.innerHTML = ''
        }

        this.$loginForm.password.addEventListener('keydown', (e) => {
            if (e.getModifierState("CapsLock")) this.$boxErrorMessage.innerHTML = 'CAPS LOCK IS ON!'
            else this.$boxErrorMessage.innerHTML = ''
        })

    }

    async handleProfile() {
        this.$boxProfileErrorMessage = document.getElementById('box-profile-error-message')
        this.$boxProfileDiv = document.getElementById('box-profile-div')

        this.$boxProfileForm = document.getElementById('box-profile-form')
        this.$boxErrorMessage = document.getElementById('box-error-message')
        this.$logoutButton = document.getElementById('box-logout-button')
        this.$logoutAllButton = document.getElementById('box-logoutall-button')
        this.$changePasswordButton = document.getElementById('box-change-password-button')
        this.$closeAccountButton = document.getElementById('box-close-account-button')

        this.$boxProfileErrorMessage.innerHTML = 'LOADING PROFILE...'
        await api.updateUser()
        const res = await api.profile()

        if (res.status === 200) {
            this.$boxProfileErrorMessage.innerHTML = ''
            this.$boxProfileDiv.style.display = 'block'

            this.$boxProfileForm.username.value = api.user.username.toUpperCase()
            this.$boxProfileForm.email.value = api.user.email.toUpperCase()
            this.$boxProfileForm.highscore.value = api.user.highscore

        } else {
            if (res.status === 403) this.$boxProfileErrorMessage.innerHTML = `YOU'RE NOT LOGGED IN... PLEASE LOG IN.`
            else this.$boxProfileErrorMessage.innerHTML = 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER.'
        }
        
        this.$boxProfileForm.onsubmit = async (e) => {
            e.preventDefault()

            console.log('submit box-profile-form (SAVE)')
        }

        this.$logoutButton.onclick = async (e) => {
            e.preventDefault()

            this.$boxErrorMessage.innerHTML = 'LOGOUT...'
            const res = await api.logout()
            
            if (res.status === 200 || res.status === 403) {
                this.box.close()
            } else {
                this.$boxErrorMessage.innerHTML = 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER.'    
            }
        }

        this.$logoutAllButton.onclick = async (e) => {
            e.preventDefault()

            this.$boxErrorMessage.innerHTML = 'LOGOUT...'
            const res = await api.logoutAll()
            
            if (res.status === 200 || res.status === 403) {
                this.box.close()
            } else {
                this.$boxErrorMessage.innerHTML = 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER.'
            }
        }

        this.$changePasswordButton.onclick = (e) => {
            e.preventDefault()

            console.log('box-change-password-button')
        }

        this.$closeAccountButton.onclick = (e) => {
            e.preventDefault()

            this.$boxCloseErrorMessage = document.getElementById('box-close-error-message')
            this.$boxCloseYes = document.getElementById('box-close-yes')
            this.$boxCloseNo = document.getElementById('box-close-no')

            this.$boxCloseErrorMessage.style.display = 'block'

            this.$boxCloseNo.onclick = (e) => {
                e.preventDefault()
                this.$boxCloseErrorMessage.style.display = 'none'
            }

            this.$boxCloseYes.onclick = async (e) => {
                e.preventDefault()
                this.$boxCloseErrorMessage.innerHTML = 'CLOSING ACCOUNT...'

                const res = await api.deleteUser()
            
                if (res.status === 200) {
                    this.box.close()
                } else {
                    if (res.status === 403) this.$boxCloseErrorMessage.innerHTML = `YOU'RE NOT LOGGED IN... PLEASE LOG IN.`
                    else this.$boxCloseErrorMessage.innerHTML = 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER.'
                }    
            }
        }
        
    }

    handlePageElements(name = '') {
        if (name === 'PREFERENCES') this.handlePreferences()
        else if (name === 'LOGIN') this.handleLogin()
        else if (name === 'PROFILE') this.handleProfile()
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