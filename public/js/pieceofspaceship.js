import { SimpleFlyingObject } from "./simpleflyingobject.js"
import { Spacetime } from "./spacetime.js"
import { getRandomID, getRandomPlusMinus, getRandomInteger, getScreenSize } from "./utils.js"

export class PieceOfSpaceship extends SimpleFlyingObject {
    constructor(x = 0, y = 0, startSpeedX = 0, startSpeedY = 0) {

        super()

        this.id = getRandomID('piece')
        this.canvas.id = this.id

        this.minSpeed = 0.1     // px / intervalTime
        this.maxSpeed = 0.3       // px / intervalTime
        this.minRotation = 0.7    // deg
        this.maxRotation = 1.5    // deg
        this.timeOfDestruction = 200 // timeOfDestruction * Spacetime.intervalTime = msec
        this.counterOfDestruction = 0

        this.height = Math.round(getScreenSize() / 60) 
        if (this.height < 12) this.height = 12
        
        this.width = 2
        this.left = x
        this.top = y - this.height

        this.speedX = getRandomPlusMinus(this.minSpeed, this.maxSpeed) + startSpeedX / 3
        this.speedY = getRandomPlusMinus(this.minSpeed, this.maxSpeed) + startSpeedY / 3
        this.rotation = getRandomPlusMinus(this.minRotation, this.maxRotation)    
        this.angle = getRandomInteger(360)    

        this.draw()
    }

    draw() {

        super.draw()

        const newAngle = Math.round(this.angle)
        const newOpacity = 1 - this.counterOfDestruction / this.timeOfDestruction

        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'
        this.canvas.style.transform = `rotate(${newAngle}deg)`
        if (this.counterOfDestruction > 0.8 * this.timeOfDestruction) this.canvas.style.opacity = newOpacity

        this.counterOfDestruction++
        if (this.counterOfDestruction > this.timeOfDestruction) {
            Spacetime.removeShard(this)
        }
    }

}
