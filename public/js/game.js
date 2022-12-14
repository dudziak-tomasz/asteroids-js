import { Spacetime } from './spacetime.js'
import { Spaceship } from './spaceship.js'
import { api } from './api.js'
import { chat } from './chat.js'

export const game = {
    parentElement: undefined,
    mainDiv: undefined,
    canvasAlert: undefined,
    canvasScore: undefined,
    canvasHighScore: undefined,
    canvasLeaderboard: undefined,
    leaderboard: undefined,
    level: 0,
    score: 0,
    highScore: 0,
    seconds: 0,
    highScoreAchieved: false,
    scoreForAsteroids: [0, 100, 50, 20],
    scoreForSaucers: [0, 1000, 200],
    scoreForNewLife: 10000,  // 10000
    lives: [],
    numberOfLives: 3,
    pause: false,
    rotation: [],
    accelerate: false,
    fire: [],
    hyperspace: [],
    timeBetweenLevels: 3000,
    timeBlikScore: 1000,
    timeBetweenSaucers: 15, // 15 sec
    probabilityMinCreateSaucer: 0.3,
    probabilityCreateSaucer: 0.3,
    typeOfSaucer: [2000, 10000, 40000],   // 0 - no saucer - 2000 - large saucer - 10000 - random saucer - 40000 - small saucer
    startingLevel: false,
    pressFireTo: '',
    isTouch: false,
    audio: undefined,
    audioTrack: 'background2.mp3',
    audioVolume: 0.3,
    openBoxes: 0,

    createGame(parentElement) {
        this.parentElement = parentElement

        this.initializeMainDiv()

        this.initializeCanvasAlert()
        this.initializeCanvasScore()
        this.initializeCanvasHighScore()
        this.initializeCanvasLeaderboard()

        this.refreshScore()

        this.getHighScore()
        this.refreshHighScore()

        this.initializeEvents()
        this.initializeCustomEvents()

        Spacetime.createSpacetime(this.mainDiv)

        Spacetime.createAsteroids(2,3)
        Spacetime.createAsteroids(2,2)
        Spacetime.createAsteroids(3,1)

        this.audio = new Audio()
        this.audio.loop = true
        this.getAudioTrack()
        this.getAudioVolume()

        this.initializeGame()
    },

    getAudioTrack() {
        const track = localStorage.getItem('audioTrack')
        track ? this.audioTrack = track : this.setAudioTrack()
        this.audio.src = `/audio/${this.audioTrack}`
        return this.audioTrack
    },

    setAudioTrack(track) {
        if (track !== undefined) this.audioTrack = track
        localStorage.setItem('audioTrack', this.audioTrack)
        this.audio.src = `/audio/${this.audioTrack}`
    },

    getAudioVolume() {
        const volume = localStorage.getItem('musicVolume')
        volume ? this.audioVolume = parseFloat(volume) : this.setAudioVolume()
        this.audio.volume = this.audioVolume
        return this.audioVolume
    },

    setAudioVolume(volume) {
        if (volume !== undefined) this.audioVolume = volume
        localStorage.setItem('musicVolume', this.audioVolume)
        this.audio.volume = this.audioVolume
    },

    playAudio() {
        if (this.audioVolume === 0) return
        this.audio.play()
    },

    stopAudio() {
        this.audio.pause()
    },

    async showLeaderboard() {
        this.leaderboard = await api.getLeaderboard()

        if (this.leaderboard) {
            if (this.pressFireTo === 'startgame' || this.pressFireTo === 'initializegame') {
                let innerHTML = '<table class="leaderboard-table">'

                this.leaderboard.forEach((leader) => {
                    innerHTML += `<tr><td class="leader-score box-light-gray">${leader.highscore}</td><td class="leader-name">${leader.username.toUpperCase()}</td></tr>`
                })
    
                innerHTML += '</table>'
                this.canvasLeaderboard.innerHTML = innerHTML
                this.canvasLeaderboard.className = 'leaderboard'    
            }
        }    
    },

    hideLeaderBoard() {
        this.canvasLeaderboard.className = 'leaderboard-hidden'
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
                if (this.openBoxes === 0) this.startSpaceship()
                break
        }
    },

    initializeGame() {
        this.pressFireTo = 'startgame'
        this.showAlert('PRESS FIRE TO START GAME')
        this.showLeaderboard()
    },

    startGame() {
        this.pressFireTo = ''
        this.hideAlert()
        this.hideLeaderBoard()

        this.level = 0
        this.score = 0
        this.seconds = 0
        this.probabilityCreateSaucer = this.probabilityMinCreateSaucer

        this.initializeLives()
        this.refreshScore()

        this.highScoreAchieved = false
        this.getHighScore()
        this.refreshHighScore()

        this.playAudio()

        Spacetime.removeAllAsteroid()

        this.startLevel()

        chat.loginChatServer()
        chat.updateScore(0)
    },

    startLevel() {
        if (this.lives.length === 0 && !Spacetime.spaceship) return
        this.level++
        this.showAlert(`LEVEL ${this.level}`)    
        this.startingLevel = true
        setTimeout(() => {
            this.hideAlert()
            this.startingLevel = false
            Spacetime.createAsteroids(this.level + 1)
            if (!Spacetime.spaceship) this.newSpaceship()
        }, this.timeBetweenLevels)
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

        if (api.user) api.updateUser()
    },

    initializeEvents() {
        this.parentElement.addEventListener('keydown', (event) => this.eventKeyDown(event))
        this.parentElement.addEventListener('keyup', (event) => this.eventKeyUp(event))
    
        this.mainDiv.addEventListener('mousedown', (event) => this.eventMouseDown(event))
        this.mainDiv.addEventListener('mouseup', (event) => this.eventMouseUp(event))

        this.mainDiv.addEventListener('touchstart', (event) => this.eventTouchStart(event))
        this.mainDiv.addEventListener('touchmove', (event) => this.eventTouchMove(event))
        this.mainDiv.addEventListener('touchend', (event) => this.eventTouchEnd(event))
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

        this.mainDiv.addEventListener('boxopen', () => {
            this.openBoxes++
            if (!game.pause && Spacetime.spaceship) this.switchPause()
        })

        this.mainDiv.addEventListener('boxclose', () => {
            this.openBoxes--
            if (this.openBoxes === 0 && game.pause) this.switchPause()
        })

        this.mainDiv.addEventListener('login', () => {
            this.getHighScore()
            this.refreshHighScore()
        })

        this.mainDiv.addEventListener('logout', () => {
            this.getHighScore()
            this.refreshHighScore()
        })

        this.mainDiv.addEventListener('username', () => {
            this.getHighScore()
            this.refreshHighScore()
            if (this.pressFireTo === 'startgame') this.showLeaderboard()
        })

    },

    generateSaucer() {
        if (!Spacetime.spaceship || Spacetime.saucer || this.pause || this.startingLevel || this.score < this.typeOfSaucer[0]) return

        if (this.score < this.typeOfSaucer[1]) this.createSaucer(2)
        else if (this.score < this.typeOfSaucer[2]) Math.random() < 0.5 ? this.createSaucer(1) : this.createSaucer(2)
        else this.createSaucer(1)
    },

    createSaucer(size) {
        if (Math.random() < this.probabilityCreateSaucer) Spacetime.createSaucer(size)
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
            chat.updateScore(newScore)
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
        const color = getComputedStyle(this.canvasScore).getPropertyValue('--gray') || 'white'
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
        this.canvasHighScore.innerHTML = `${this.highScore} ${api.user ? api.user.username.toUpperCase() : ''}`
    },

    getHighScore() {
        if (api.user) {
            this.highScore = api.user.highscore
        } else {
            const hs = localStorage.getItem('highScore')
            if (hs) this.highScore = parseInt(hs)
            else this.setHighScore()    
        }
    },

    setHighScore() {
        if (api.user) {
            api.user.highscore = this.highScore
        } else {
            localStorage.setItem('highScore', this.highScore)
        }
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
            if (this.openBoxes === 0) {
                Spacetime.start()
                this.playAudio()
    
                this.checkSwitches()    
                game.pause = !game.pause
            }
        } else {
            Spacetime.stop()
            this.stopAudio()
            game.pause = !game.pause
        }
    },

    checkSwitches() {

        if (this.openBoxes !== 0) return
        
        if (!Spacetime.spaceship) {            
            if (this.fire.length > 0) this.pressFireNoSpaceship()
            return
        }

        this.hyperspace.length > 0 ? Spacetime.spaceship.startHyperspace() : 0
        this.fire.length > 0 ? Spacetime.spaceship.startFire() : Spacetime.spaceship.stopFire()
        this.rotation.length > 0 ? Spacetime.spaceship.startRotation(this.rotation[0]) : Spacetime.spaceship.stopRotation()
        this.accelerate ? Spacetime.spaceship.startAccelerate() : Spacetime.spaceship.stopAccelerate()

    },

    eventKeyDown(event) {

        switch(event.code) {
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

        if (!this.pause) this.checkSwitches()
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
        
        if (!this.pause) this.checkSwitches()
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

        if (!this.fire.includes('touch')) this.fire.unshift('touch')

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

        if (newRotation === 'left' && !this.rotation.includes('left')) this.rotation.unshift('left')
        if (newRotation === 'right' && !this.rotation.includes('right')) this.rotation.unshift('right')

        this.accelerate = newAcclerate

        if (newHyperspace && !this.hyperspace.includes('touch')) {
            this.hyperspace.unshift('touch')
            this.rotation = []
        } 

        if (!this.pause) this.checkSwitches()
    },

    eventTouchEnd() {

        this.accelerate = false
        this.fire = []
        this.hyperspace = []

        if (!this.pause) this.checkSwitches()
    },

    initializeMainDiv() {
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
        this.canvasAlert = document.createElement('div')
        this.canvasAlert.className = 'alert'
        this.mainDiv.appendChild(this.canvasAlert)    
    },

    initializeCanvasLeaderboard() {
        this.canvasLeaderboard = document.createElement('div')
        this.canvasLeaderboard.className = 'leaderboard-hidden'
        this.mainDiv.appendChild(this.canvasLeaderboard)    
    },

    initializeCanvasScore() {
        this.canvasScore = document.createElement('div')
        this.canvasScore.className = 'score'
        this.mainDiv.appendChild(this.canvasScore)    
    },

    initializeCanvasHighScore() {
        this.canvasHighScore = document.createElement('div')
        this.canvasHighScore.className = 'high-score'
        this.mainDiv.appendChild(this.canvasHighScore)    
    }
}