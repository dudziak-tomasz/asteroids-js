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
            enabled: true
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
        if (this.$boxSliderMusic) {
            this.$boxSliderMusic.value = game.getAudioVolume()
            this.$boxSliderMusic.oninput = () => {
                const volume = parseFloat(this.$boxSliderMusic.value)
                game.setAudioVolume(volume)
                game.playAudio()
            }
        }

        this.$boxSliderSound = document.getElementById('box-slider-sound')
        if (this.$boxSliderSound) {
            this.$boxSliderSound.value = Spacetime.getAudioVolume()
            this.$boxSliderSound.oninput = async () => {
                const volume = parseFloat(this.$boxSliderSound.value)
                Spacetime.setAudioVolume(volume)
                this.audio.volume = Spacetime.audioVolume
                try {
                    await this.audio.play()
                } catch { }
            }
        }

        this.$boxRadios = document.querySelectorAll('input[name="box-radio-background"]')
        if (this.$boxRadios.length > 0) {
            const track = game.audioTrack
            this.$boxRadios.forEach((radio) => {
                if (radio.value === track) radio.checked = true
                radio.oninput = (e) => {
                    game.setAudioTrack(e.target.value)
                    game.playAudio()
                }
            })
        }
    }

    handleLogin() {
        this.$loginForm = document.getElementById('login-form')
        if (this.$loginForm) {
            this.$loginForm.onsubmit = async (e) => {
                e.preventDefault()

                this.$loginForm.submit.setAttribute('disabled', 'disabled')
                this.$loginForm.username.setAttribute('disabled', 'disabled')
                this.$loginForm.password.setAttribute('disabled', 'disabled')

                const user = {
                    username: this.$loginForm.username.value,
                    password: this.$loginForm.password.value
                }

                const resUser = await api.login(user)

                console.log(resUser)
            }
        }
    }

    async handleProfile() {
        this.$userProfile = document.getElementById('user-profile')
        if (this.$userProfile) {

            const resUser = await api.profile()
            if (resUser) {
                this.$userProfile.innerHTML = `
                    ${resUser.id}<br>
                    ${resUser.username}<br>
                    ${resUser.email}<br>
                    ${resUser.highscore}
                `
            } else {
                this.$userProfile.innerHTML = `CAN'T GET PROFILE. PLEASE LOGIN.`
            }
            
        }

        this.$logoutButton = document.getElementById('logout-button')
        if (this.$logoutButton) {
            this.$logoutButton.onclick = async () => {
                const res = await api.logout()
                if (res) {
                    this.$userProfile.innerHTML = 'LOG OUT OK'
                } else {
                    this.$userProfile.innerHTML = `CAN'T LOG OUT`
                }
            }
        }

        this.$logoutAllButton = document.getElementById('logoutall-button')
        if (this.$logoutAllButton) {
            this.$logoutAllButton.onclick = async () => {
                const res = await api.logoutAll()
                if (res) {
                    this.$userProfile.innerHTML = 'LOG OUT ALL OK'
                } else {
                    this.$userProfile.innerHTML = `CAN'T LOG OUT ALL`
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

    }
}