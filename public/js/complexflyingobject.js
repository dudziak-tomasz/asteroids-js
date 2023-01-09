import { FlyingObject } from './flyingobject.js'
import { isPointInsideRectangle } from './utils.js'

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
        const center = {
            x: missile.left + missile.width / 2,
            y: missile.top + missile.height / 2
        }

        return isPointInsideRectangle(center, this)
    }

    isHitBy(something) {
        const left04 = this.left + .4 * this.width
        const left06 = this.left + .6 * this.width
        const top04 = this.top + .4 * this.height
        const top06 = this.top + .6 * this.height

        const leftTop = { x: left04, y: top04 }
        const rightTop = { x: left06, y: top04 }
        const leftBottom = { x: left04, y: top06 } 
        const rightBottom = { x: left06, y: top06 }

        return  isPointInsideRectangle(leftTop, something) ||
                isPointInsideRectangle(rightTop, something) ||
                isPointInsideRectangle(leftBottom, something) ||
                isPointInsideRectangle(rightBottom, something)

    }
}