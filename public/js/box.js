import { getRandomID } from './utils.js'

export class Box {
    constructor (parentElement, innerHTML = '') {
        this.parentElement = parentElement

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

        this.initializeEvents()
    }

    close() {
        if (this.container) {
            this.container.remove()
            this.container = undefined    
        }
    }

    initializeEvents() {
        this.menuStart.addEventListener('click', () => this.close())
    }
}