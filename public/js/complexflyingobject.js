import { FlyingObject } from "./flyingobject.js"
import { isPointInside } from "./utils.js"

export class ComplexFlyingObject extends FlyingObject {
    constructor() {

        super()

        this.lineThickness = 2  // px

        // Canvas for flying object
        this.canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.canvas.style.position = 'absolute'

        // Polygon (flying object shape)
        this.polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon')
        this.polygon.setAttributeNS(undefined,'fill', 'none')
        this.polygon.setAttributeNS(undefined,'stroke', this.color)
        this.polygon.setAttributeNS(undefined,'stroke-width', this.lineThickness)

        this.canvas.appendChild(this.polygon)

    }

    move() {
        super.move()

        this.draw()
    }

    draw () {
        const newLeft = Math.round(this.left)
        const newTop = Math.round(this.top)
        const newAngle = Math.round(this.angle)

        this.canvas.style.left = newLeft + 'px' 
        this.canvas.style.top = newTop + 'px'
        this.canvas.style.transform = `rotate(${newAngle}deg)`
    }

    isHitByMissile(missile) {
        const x = missile.left + missile.width / 2
        const y = missile.top + missile.height / 2

        return isPointInside(x, y, this.left, this.top, this.width, this.height)
    }

    isHitBy(something) {

        const p = [
            this.left + .4 * this.width, this.top + .4 * this.height,
            this.left + .6 * this.width, this.top + .4 * this.height,
            this.left + .4 * this.width, this.top + .6 * this.height,
            this.left + .6 * this.width, this.top + .6 * this.height
        ]

        let sum = 0
        for (let i = 0; i < 4; i++) {
            sum += isPointInside(p[2 * i], p[2 * i + 1], something.left, something.top, something.width, something.height)
        }

        return sum > 0 

    }
}