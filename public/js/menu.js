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
        this.menuX.classList.remove('menu-x')
        this.content.className = 'menu-content'

        Menu.boxHowToPlay = new Box(parentElement, pages.get('HOW TO PLAY'))
        Menu.boxAbout = new Box(parentElement, pages.get('ABOUT'))
        Menu.box404 = new Box(parentElement, pages.get('404'))

        this.assignMenuItems()
        this.initializeMenuItems()

        this.checkUrlParams()

        this.parentElement.appendChild(this.container)
    }

    // overwriting parent method Box.initializeEvents
    initializeEvents() {
        this.menuX.addEventListener('click', () => this.menuXClick())

        this.content.addEventListener('click', (e) => {
            const target = e.target.id
            if (target.startsWith('menu-item-')) this.menuItemClick(parseInt(target.replace('menu-item-', '')))
        })

        document.addEventListener('fullscreenchange', () => this.initializeMenuItems())
        game.mainDiv.addEventListener('login', () => this.initializeMenuItems())
        game.mainDiv.addEventListener('logout', () => this.initializeMenuItems())
    }

    assignMenuItems() {
        this.items = [{
            id: 'login',
            text: 'LOGIN',
            enabled: true,
            click: () => loginBox.openBox()
        }, {
            id: 'profile',
            text: 'PROFILE',
            enabled: false,
            click: () => profileBox.openBox()
        }, {
            id: 'preferences',
            text: 'PREFERENCES',
            enabled: true,
            click: () => preferencesBox.openBox()
        }, {
            id: 'fullscreen',
            text: 'FULLSCREEN',
            enabled: true,
            click: () => this.makeFullscreen()
        }, {
            id: 'exit fullscreen',
            text: 'EXIT FS',
            enabled: false,
            click: () => this.exitFullscreen()
        }, {
            id: 'chat',
            text: 'CHAT',
            enabled: true,
            click: () => chat.openBox()
        }, {
            id: 'how to play',
            text: 'HOW TO PLAY',
            enabled: true,
            click: () => this.openHowToPlay()
        }, {
            id: 'about',
            text: 'ABOUT',
            enabled: true,
            click: () => this.openAbout()
        }]   
    }

    initializeMenuItems() {
        const isUserLogged = (api.user !== undefined) 
        this.items.find(item => item.id === 'login').enabled = !isUserLogged
        this.items.find(item => item.id === 'profile').enabled = isUserLogged

        const isFullscreen = (document.fullscreenElement !== null) 
        this.items.find(item => item.id === 'fullscreen').enabled = !isFullscreen
        this.items.find(item => item.id === 'exit fullscreen').enabled = isFullscreen

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

    openHowToPlay() {
        Menu.boxHowToPlay.open()
    }

    openAbout() {
        Menu.boxAbout.open()
    }

    async makeFullscreen() {
        try {
            await document.body.requestFullscreen()
        } catch { }
    }

    async exitFullscreen() {
        try {
            await document.exitFullscreen()
        } catch { }
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search)
        
        if (urlParams.has('q')) {
            const qParam = urlParams.get('q')
            if (qParam === '404') Menu.box404.open()
            else if (qParam !== '') passwordResetChangePasswordBox.openBox(qParam)
        }

        window.history.pushState({}, document.title, '/')
    }

    menuXClick() {
        this.menuX.classList.toggle('menu-x')
        this.content.classList.toggle('menu-content-show')

        if (this.content.classList.length === 2) {
            game.mainDiv.dispatchEvent(new CustomEvent('boxopen', { detail: { name: 'Menu' } }))
        }
        else {
            game.mainDiv.dispatchEvent(new CustomEvent('boxclose', { detail: { name: 'Menu' } }))
        }
    }

    menuItemClick(itemId) {
        this.menuXClick()
        if (this.items[itemId].click) this.items[itemId].click()
    }
}