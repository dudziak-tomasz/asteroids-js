import { game } from './game.js'

export const controls = {

    rotation: [],
    accelerate: false,
    fire: [],
    hyperspace: [],
    isTouch: false,
    touchMoveSensitivity: 30,
    touchAccelerationSensitivity: 50,
    touchHyperspaceSensitivity: 100,

    initialize() {
        document.addEventListener('keydown', (event) => this.eventKeyDown(event))
        document.addEventListener('keyup', (event) => this.eventKeyUp(event))
    
        game.mainDiv.addEventListener('mousedown', (event) => this.eventMouseDown(event))
        game.mainDiv.addEventListener('mouseup', (event) => this.eventMouseUp(event))

        game.mainDiv.addEventListener('touchstart', (event) => this.eventTouchStart(event))
        game.mainDiv.addEventListener('touchmove', (event) => this.eventTouchMove(event))
        game.mainDiv.addEventListener('touchend', (event) => this.eventTouchEnd(event))
    },

    eventKeyDown(event) {
        switch(event.code) {
            case 'KeyP':
                game.switchPause()
                break
            case 'KeyA':
            case 'ArrowLeft':
                if (!this.rotation.includes('left')) this.rotation.unshift('left')
                break
            case 'KeyD':
            case 'ArrowRight':
                if (!this.rotation.includes('right')) this.rotation.unshift('right')
                break
            case 'KeyW':
            case 'ArrowUp':
                this.accelerate = true
                break
            case 'Space':
                if (!this.fire.includes('keyboard')) this.fire.unshift('keyboard')
                break
            case 'KeyH':
                if (!this.hyperspace.includes('keyboard')) this.hyperspace.unshift('keyboard')
                break
        }        

        game.checkControls()
    },

    eventKeyUp(event) {
        switch(event.code) {
            case 'KeyA':
            case 'ArrowLeft':
                const indexLeft = this.rotation.findIndex(r => r === 'left')
                this.rotation.splice(indexLeft, 1)
                break
            case 'KeyD':
            case 'ArrowRight':
                const indexRight = this.rotation.findIndex(r => r === 'right')
                this.rotation.splice(indexRight, 1)
                break
            case 'KeyW':
            case 'ArrowUp':
                this.accelerate = false
                break
            case 'Space':
                const indexFire = this.fire.findIndex(f => f === 'keyboard')
                this.fire.splice(indexFire, 1)
                break
            case 'KeyH':
                const indexHyperspace = this.hyperspace.findIndex(h => h === 'keyboard')
                this.hyperspace.splice(indexHyperspace, 1)
                break
        }    

        game.checkControls()
    },

    eventMouseDown(event) {
        if (this.isTouch) return

        switch(event.button) {
            case 0:
                if (!this.fire.includes('mouse')) this.fire.unshift('mouse')
                break
            case 2:
                if (!this.hyperspace.includes('mouse')) this.hyperspace.unshift('mouse')
                break
        }
        
        game.checkControls()
    },

    eventMouseUp(event) {
        if (this.isTouch) return this.isTouch = false

        switch(event.button) {
            case 0:
                const indexFire = this.fire.findIndex(f => f === 'mouse')
                this.fire.splice(indexFire,1)
                break
            case 2:
                const indexHyperspace = this.hyperspace.findIndex(h => h === 'mouse')
                this.hyperspace.splice(indexHyperspace,1)
                break
        }
        
        game.checkControls()
    },

    eventTouchStart(event) {
        this.isTouch = true
        if (event.targetTouches.length === 0) return

        this.touchStart = []
        this.touchStart.push({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY})

        if (!this.fire.includes('touch')) this.fire.unshift('touch')

        this.rotation = []

        game.checkControls()
    },

    eventTouchMove(event) {
        if (event.targetTouches.length === 0) return

        this.touchEnd = []
        this.touchEnd.push({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY})

        let newRotation = ''
        let newAcclerate = false
        let newHyperspace = false

        const swipeLeft = this.touchEnd[0].x - this.touchStart[0].x < - this.touchMoveSensitivity
        const swipeRight = this.touchEnd[0].x - this.touchStart[0].x > this.touchMoveSensitivity
        const swipeUp = this.touchEnd[0].y - this.touchStart[0].y < - this.touchAccelerationSensitivity
        const swipeDown = this.touchEnd[0].y - this.touchStart[0].y > this.touchHyperspaceSensitivity

        if (swipeLeft) newRotation = 'left'
        else if (swipeRight) newRotation = 'right'
        if (swipeUp) newAcclerate = true
        if (swipeDown) newHyperspace = true

        if (newRotation === 'left' && !this.rotation.includes('left')) this.rotation.unshift('left')
        if (newRotation === 'right' && !this.rotation.includes('right')) this.rotation.unshift('right')
        this.accelerate = newAcclerate
        if (newHyperspace && !this.hyperspace.includes('touch')) this.hyperspace.unshift('touch')

        game.checkControls()
    },

    eventTouchEnd() {
        this.accelerate = false
        this.fire = []
        this.hyperspace = []

        game.checkControls()
    },

    isHyperspace() {
        return this.hyperspace.length > 0
    },

    isFire() {
        return this.fire.length > 0
    },

    isRotation() {
        return this.rotation.length > 0
    },

    rotationDirection() {
        return this.isRotation() ? this.rotation[0] : ''
    },

    isAccelerate() {
        return this.accelerate
    },
}