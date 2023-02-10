import { Spaceship } from './spaceship.js'

export const lives = {
    lives: [],
    initialNumberOfLives: 3,

    initialize(parentElement) {
        this.canvas = document.createElement('div')
        parentElement.appendChild(this.canvas)
    },

    restart() {
        this.lives = []
        this.canvas.innerHTML = ''
        for (let i = 0; i < this.initialNumberOfLives; i++) this.add()
    },

    add() {
        const color = getComputedStyle(this.canvas).getPropertyValue('--gray') || 'white'
        this.lives.push(new Spaceship({ size: 0.6, position: 'static', color }))
        this.refresh()
    },

    refresh() {
        this.canvas.innerHTML = ''
        this.lives.forEach(life => this.canvas.appendChild(life.canvas))
    },

    remove() {
        if (!this.isLife()) return

        this.lives.shift().canvas.remove()
        this.refresh()
    },

    isLife() {
        return this.lives.length > 0
    },
}