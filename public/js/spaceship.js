import { ComplexFlyingObject } from './complexflyingobject.js'
import { Spacetime } from './spacetime.js'
import { Missile } from './missile.js'
import { PieceOfSpaceship } from './pieceofspaceship.js'
import { getRandomID, getScreenSize, getHDRatio, getRandomInteger, getRandomPlusMinus } from './utils.js'

export class Spaceship extends ComplexFlyingObject {
    constructor(left, top, size = 1, position = undefined, color = undefined) {

        super()

        this.id = getRandomID('spaceship')

        this.width = Math.round(getScreenSize() / 40)    // 27
        this.height = Math.round(getScreenSize() / 32)   // 34

        if (this.width < 18) {
            this.width = 18
            this.height = 23    
        }

        this.width *= size
        this.height *= size

        if (position) {
            this.canvas.style.position = position
        }

        if (color) {
            this.color = color
            this.polygon.setAttributeNS(undefined,'stroke', this.color)
        }

        this.amounOfPieces = 8

        this.intervalTimeAccelerate = 100  //msec
        this.intervalIdAccelerate = undefined

        this.maxAccelerate = 0.5 * getHDRatio()
        this.maxRotation = 3

        this.maxNumberOfMissiles = 5
        this.numberOfMissiles = 0
        this.intervalTimeFire = 100  //msec
        this.intervalIdFire = undefined

        this.hyperspace = 0
        this.maxHyperspaceTime = 100

        if (left === undefined) {
            this.left = Spacetime.getWidth() / 2 - this.width / 2
        } else {
            this.left = left
        }
        if (top === undefined) {
            this.top = Spacetime.getHeight() / 2 - this.height / 2
        } else {
            this.top = top
        }

        // Canvas for spaceship in super
        this.canvas.id = this.id
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'

        // Points for polygon (spaceship shape)
        this.getPoints()
        this.polygon.setAttributeNS(undefined,'points', this.points.toString())

        // Polygon (engine shape)
        this.polygonEngine = document.createElementNS('http://www.w3.org/2000/svg','polygon')
        this.polygonEngine.setAttributeNS(undefined,'points', this.pointsEngine.toString())
        this.polygonEngine.setAttributeNS(undefined,'fill', 'none')
        this.polygonEngine.setAttributeNS(undefined,'stroke', this.color)
        this.polygonEngine.setAttributeNS(undefined,'stroke-width', this.lineThickness)

        this.canvas.appendChild(this.polygonEngine)

        this.audioEngine = new Audio('../audio/thrust.mp3')
        this.audioEngine.loop = true

        this.audioBang =  new Audio('../audio/bang_ship.mp3')

        this.setAudioVolume()

        this.draw()

    }

    draw() {

        super.draw()

        if (this.intervalIdAccelerate) {
            this.polygonEngine.setAttributeNS(undefined,'display', 'block')
        } else {
            this.polygonEngine.setAttributeNS(undefined,'display', 'none')
        }

        if (this.hyperspace) {
            if (this.hyperspace === 1) {
                this.canvas.style.opacity = 0
                const width18 = Spacetime.getWidth() / 8
                const width68 = width18 * 6 
                const height18 = Spacetime.getHeight() / 8
                const height68 = height18 * 6
                this.left = getRandomInteger(width68) + width18 
                this.top = getRandomInteger(height68) + height18
            }
            this.hyperspace++
            if (this.hyperspace > this.maxHyperspaceTime) {
                this.hyperspace = 0

                this.canvas.style.opacity = 1
            }
        }
    }

    getPoints() {
        const witdh2 = Math.round(this.width / 2)
        const height75 = Math.round(this.height * 0.75)

        this.points = [witdh2, 0, this.width, this.height, witdh2, height75, 0, this.height]

        const witdh38 = Math.round(3 * this.width / 8)
        const witdh58 = Math.round(5 * this.width / 8)
        const height85 = Math.round(this.height * 0.85)

        this.pointsEngine = [witdh2, this.height, 
                            witdh38, height85, 
                            witdh2, height75, 
                            witdh58, height85]

    }

    setAudioVolume() {
        this.audioEngine.volume = Spacetime.audioVolume
        this.audioBang.volume = Spacetime.audioVolume
    }

    startRotation(direction) {
        if (direction === 'left') {
            this.rotation = -this.maxRotation
        } else if (direction === 'right') {
            this.rotation = this.maxRotation
        }
        
    }

    stopRotation() {
        this.rotation = 0
    }

    async startAccelerate() {
        if (this.intervalIdAccelerate) return
        
        try {
            this.audioEngine.play()
        } catch {

        }

        this.accelerate()
        this.intervalIdAccelerate = setInterval(() => {
            this.accelerate()
        }, this.intervalTimeAccelerate)
    }

    async stopAccelerate() {
        if (!this.intervalIdAccelerate) return

        try {
            this.audioEngine.pause()
        } catch {

        }

        clearInterval(this.intervalIdAccelerate)
        this.intervalIdAccelerate = undefined
    }

    accelerate() {
        const angleRad = this.angle * Math.PI / 180
        this.speedX += Math.sin(angleRad) * this.maxAccelerate
        this.speedY -= Math.cos(angleRad) * this.maxAccelerate
    }

    startFire() {
        if (this.intervalIdFire) return
        
        this.fire()
        this.intervalIdFire = setInterval(() => {
            this.fire()
        }, this.intervalTimeFire)
    }

    stopFire() {
        if (!this.intervalIdFire) return

        clearInterval(this.intervalIdFire)
        this.intervalIdFire = undefined
        this.numberOfMissiles = 0
    }

    fire() {
        if (this.numberOfMissiles >= this.maxNumberOfMissiles || this.hyperspace) return

        this.numberOfMissiles++

        const angleRad = this.angle * Math.PI / 180
        const r = this.height / 2
        const dx = r * Math.sin(angleRad)
        const dy = r * Math.cos(angleRad)

        const x = this.left + this.points[0] + dx
        const y = this.top  - dy + r

        Spacetime.addMissile(new Missile(x, y, this.angle, this.speedX, this.speedY))
    }

    startHyperspace() {
        this.hyperspace++
    }

    isHitBy(something) {
        if (this.hyperspace) return false

        return super.isHitBy(something)

    }

    async hit() {

        const centerX = this.left + this.width / 2
        const centerY = this.top + this.height / 2

        try {
            this.audioBang.play()
        } catch {

        }

        for (let i = 0; i < this.amounOfPieces; i++) {
            let x = centerX + getRandomPlusMinus(this.width / 4, this.width / 2)
            let y = centerY + getRandomPlusMinus(this.width / 4, this.width / 2)
            Spacetime.addShard(new PieceOfSpaceship(x, y, this.speedX, this.speedY))
        }    

        this.destroy()
    }

    destroy() {
        this.stopFire()
        this.stopAccelerate()
        Spacetime.removeSpaceship(this)          
    }

}    