import { game } from './game.js'
import { getRandomID } from './utils.js'

export class Box {
    constructor (parentElement, innerHTML = '') {
        this.parentElement = parentElement

        this.container = document.createElement('div')
        this.container.id = getRandomID('box')
        this.container.className = 'box-container'

        this.menuX = document.createElement('div')
        this.menuX.id = getRandomID('box-start')
        this.menuX.className = 'menu-start menu-x'
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

        this.isOpen = false

        this.initializeEvents()
    }

    initializeEvents() {
        this.menuX.addEventListener('click', () => this.close())
        game.mainDiv.addEventListener('boxopen', (e) => {
            if (e.detail && e.detail.name === this.constructor.name) this.close()
        })
    }

    open() {
        if (this.isOpen) return

        game.mainDiv.dispatchEvent(new CustomEvent('boxopen', { detail: { name: this.constructor.name } }))
        this.parentElement.appendChild(this.container)
        this.isOpen = true
    }

    close() {
        if (!this.isOpen) return

        this.container.remove()       
        game.mainDiv.dispatchEvent(new CustomEvent('boxclose', { detail: { name: this.constructor.name } }))
        this.isOpen = false
    }
}