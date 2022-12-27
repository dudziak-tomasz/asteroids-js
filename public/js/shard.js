import { SimpleFlyingObject } from './simpleflyingobject.js'
import { Spacetime } from './spacetime.js'
import { getHDRatio, getRandomID, getRandomPlusMinus } from './utils.js'

export class Shard extends SimpleFlyingObject {
    constructor(left = 0, top = 0) {

        super()

        this.id = getRandomID('shard')
        this.canvas.id = this.id

        this.minSpeed = 0.5
        this.maxSpeed = 2 * getHDRatio()
        this.timeOfDestruction = 50
        this.counterOfDestruction = 0

        this.left = left
        this.top = top

        this.speedX = getRandomPlusMinus(this.minSpeed, this.maxSpeed)
        this.speedY = getRandomPlusMinus(this.minSpeed, this.maxSpeed)

        this.draw()
    }

    draw() {

        super.draw()

        this.counterOfDestruction++
        if (this.counterOfDestruction > this.timeOfDestruction) {
            Spacetime.removeShard(this)
        }
    }

}

