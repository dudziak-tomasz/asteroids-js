const game = {
    parentElement: undefined,
    mainDiv: undefined,
    canvasAlert: undefined,
    canvasScore: undefined,
    canvasHighScore: undefined,
    level: 0,
    score: 0,
    highScore: 0,
    seconds: 0,
    highScoreAchieved: false,
    scoreForAsteroids: [0, 100, 50, 20],
    scoreForSaucers: [0, 1000, 200],
    scoreForNewLife: 10000,
    lives: [],
    numberOfLives: 3,
    pause: false,
    rotation: [],
    accelerate: false,
    fire: [],
    hyperspace: [],
    timeBetweenLevels: 3000,   // msec
    timeBlikScore: 1000,    // msec
    timeBetweenSaucers: 15, // 15 sec
    probabilityMinCreateSaucer: 0.3,  // 0.3
    probabilityCreateSaucer: this.probabilityMinCreateSaucer,
    typeOfSaucer: [2000, 10000, 40000],   // [2000, 10000, 40000] 0 - no saucer - 2000 - large saucer - 10000 - random saucer - 40000 - small saucer
    startingLevel: false,
    pressFireTo: '',
    isTouch: false,

    createGame(parentElement) {
        this.parentElement = parentElement

        this.initializeMianDiv()

        this.initializeCanvasAlert()
        this.initializeCanvasScore()
        this.initializeCanvasHighScore()

        this.refreshScore()

        this.getHighScore()
        this.refreshHighScore()

        this.initializeCustomEvents()

        Spacetime.createSpacetime(this.mainDiv)

        Spacetime.createAsteroids(2,3)
        Spacetime.createAsteroids(2,2)
        Spacetime.createAsteroids(3,1)

        this.initializeGame()
    },

    pressFireNoSpaceship() {

        switch (this.pressFireTo) {
            case 'initializegame':
                this.initializeGame()
                break
            case 'startgame':
                this.startGame()
                break
            case 'startspaceship':
                this.startSpaceship()
                break
        }
    },

    initializeGame() {
        this.pressFireTo = 'startgame'
        this.showAlert('PRESS FIRE TO START GAME')
    },

    startGame() {
        this.pressFireTo = ''
        this.hideAlert()

        this.level = 0
        this.score = 0
        this.seconds = 0
        this.probabilityCreateSaucer = this.probabilityMinCreateSaucer

        this.initializeLives()
        this.refreshScore()

        this.highScoreAchieved = false
        this.getHighScore()
        this.refreshHighScore()

        Spacetime.removeAllAsteroid()

        this.startLevel()
    },

    startLevel() {
        game.level++
        this.showAlert(`LEVEL ${this.level}`)    
        this.startingLevel = true
        setTimeout(() => {
            this.hideAlert()
            this.startingLevel = false
            Spacetime.createAsteroids(this.level + 1)
            if (!Spacetime.spaceship) this.newSpaceship()
        }, game.timeBetweenLevels)
    },

    startSpaceship() {
        this.pressFireTo = ''
        this.hideAlert() 

        this.lives.shift().canvas.remove()
        this.refreshScore()
        Spacetime.createSpaceship()    
    },

    newSpaceship() {
        if (this.lives.length > 0) {
            if (this.startingLevel) return
            this.showAlert('PRESS FIRE TO PLAY')
            this.pressFireTo = 'startspaceship'
        } else {
            this.gameOver()
        } 
    },

    gameOver() {
        this.showAlert('GAME OVER')
        this.pressFireTo = 'initializegame'
    },

    initializeCustomEvents () {
        this.mainDiv.addEventListener('asteroidhit', (e) => {
            this.addPoints(this.scoreForAsteroids[e.detail.size])
        })

        this.mainDiv.addEventListener('saucerhit', (e) => {
            this.addPoints(this.scoreForSaucers[e.detail.size])
        })

        this.mainDiv.addEventListener('spaceshiphit', () => {
            this.newSpaceship()
        })

        this.mainDiv.addEventListener('noasteroids', () => {
            this.startLevel()
        })

        this.mainDiv.addEventListener('onesecond', () => {
            this.seconds++
            if (this.seconds % this.timeBetweenSaucers === 0) this.generateSaucer()
        })
    },

    generateSaucer() {
        if (!Spacetime.spaceship || Spacetime.saucer || this.pause || this.startingLevel) return

        if (this.score < this.typeOfSaucer[0]) return   // 2000

        if (this.score < this.typeOfSaucer[1]) {       // 10000
            if (Math.random() < this.probabilityCreateSaucer) Spacetime.createSaucer(2)
            return
        }

        if (this.score < this.typeOfSaucer[2]) {       // 40000
            if (Math.random() < this.probabilityCreateSaucer) {
                if (Math.random() < 0.5) Spacetime.createSaucer(1)
                else Spacetime.createSaucer(2)
            }
            return
        }

        if (Math.random() < this.probabilityCreateSaucer) Spacetime.createSaucer(1)
    },

    extraLife() {
        this.addLives()
        this.blinkScore()

        this.probabilityCreateSaucer += (1 - this.probabilityCreateSaucer) / 5
    },

    addPoints(points) {
        const newScore = this.score + points
        if (Math.trunc(this.score / this.scoreForNewLife) < Math.trunc(newScore / this.scoreForNewLife)) {
            this.extraLife()
        }
        this.score = newScore
        this.refreshScore()
    },

    initializeLives() {
        for (let i = 0; i < this.numberOfLives; i++) {
            this.addLives()
        }
    },

    addLives() {
        let color = getComputedStyle(this.canvasScore).getPropertyValue('--gray')
        if (!color || color === '') color = 'white'
        this.lives.push(new Spaceship(0, 0, 0.6, 'static', color))
    },

    refreshScore() {
        this.canvasScore.innerHTML = `${this.score}<br>`
        for (let i = 0; i < this.lives.length; i++) {
            this.canvasScore.appendChild(this.lives[i].canvas)
        }

        if (this.score > this.highScore) {
            this.highScore = this.score
            this.refreshHighScore()
            this.setHighScore()
            if (!this.highScoreAchieved) {
                this.blinkScore()
                this.highScoreAchieved = true    
            }
        }
    },

    blinkScore() {
        this.canvasScore.className = 'score-blink'
        setTimeout(() => {
            this.canvasScore.className = 'score'
        }, this.timeBlikScore)
    },

    refreshHighScore() {
        this.canvasHighScore.innerHTML = `${this.highScore}`
    },

    getHighScore() {
        const hs = localStorage.getItem('highScore')
        if (hs) this.highScore = parseInt(hs)
        else this.setHighScore()
    },

    setHighScore() {
        localStorage.setItem('highScore', this.highScore)
    },

    showAlert(alertHTML) {
        this.canvasAlert.className = 'alert'
        this.canvasAlert.innerHTML = alertHTML
    },

    hideAlert() {
        this.canvasAlert.className = 'alert-hidden'
    },

    switchPause() {
        if (!Spacetime.spaceship) return

        if (game.pause) {
            Spacetime.start()

            this.checkSwitches()
        } else {
            Spacetime.stop()
            Spacetime.spaceship.stopAccelerate()
            Spacetime.spaceship.stopFire()
            Spacetime.spaceship.stopRotation()    
        }
        game.pause = !game.pause
    },

    checkSwitches() {
        if (!Spacetime.spaceship) {
            
            if (this.fire.length > 0) this.pressFireNoSpaceship()

            return
        }

        if (this.hyperspace.length > 0) Spacetime.spaceship.startHyperspace()

        if (this.fire.length > 0) Spacetime.spaceship.startFire()
        else Spacetime.spaceship.stopFire()

        if (this.rotation.length > 0) Spacetime.spaceship.startRotation(this.rotation[0])
        else Spacetime.spaceship.stopRotation()

        if (this.accelerate) Spacetime.spaceship.startAccelerate()
        else Spacetime.spaceship.stopAccelerate()

    },

    eventKeyDown(event) {
        // event.preventDefault()

        // console.log(event.code)

        switch(event.code) {
            case 'Escape':
            case 'KeyP':
                this.switchPause()
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

        if (!this.pause) this.checkSwitches()
    },

    eventKeyUp(event) {

        switch(event.code) {
            case 'KeyA':
            case 'ArrowLeft':
                const indexLeft = this.rotation.findIndex(r => r === 'left')
                this.rotation.splice(indexLeft,1)
                break
            case 'KeyD':
            case 'ArrowRight':
                const indexRight = this.rotation.findIndex(r => r === 'right')
                this.rotation.splice(indexRight,1)
                break
            case 'KeyW':
            case 'ArrowUp':
                this.accelerate = false
                break
            case 'Space':
                const indexFire = this.fire.findIndex(f => f === 'keyboard')
                this.fire.splice(indexFire,1)
                break
            case 'KeyH':
                const indexHyperspace = this.hyperspace.findIndex(h => h === 'keyboard')
                this.hyperspace.splice(indexHyperspace,1)
                break
        }    

        if (!this.pause) this.checkSwitches()
    },

    eventMouseDown(event) {
        event.preventDefault()

        if (this.isTouch) return

        switch(event.button) {
            case 0:
                if (!this.fire.includes('mouse')) this.fire.unshift('mouse')
                break
            case 2:
                if (!this.hyperspace.includes('mouse')) this.hyperspace.unshift('mouse')
                break
        }
        
        if (!this.pause) this.checkSwitches()
    },

    eventMouseUp(event) {
        event.preventDefault()

        if (this.isTouch) return

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
        
        if (!this.pause) this.checkSwitches()
    },

    eventTouchStart(event) {

        this.isTouch = true

        this.touchStart = []
        this.touchEnd = []

        for (let i = 0; i < event.targetTouches.length; i++) {
            this.touchStart.push({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY})
        }

        this.touchEnd = this.touchStart

        // Fire
        if (!this.fire.includes('touch')) this.fire.unshift('touch')

        // Rotation stop
        this.rotation = []

        if (!this.pause) this.checkSwitches()
    },

    eventTouchMove(event) {

        this.touchEnd = []

        for (let i = 0; i < event.targetTouches.length; i++) {
            this.touchEnd.push({ x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY})
        }

        const moveSensitivity = 30
        const accelerationSensitivity = 50
        const hyperspaceSensitivity = 100
        let newRotation = ''
        let newAcclerate = false
        let newHyperspace = false

        for (let i = 0; i < event.targetTouches.length; i++) {
            if (this.touchEnd[i].x - this.touchStart[i].x < - moveSensitivity) newRotation = 'left'
            else if (this.touchEnd[i].x - this.touchStart[i].x > moveSensitivity) newRotation = 'right'

            if (this.touchEnd[i].y - this.touchStart[i].y < - accelerationSensitivity) newAcclerate = true

            if (this.touchEnd[i].y - this.touchStart[i].y > hyperspaceSensitivity) newHyperspace = true
        }

        // Rotation
        if (newRotation === 'left' && !this.rotation.includes('left')) this.rotation.unshift('left')
        if (newRotation === 'right' && !this.rotation.includes('right')) this.rotation.unshift('right')

        // Accelerate
        this.accelerate = newAcclerate

        // Hyperspace
        if (newHyperspace && !this.hyperspace.includes('touch')) {
            this.hyperspace.unshift('touch')
            this.rotation = []
        } 

        if (!this.pause) this.checkSwitches()
    },

    async eventTouchEnd(event) {

        // fullscreen
        if (this.touchStart.length > 1 && this.touchEnd.length > 1 && 
            this.touchStart[0].x !== this.touchEnd[0].x && this.touchStart[0].y !== this.touchEnd[0].y &&
            this.touchStart[1].x !== this.touchEnd[1].x && this.touchStart[1].y !== this.touchEnd[1].y) {
            try {
                await document.body.requestFullscreen()
            } catch {
            }    
        }

        this.accelerate = false
        this.fire = []
        this.hyperspace = []

        if (!this.pause) this.checkSwitches()
    },

    eventOrientationChange() {
        
    },

    initializeMianDiv() {
        this.mainDiv = document.createElement('div')
        this.mainDiv.id = 'spacetime'
        this.mainDiv.style.position = 'fixed'
        this.mainDiv.style.width = '100vw'
        this.mainDiv.style.height = '100vh'
        this.mainDiv.style.backgroundColor = 'black'
        this.mainDiv.style.top = '0'
        this.mainDiv.style.left = '0'
        this.parentElement.appendChild(this.mainDiv)
    },

    initializeCanvasAlert() {
        const fontSize = Math.round(getScreenSize() / 30)    
        this.canvasAlert = document.createElement('div')
        this.canvasAlert.className = 'alert'
        // this.canvasAlert.style.fontSize = fontSize + 'px'
        this.mainDiv.appendChild(this.canvasAlert)    
},

    initializeCanvasScore() {
        const fontSize = Math.round(getScreenSize() / 40)
        this.canvasScore = document.createElement('div')
        this.canvasScore.className = 'score'
        // this.canvasScore.style.fontSize = fontSize + 'px'
        this.mainDiv.appendChild(this.canvasScore)    
    },

    initializeCanvasHighScore() {
        const fontSize = Math.round(getScreenSize() / 60)
        this.canvasHighScore = document.createElement('div')
        this.canvasHighScore.className = 'high-score'
        // this.canvasHighScore.style.fontSize = fontSize + 'px'
        this.mainDiv.appendChild(this.canvasHighScore)    
    }
}