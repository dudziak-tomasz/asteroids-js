import { ComplexFlyingObject } from './complexflyingobject.js'
import { Spacetime } from './spacetime.js'
import { Shard } from './shard.js'
import { getRandomID, getScreenSize, getHDRatio, getRandomInteger, getRandomPlusMinus } from './utils.js'

export class Asteroid extends ComplexFlyingObject {
    constructor(size = 3, left = 0, top = 0) {

        super()

        this.id = getRandomID('asteroid')
        this.maxSizeSmall = getScreenSize() / 40       // px
        if (this.maxSizeSmall < 18) {
            this.maxSizeSmall = 18
        }

        this.amounOfShards = 6

        // Size: 3 large, 2 middle, 1 small
        if (size !== 1 && size !== 2 && size !== 3 ) {
            this.size = 3
        } else {
            this.size = size 
        }

        this.minSpeed = 0.3      // px / intervalTime
        this.maxSpeed = 2.4 * getHDRatio()       // px / intervalTime

        const speedRatio = (this.size - 1) / 2 + 1
        this.maxSpeed = (this.maxSpeed - this.minSpeed) / speedRatio + this.minSpeed

        this.minRotation = 0.3    // deg
        this.maxRotation = 0.7    // deg

        this.speedX = getRandomPlusMinus(this.minSpeed, this.maxSpeed)
        this.speedY = getRandomPlusMinus(this.minSpeed, this.maxSpeed)
        this.rotation = getRandomPlusMinus(this.minRotation, this.maxRotation)    

        if (left === 0) {
            if (Math.random() < 0.5) this.left = getRandomInteger(Spacetime.getWidth() / 3)
            else this.left = getRandomInteger(Spacetime.getWidth() / 3) + 2 * Spacetime.getWidth() / 3
        } else {
            this.left = left
        }

        if (top === 0) {
            if (Math.random() < 0.5) this.top = getRandomInteger(Spacetime.getHeight() / 3)
            else this.top = getRandomInteger(Spacetime.getHeight() / 3) + 2 * Spacetime.getHeight() / 3
        } else {
            this.top = top
        }

        this.width = this.size * this.maxSizeSmall
        this.height = this.width    

        // Canvas for asteroid - created in super
        this.canvas.id = this.id
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'

        // Points for polygon (asteroid shape)
        this.getRandomPoints()
        this.polygon.setAttributeNS(undefined,'points', this.points.toString())

        const audioBangTrack = ['', 'bang_small.mp3', 'bang_medium.mp3', 'bang_large.mp3']
        this.audioBang = new Audio(`/audio/${audioBangTrack[this.size]}`)
        this.setAudioVolume()

        this.draw()

    }

    getRandomPoints() {
        this.points = []
        const fraction = 4
        const iSorted = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4]

        const widthPart = this.width / fraction
        const heightPart = this.height / fraction
        iSorted.forEach((i) => {
            let x = getRandomInteger(widthPart) 
            let y = getRandomInteger(heightPart)
            x += (i % fraction) * widthPart
            y += Math.trunc(i / fraction) * heightPart
            x = Math.trunc(x)
            y = Math.trunc(y)
            this.points.push(x,y)
        })
    }

    setAudioVolume() {
        this.audioBang.volume = Spacetime.audioVolume
    }

    hit() {

        const newSize = this.size - 1
        const newLeft = this.left + this.width / 4
        const newTop = this.top + this.height / 4
        const shardLeft = this.left + this.width / 2
        const shardTop = this.top + this.height / 2

        if (this.size > 1) {
            Spacetime.addAsteroid(new Asteroid(newSize, newLeft, newTop))
            Spacetime.addAsteroid(new Asteroid(newSize, newLeft, newTop))
        } 

        for (let i = 0; i < this.amounOfShards; i++) {
            Spacetime.addShard(new Shard(shardLeft, shardTop))
        }    

        Spacetime.removeAsteroid(this)

        this.audioBang.play()
    }

}