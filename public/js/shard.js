class Shard extends SimpleFlyingObject {
    constructor(left = 0, top = 0) {

        super()

        this.id = getRandomID('shard')
        this.canvas.id = this.id

        this.minSpeed = 0.5     // px / intervalTime
        this.maxSpeed = 2 * getHDRatio()      // px / intervalTime
        this.timeOfDestruction = 50 // timeOfDestruction * Spacetime.intervalTime = msec
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

