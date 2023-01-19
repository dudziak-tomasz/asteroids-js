import { SimpleFlyingObject } from './simpleflyingobject.js'
import { Spacetime } from './spacetime.js'
import { getRandomID, getRandomPlusMinus, getRandomInteger, getScreenSize } from './utils.js'

export class PieceOfSpaceship extends SimpleFlyingObject {
    constructor(startPoint = {}, startSpeed = {}) {
        super()

        this.id = getRandomID('piece')
        this.canvas.id = this.id

        this.minSpeed = 0.1
        this.maxSpeed = 0.3
        this.minRotation = 0.7
        this.maxRotation = 1.5
        this.timeOfDestruction = 200
        this.counterOfDestruction = 0

        this.height = Math.max(Math.round(getScreenSize() / 60), 12)
        
        this.width = 2
        this.left = startPoint.x ? startPoint.x : 0
        this.top = startPoint.y ? startPoint.y - this.height : 0

        this.speedX = getRandomPlusMinus(this.minSpeed, this.maxSpeed)
        this.speedX += startSpeed.speedX ? startSpeed.speedX / 3 : 0
        this.speedY = getRandomPlusMinus(this.minSpeed, this.maxSpeed) 
        this.speedY += startSpeed.speedY ? startSpeed.speedY / 3 : 0

        this.rotation = getRandomPlusMinus(this.minRotation, this.maxRotation)    
        this.angle = getRandomInteger(360)    

        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'

        this.draw()
    }

    draw() {
        super.draw()

        const newAngle = Math.round(this.angle)
        this.canvas.style.transform = `rotate(${newAngle}deg)`

        if (this.counterOfDestruction > 0.8 * this.timeOfDestruction) {
            const newOpacity = 1 - this.counterOfDestruction / this.timeOfDestruction
            this.canvas.style.opacity = newOpacity
        }

        this.counterOfDestruction++
        if (this.counterOfDestruction > this.timeOfDestruction) Spacetime.removeShard(this)
    }

}
