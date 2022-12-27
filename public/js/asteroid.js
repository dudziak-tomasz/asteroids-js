import { ComplexFlyingObject } from './complexflyingobject.js'
import { Spacetime } from './spacetime.js'
import { Shard } from './shard.js'
import { getRandomID, getScreenSize, getHDRatio, getRandomInteger, getRandomPlusMinus } from './utils.js'

export class Asteroid extends ComplexFlyingObject {
    constructor(size = 3, left = 0, top = 0) {

        super()

        this.id = getRandomID('asteroid')
        
        this.maxSizeSmall = Math.max(getScreenSize() / 40, 18)

        this.amounOfShards = 6

        // Size: 3 large, 2 middle, 1 small
        this.size = [1, 2, 3].includes(size) ? size : 3

        this.minSpeed = 0.3      
        this.maxSpeed = 2.4 * getHDRatio()

        const speedRatio = (this.size - 1) / 2 + 1
        this.maxSpeed = (this.maxSpeed - this.minSpeed) / speedRatio + this.minSpeed

        this.minRotation = 0.3
        this.maxRotation = 0.7

        this.speedX = getRandomPlusMinus(this.minSpeed, this.maxSpeed)
        this.speedY = getRandomPlusMinus(this.minSpeed, this.maxSpeed)
        this.rotation = getRandomPlusMinus(this.minRotation, this.maxRotation)    

        if (left === 0) {
            const width3 = Spacetime.getWidth() / 3
            const randWidth3 = getRandomInteger(width3)
            this.left = Math.random() < 0.5 ? randWidth3 : randWidth3 + 2 * width3
        } else {
            this.left = left
        }

        if (top === 0) {
            const height3 = Spacetime.getHeight() / 3
            const randHeight3 = getRandomInteger(height3)
            this.top = Math.random() < 0.5 ? randHeight3 : randHeight3 + 2 * height3
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