import { SimpleFlyingObject } from './simpleflyingobject.js'
import { Spacetime } from './spacetime.js'
import { getRandomID, getHDRatio } from './utils.js'

export class Missile extends SimpleFlyingObject {
    constructor(x = 0, y = 0, angle = 0, startSpeedX = 0, startSpeedY = 0, idPrefix = 'missile', speedTimeRatio = 1) {
        super()

        this.id = getRandomID(idPrefix)
        this.canvas.id = this.id

        this.maxSpeed = 6 * speedTimeRatio * getHDRatio()     // px / intervalTime
        this.timeOfDestruction = Math.round(0.8 * Spacetime.getSize() / this.maxSpeed) * speedTimeRatio
        this.counterOfDestruction = 0

        this.left = x - 1
        this.top = y - 1

        const angleRad = angle * Math.PI / 180
        this.speedX += Math.sin(angleRad) * this.maxSpeed + startSpeedX
        this.speedY -= Math.cos(angleRad) * this.maxSpeed - startSpeedY

        let audioTrack = 'fire.mp3'
        if (idPrefix.startsWith('alien-')) audioTrack = 'fire_saucer.mp3'
        this.audio = new Audio(`../audio/${audioTrack}?v=20221114`)

        this.play()

        this.draw()

    }

    async play() {
        try {
            this.audio.play()
        } catch {

        }
    }

    draw() {

        super.draw()

        this.counterOfDestruction++
        if (this.counterOfDestruction > this.timeOfDestruction) {
            Spacetime.removeMissile(this)          
        }
    }

}