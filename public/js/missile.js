import { SimpleFlyingObject } from './simpleflyingobject.js'
import { Spacetime } from './spacetime.js'
import { getRandomID, getHDRatio } from './utils.js'

export class Missile extends SimpleFlyingObject {
    constructor(centerPoint = {}, direction = {}, options = {}) {
        // args: centerPoint = { x, y }, direction = { angle, speedX, speedY }, options = { idPrefix, speedRatio }

        super()

        this.id = getRandomID(options.idPrefix ? options.idPrefix : 'missile')
        this.canvas.id = this.id

        this.maxSpeed = 6 * getHDRatio() 
        this.timeOfDestruction = Math.round(0.8 * Spacetime.getSize() / this.maxSpeed)
        this.counterOfDestruction = 0

        this.maxSpeed *= options.speedRatio ? options.speedRatio : 1

        this.left = (centerPoint.x ? centerPoint.x : 0) - 1
        this.top = (centerPoint.y ? centerPoint.y : 0) - 1

        const angleRad = direction.angle ? direction.angle * Math.PI / 180 : 0
        this.speedX += Math.sin(angleRad) * this.maxSpeed
        this.speedX += direction.speedX ? direction.speedX : 0
        this.speedY -= Math.cos(angleRad) * this.maxSpeed
        this.speedY += direction.speedY ? direction.speedY : 0

        const audioTrack = this.id.startsWith('alien-') ? 'fire_saucer.mp3' : 'fire.mp3'

        this.audio = new Audio(`/audio/${audioTrack}`)
        this.audio.volume = Spacetime.audioVolume

        this.play()

        this.draw()

    }

    play() {
        this.audio.play()
    }

    draw() {

        super.draw()

        this.counterOfDestruction++
        if (this.counterOfDestruction > this.timeOfDestruction) Spacetime.removeMissile(this)
    }

}