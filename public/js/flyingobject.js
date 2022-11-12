import { Spacetime } from './spacetime.js'

export class FlyingObject {
    constructor() {

        this.left = 0
        this.top = 0
        this.width = 0
        this.height = 0

        this.angle = 0
        this.speedX = 0
        this.speedY = 0
        this.rotation = 0
        
        this.color = 'white'
    }

    move() {
        if (this.left > Spacetime.getWidth() && this.speedX >= 0) {
            this.left = - this.width
        } 
        if (this.left + this.width < 0 && this.speedX < 0) {
            this.left = Spacetime.getWidth()
        }

        if (this.top > Spacetime.getHeight() && this.speedY >= 0) {
            this.top = - this.height
        }  
        if (this.top + this.height < 0 && this.speedY < 0) {
            this.top = Spacetime.getHeight()
        }
        
        this.left += this.speedX
        this.top += this.speedY

        if (this.rotation !== 0) {
            this.angle += this.rotation

            if (this.angle < 0) {
                this.angle += 360
            } else if (this.angle > 360) {
                this.angle -= 360
            }    
        }

    }

}