import { game } from './game.js'
import { highscore } from './highscore.js'

export const score = {
    score: 0,
    timeBlink: 1000,
    pointsForAsteroids: [0, 100, 50, 20],
    pointsForSaucers: [0, 1000, 200],

    initialize(parentElement) {
        this.canvas = document.createElement('div')
        parentElement.appendChild(this.canvas)
        this.initializeCustomEvents()
        this.refresh()
    },

    initializeCustomEvents () {
        game.mainDiv.addEventListener('asteroidhit', (e) => {
            const points = this.pointsForAsteroids[e.detail.size]
            this.addPoints(points)
        })

        game.mainDiv.addEventListener('saucerhit', (e) => {
            const points = this.pointsForSaucers[e.detail.size]
            this.addPoints(points)
        })
    },

    blink() {
        this.canvas.classList.add('score-blink')
        setTimeout(() => {
            this.canvas.classList.remove('score-blink')
        }, this.timeBlink)
    },

    refresh() {
        this.canvas.innerHTML = this.score
        if (this.score <= highscore.highscore) return 

        highscore.setAndRefresh(this.score)

        if (highscore.achieved) return 

        this.blink()
        highscore.achieved = true    
    },

    addPoints(points) {
        const oldScore = this.score
        this.score += points
        if (Math.trunc(oldScore / game.pointsForNewLife) < Math.trunc(this.score / game.pointsForNewLife)) {
            game.extraLife()
        }
        this.refresh()
    },

    setAndRefresh(score = 0) {
        this.score = score
        this.refresh()
    },

    restart() {
        this.setAndRefresh(0)
    }
}