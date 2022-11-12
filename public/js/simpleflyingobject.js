import { FlyingObject } from "./flyingobject.js"

export class SimpleFlyingObject extends FlyingObject {
    constructor() {

        super()

        this.width = 3
        this.height = this.width

        // Canvas for flying object
        this.canvas = document.createElement('div')
        this.canvas.style.backgroundColor = this.color
        this.canvas.style.position = 'absolute'
        this.canvas.style.width = this.width + 'px'
        this.canvas.style.height = this.height + 'px'
        
    }

    move() {
        super.move()

        this.draw()
    }

    draw () {
        const newLeft = Math.round(this.left)
        const newTop = Math.round(this.top)

        this.canvas.style.left = newLeft + 'px' 
        this.canvas.style.top = newTop + 'px'
    }

}