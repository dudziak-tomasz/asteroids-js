import { game } from './game.js'
import { getRandomID } from './utils.js'

export class Box {
    constructor (parentElement, innerHTML = '', name = '') {
        this.parentElement = parentElement

        this.name = name

        this.container = document.createElement('div')
        this.container.id = getRandomID('box')
        this.container.className = 'box-container'
        this.parentElement.appendChild(this.container)

        this.menuX = document.createElement('div')
        this.menuX.id = getRandomID('box-start')
        this.menuX.className = 'menu-start'
        this.menuX.classList.toggle('menu-x')
        this.container.appendChild(this.menuX)

        for (let i = 1; i <= 3; i++) {
            const menuBar = document.createElement('div')
            menuBar.id = getRandomID('menu-bar') 
            menuBar.className = 'menu-bar' + i 
            this.menuX.appendChild(menuBar)
        }

        this.content = document.createElement('div')
        this.content.id = getRandomID('box-content')
        this.content.className = 'box-content'
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
        this.menuX.addEventListener('click', () => this.close())
    }
}