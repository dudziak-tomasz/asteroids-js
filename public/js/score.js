import { game } from './game.js'
import { chat } from './chat.js'
import { highscore } from './highscore.js'

export const score = {
    score: 0,
    timeBlink: 1000,

    initialize(parentElement) {
        this.canvas = document.createElement('div')
        parentElement.appendChild(this.canvas)
        this.refresh()
    },

    refresh() {
        this.canvas.innerHTML = this.score
        if (this.score <= highscore.highscore) return 

        highscore.setAndRefresh(this.score)

        if (highscore.achieved) return 

        this.blink()
        highscore.achieved = true    
    },

    blink() {
        this.canvas.classList.add('score-blink')
        setTimeout(() => {
            this.canvas.classList.remove('score-blink')
        }, this.timeBlink)
    },

    addPoints(points) {
        const newScore = this.score + points
        if (Math.trunc(this.score / game.pointsForNewLife) < Math.trunc(newScore / game.pointsForNewLife)) {
            game.extraLife()
            chat.updateScore(newScore)
        }
        this.setAndRefresh(newScore)
    },

    setAndRefresh(score = 0) {
        this.score = score
        this.refresh()
    },

    restart() {
        this.setAndRefresh(0)
    }

}