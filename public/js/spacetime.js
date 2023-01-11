import { Spaceship } from './spaceship.js'
import { Saucer } from './saucer.js'
import { Asteroid } from './asteroid.js'

export class Spacetime {
    static createSpacetime(canvas) {

        this.canvas = canvas

        this.asteroids = new Map()
        this.shards = new Map()
        this.missiles = new Map()
        this.spaceship = undefined
        this.saucer = undefined

        this.intervalTime = 10 
        this.intervalId = undefined

        this.oneSecond = 1000 / this.intervalTime
        this.oneSecondCountdown = 0

        this.audioVolume = 0.9
        this.getAudioVolume()

        this.start()
    }

    static getAudioVolume() {
        const volume = localStorage.getItem('soundVolume')
        volume ? this.audioVolume = parseFloat(volume) : this.setAudioVolume()
        return this.audioVolume
    }

    static setAudioVolume(volume) {
        if (volume !== undefined) this.audioVolume = volume
        localStorage.setItem('soundVolume', this.audioVolume)

        this.asteroids.forEach(asteroid => asteroid.setAudioVolume())
        if (this.spaceship) this.spaceship.setAudioVolume()
        if (this.saucer) this.saucer.setAudioVolume()
    }

    static createSpaceship() {
        this.spaceship = new Spaceship()
        this.canvas.appendChild(this.spaceship.canvas)
    }

    static removeSpaceship() {
        this.spaceship.canvas.remove()
        this.spaceship = undefined
    }

    static createSaucer(size) {
        this.saucer = new Saucer(size)
        this.canvas.appendChild(this.saucer.canvas)
    }

    static removeSaucer() {
        this.saucer.canvas.remove()
        this.saucer = undefined

        if (this.asteroids.size === 0 && this.shards.size === 0) this.sendEvent('noasteroids')
    }

    static createAsteroids(amount = 2, size = 3) {
        for (let i = 0; i < amount; i++) {
            this.addAsteroid(new Asteroid(size))
        }
    }
    
    static addAsteroid(asteroid) {
        this.asteroids.set(asteroid.id, asteroid)
        this.canvas.appendChild(asteroid.canvas)
    }

    static removeAsteroid(asteroid) {
        asteroid.canvas.remove()
        this.asteroids.delete(asteroid.id)
    }

    static removeAllAsteroid() {
        this.asteroids.forEach(asteroid => this.removeAsteroid(asteroid))
    }

    static addShard(shard) {
        this.shards.set(shard.id, shard)
        this.canvas.appendChild(shard.canvas)
    }

    static removeShard(shard) {
        shard.canvas.remove()
        this.shards.delete(shard.id)

        if (this.shards.size === 0) {
            if (!this.spaceship) this.sendEvent('spaceshiphit')

            if (this.asteroids.size === 0 && !this.saucer) this.sendEvent('noasteroids')
        }

    }

    static addMissile(missile) {
        this.missiles.set(missile.id, missile)
        this.canvas.appendChild(missile.canvas)
    }

    static removeMissile(missile) {
        missile.canvas.remove()
        this.missiles.delete(missile.id)
    }

    static start() {
        if (this.intervalId) return

        this.intervalId = setInterval(() => {
            this.move()
        }, this.intervalTime)

        if (this.saucer) this.saucer.play()
    }

    static stop() {
        if (!this.intervalId) return

        clearInterval(this.intervalId)
        this.intervalId = undefined

        if (this.spaceship) {
            this.spaceship.stopAccelerate()
            this.spaceship.stopFire()
            this.spaceship.stopRotation()    
        }

        if (this.saucer) this.saucer.stopPlay()
    }

    static sendEvent(eventText, eventDetail = {}) {
        this.canvas.dispatchEvent(new CustomEvent(eventText, {detail: eventDetail}))
    }

    static move() {

        this.oneSecondCountdown++
        if (this.oneSecondCountdown > this.oneSecond) {
            this.oneSecondCountdown = 0
            this.sendEvent('onesecond')
        }

        if (this.spaceship) this.spaceship.move()

        if (this.saucer) this.saucer.move()

        if (this.spaceship && this.saucer && this.spaceship.isHitBy(this.saucer)) {
            this.sendEvent('saucerhit', {size: this.saucer.size})
            this.saucer.hit()
            this.spaceship.hit()
        }

        this.missiles.forEach(missile => {
            missile.move()

            if (missile.id.startsWith('alien-')) {
                if (this.spaceship && this.spaceship.isHitByMissile(missile)) {
                    this.spaceship.hit()
                    this.removeMissile(missile)
                }
            } else {
                if (this.saucer && this.saucer.isHitByMissile(missile)) {

                    this.sendEvent('saucerhit', {size: this.saucer.size})
    
                    this.saucer.hit()
                    this.removeMissile(missile)
                }    
            }
        })

        this.asteroids.forEach(asteroid => {
            let isAsteroidHit = false

            asteroid.move()

            this.missiles.forEach(missile => {
                if (asteroid.isHitByMissile(missile)) {
                    isAsteroidHit = true

                    if (!missile.id.startsWith('alien-')) this.sendEvent('asteroidhit', {size: asteroid.size})

                    asteroid.hit()
                    this.removeMissile(missile)
                }                
            })

            if (this.saucer && !isAsteroidHit && this.saucer.isHitBy(asteroid)) {             
                this.saucer.hit()
                asteroid.hit()
            }

            if (this.spaceship && !isAsteroidHit && this.spaceship.isHitBy(asteroid)) {
                this.sendEvent('asteroidhit', {size: asteroid.size})

                this.spaceship.hit()
                asteroid.hit()
            }
        })

        this.shards.forEach(shard => shard.move())

    }

    static getWidth() {
        return this.canvas.offsetWidth
    }

    static getHeight() {
        return this.canvas.offsetHeight
    }

    static getSize() {
        return this.getHeight() < this.getWidth() ? this.getHeight() : this.getWidth()
    }

}