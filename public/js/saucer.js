import { ComplexFlyingObject } from './complexflyingobject.js'
import { Spacetime } from './spacetime.js'
import { Missile } from './missile.js'
import { Shard } from './shard.js'
import { getRandomID, getScreenSize, getHDRatio, getRandomInteger, getRandomPlusMinus } from './utils.js'

export class Saucer extends ComplexFlyingObject {
    constructor(size) {
        super()

        this.id = getRandomID('saucer')

        this.maxSizeSmall = Math.max(getScreenSize() / 40, 18)

        this.amounOfShards = 10
        this.startMargin = 40

        // Size: 2 large, 1 small
        this.size = [1, 2].includes(size) ? size : 2

        this.width = this.size * this.maxSizeSmall
        this.height = this.width

        this.counterChangeDirection = 0
        this.counterMaxChangeDirection = 50
        this.probabilityChangeDirection = 0.4 / ((this.size - 1) * 3 + 1) 

        this.counterFire = 0
        this.counterMaxFire = 150 * this.size 
        this.probabilityFireAccurate = this.size === 1 ? 0.25 : 0

        this.maxSpeed = 1.8 * getHDRatio()
        if (this.size === 2) this.maxSpeed *= 0.5

        this.speedX = 0
        this.speedY = 0

        if (Math.random() < 0.5) {
            this.left = 0
            this.speedX = this.maxSpeed
        }
        else {
            this.left = Spacetime.getWidth() - this.width
            this.speedX = - this.maxSpeed
        }

        this.top = Math.random() < 0.5 ? this.startMargin : Spacetime.getHeight() - this.height - this.startMargin

        // Canvas for saucer in super
        this.canvas.id = this.id
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'

        // Points for polygon (saucer shape)
        this.getPoints()
        this.polygon.setAttributeNS(undefined,'points', this.points.toString())

        // Two more lines for saucer
        this.line1 = document.createElementNS('http://www.w3.org/2000/svg','line')
        this.line1.setAttributeNS(undefined, 'x1', this.points[2])
        this.line1.setAttributeNS(undefined, 'y1', this.points[3])
        this.line1.setAttributeNS(undefined, 'x2', this.points[8])
        this.line1.setAttributeNS(undefined, 'y2', this.points[9])
        this.line1.setAttributeNS(undefined, 'stroke', this.color)
        this.line1.setAttributeNS(undefined, 'stroke-width', this.lineThickness)
        this.canvas.appendChild(this.line1)

        this.line2 = document.createElementNS('http://www.w3.org/2000/svg','line')
        this.line2.setAttributeNS(undefined, 'x1', this.points[0])
        this.line2.setAttributeNS(undefined, 'y1', this.points[1])
        this.line2.setAttributeNS(undefined, 'x2', this.points[10])
        this.line2.setAttributeNS(undefined, 'y2', this.points[11])
        this.line2.setAttributeNS(undefined, 'stroke', this.color)
        this.line2.setAttributeNS(undefined, 'stroke-width', this.lineThickness)
        this.canvas.appendChild(this.line2)

        const audioFlyingTrack = ['', 'saucer_small.mp3', 'saucer_big.mp3']
        this.audioFlying = new Audio(`/audio/${audioFlyingTrack[this.size]}`)
        this.audioFlying.loop = true
        
        this.play()

        const audioBangTrack = ['', 'bang_saucer_small.mp3', 'bang_saucer_big.mp3']
        this.audioBang = new Audio(`/audio/${audioBangTrack[this.size]}`)

        this.setAudioVolume()

        this.draw()
    }

    setAudioVolume() {
        this.audioFlying.volume = Spacetime.audioVolume
        this.audioBang.volume = Spacetime.audioVolume
    }

    play() {
        this.audioFlying.play()
    }

    stopPlay() {
        this.audioFlying.pause()
    }

    getPoints() {
        const shapePoints = [0, 6, 3, 4, 4, 2, 6, 2, 7, 4, 10, 6, 7, 8, 3, 8]
        const ratio = 10

        this.points = []

        for (let i = 0; i < shapePoints.length / 2; i++) {
            this.points.push(Math.round(shapePoints[2 * i] * this.width / ratio))
            this.points.push(Math.round(shapePoints[2 * i + 1] * this.height / ratio))
        }
    }

    draw() {
        super.draw()

        if (this.left > Spacetime.getWidth() || this.left < - this.width || this.top > Spacetime.getHeight() || this.top < - this.height) this.destroy()

        this.counterChangeDirection++
        if (this.counterChangeDirection > this.counterMaxChangeDirection) {
            this.counterChangeDirection = 0

            if (Spacetime.spaceship && Math.random() < this.probabilityChangeDirection) {
                const dx = Spacetime.spaceship.left - this.left
                const dy = Spacetime.spaceship.top - this.top 
                const dz2 = Math.pow(dx, 2) + Math.pow(dy, 2)
                const ratio = Math.sqrt(Math.pow(this.maxSpeed, 2) / dz2)

                this.speedX = ratio * dx
                this.speedY = ratio * dy
            }
        }

        this.counterFire++
        if (this.counterFire > this.counterMaxFire) {
            this.counterFire = 0
            this.fire()
        }
    }

    fire() {
        const startPoint = {
            x: Math.round(this.left + this.width / 2),
            y: Math.round(this.top + 0.3 * this.height)    
        }

        let fireAngle = getRandomInteger(360)

        if (Spacetime.spaceship && Math.random() < this.probabilityFireAccurate) {
            let dx = Spacetime.spaceship.left - this.left
            let dy = Spacetime.spaceship.top - this.top 

            const angleRad = Math.atan(dx / dy)

            fireAngle = - 180 * angleRad / Math.PI  // saucer under the spaceship
            if (Spacetime.spaceship.top >= this.top) fireAngle = fireAngle + 180  // saucer above the spaceship

        } 

        const direction = {
            angle: fireAngle,
            speedX: 0,
            speedY: 0
        }

        const options = {
            idPrefix: 'alien-missile',
            speedRatio: 1 / this.size
        }

        Spacetime.addMissile(new Missile(startPoint, direction, options))
    }

    hit() {
        const shardLeftTop = {
            left: this.left + this.width / 2,
            top: this.top + this.height / 2
        }

        for (let i = 0; i < this.amounOfShards; i++) {
            Spacetime.addShard(new Shard(shardLeftTop))
        }    

        this.destroy()   

        this.audioBang.play()
    }

    destroy() {
        Spacetime.removeSaucer()
        this.stopPlay()
    }

}    