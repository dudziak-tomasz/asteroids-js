import { Box} from './box.js'
import { pages } from './pages.js'
import { game } from './game.js'
import { api } from './api.js'
import { chat } from './chat.js'
import { preferencesBox } from './preferencesbox.js'
import { loginBox } from './loginbox.js'
import { passwordResetChangePasswordBox } from './passwordresetchangepasswordbox.js'
import { profileBox } from './profilebox.js'

export class Menu extends Box {
    constructor(parentElement) {

        super(parentElement)

        this.container.className = 'menu-container'
        
        this.menuX.classList.toggle('menu-x')

        this.content.className = 'menu-content'

        this.items = [{
            text: 'LOGIN',
            enabled: true,
            click: loginBox.openBox
        }, {
            text: 'PROFILE',
            enabled: false,
            click: profileBox.openBox
        }, {
            text: 'PREFERENCES',
            enabled: true,
            click: preferencesBox.openBox
        }, {
        }, {
            text: 'FULLSCREEN',
            enabled: true
        }, {
            text: 'EXIT FS',
            enabled: false
        }, {
            text: 'CHAT',
            enabled: true,
            click: chat.openBox
        }, {
            text: 'HOW TO PLAY',
            enabled: true,
            click: this.openHowToPlay
        }, {
        }, {
            text: 'ABOUT',
            enabled: true,
            click: this.openAbout
        }]    

        this.initializeMenuItems()

        this.parentElement.appendChild(this.container)

        Menu.boxHowToPlay = new Box(parentElement, pages.get('HOW TO PLAY'))
        Menu.boxAbout = new Box(parentElement, pages.get('ABOUT'))
        Menu.box404 = new Box(parentElement, pages.get('404'))

        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.has('q')) {

            const qParam = urlParams.get('q')
            if (qParam !== '') {
                if (qParam === '404') Menu.box404.open()
                else passwordResetChangePasswordBox.openBox(qParam)
            }
        }
        window.history.pushState({}, document.title, '/')
    }

    openHowToPlay() {
        Menu.boxHowToPlay.open()
    }

    openAbout() {
        Menu.boxAbout.open()
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

    menuXClick() {
        this.menuX.classList.toggle('menu-x')
        this.content.classList.toggle('menu-content-show')

        if (this.content.classList.length === 2) {
            game.mainDiv.dispatchEvent(new CustomEvent('boxopen', { detail: { name: 'MENU' } }))
        }
        else {
            game.mainDiv.dispatchEvent(new CustomEvent('boxclose', { detail: { name: 'MENU' } }))
        }
    }

    async menuItemClick(itemId) {
        this.menuXClick()

        if (this.items[itemId].click) {
            this.items[itemId].click()
        } else {
            if (this.items[itemId].text === 'FULLSCREEN') {
                try {
                    await document.body.requestFullscreen()
                } catch { }
            } else if(this.items[itemId].text === 'EXIT FS') {
                try {
                    await document.exitFullscreen()
                } catch { }     
            }
        }  
    }

    initializeEvents() {
        this.menuX.addEventListener('click', () => this.menuXClick())

        this.content.addEventListener('click', (event) => {
            const target = event.target.id
            if (target.startsWith('menu-item-')) this.menuItemClick(parseInt(target.replace('menu-item-', '')))
        })

        document.addEventListener('fullscreenchange', () => {
            this.initializeMenuItems()
        })

        game.mainDiv.addEventListener('login', () => {
            this.initializeMenuItems()
        })

        game.mainDiv.addEventListener('logout', () => {
            this.initializeMenuItems()
        })
    }
}