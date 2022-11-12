class Missile extends SimpleFlyingObject {
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

        this.audio = new Audio('../audio/fire.mp3')
        this.audio.volume = 0.1
        this.audio.play()

        this.draw()

    }

    draw() {

        super.draw()

        this.counterOfDestruction++
        if (this.counterOfDestruction > this.timeOfDestruction) {
            Spacetime.removeMissile(this)          
        }
    }

}