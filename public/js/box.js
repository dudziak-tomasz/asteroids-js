import { game } from './game.js'
import { getRandomID } from './utils.js'

export class Box {
    constructor (parentElement, innerHTML = '', name = '') {
        this.parentElement = parentElement

        this.name = name

        this.container = document.createElement('div')
        this.container.className = 'box-container'
        this.container.id = getRandomID('box')
        this.parentElement.appendChild(this.container)

        this.menuStart = document.createElement('div')
        this.menuStart.className = 'menu-start'
        this.menuStart.id = getRandomID('box-start')
        this.menuStart.classList.toggle('menu-x')
        this.container.appendChild(this.menuStart)

        for (let i = 1; i <= 3; i++) {
            const menuBar = document.createElement('div')
            menuBar.className = 'menu-bar' + i 
            menuBar.id = getRandomID('menu-bar') 
            this.menuStart.appendChild(menuBar)
        }

        this.content = document.createElement('div')
        this.content.className = 'box-content'
        this.content.id = getRandomID('box-content')
        this.container.appendChild(this.content)

        this.content.innerHTML = innerHTML

        if (name === 'CHAT') {
            this.container.classList.add('box-chat-container')
            this.content.classList.add('box-chat-content')
        }

        if (this.constructor.name === 'Box') {
            game.mainDiv.dispatchEvent(new CustomEvent('boxopen', { detail: { name: this.name } }))
        }

        this.initializeEvents()
    }

    close() {
        if (this.container) {
            this.container.remove()
            this.container = undefined
            
            game.mainDiv.dispatchEvent(new CustomEvent('boxclose', { detail: { name: this.name } }))
        }
    }

    initializeEvents() {
        this.menuStart.addEventListener('click', () => this.close())
    }
}