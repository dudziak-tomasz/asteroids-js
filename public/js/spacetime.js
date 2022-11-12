class Spacetime {
    static createSpacetime(canvas) {             // Big Bang

        this.canvas = canvas

        this.asteroids = []
        this.shards = []
        this.missiles = []
        this.spaceship = undefined
        this.saucer = undefined

        this.intervalTime = 10  //msec - quantum of time (chronon)
        this.intervalId = undefined

        this.oneSecond = 1000 / this.intervalTime
        this.oneSecondCountdown = 0

        this.start()
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
    }

    static createAsteroids(amount = 2, size = 3) {
        for (let i = 0; i < amount; i++) {
            this.addAsteroid(new Asteroid(size))
        }
    }
    
    static addAsteroid(asteroid) {
        this.asteroids.push(asteroid)
        this.canvas.appendChild(asteroid.canvas)
    }

    static removeAsteroid(asteroid) {
        const asteroidIndex = this.asteroids.findIndex((a) => a.id === asteroid.id)
        if (asteroidIndex >= 0) {
            asteroid.canvas.remove()
            this.asteroids.splice(asteroidIndex, 1)
        }

        if (this.asteroids.length === 0) this.sendEvent('noasteroids')
    }

    static removeAllAsteroid() {
        this.asteroids.forEach(asteroid => asteroid.canvas.remove())
        this.asteroids = []
    }

    static addShard(shard) {
        this.shards.push(shard)
        this.canvas.appendChild(shard.canvas)
    }

    static removeShard(shard) {
        const shardIndex = this.shards.findIndex((sh) => sh.id === shard.id)
        if (shardIndex >= 0) {
            shard.canvas.remove()
            this.shards.splice(shardIndex, 1)
        }

        if (this.shards.length === 0) {
            // if (this.asteroids.length === 0) this.sendEvent('noasteroids')   // double lvl bug -> move to removeAsteroid(asteroid)

            if (!this.spaceship) this.sendEvent('spaceshiphit')
        }

    }

    static addMissile(missile) {
        this.missiles.push(missile)
        this.canvas.appendChild(missile.canvas)
    }

    static removeMissile(missile) {
        const missileIndex = this.missiles.findIndex((m) => m.id === missile.id)
        if (missileIndex >= 0) {
            missile.canvas.remove()
            this.missiles.splice(missileIndex, 1)
        }
    }

    static start() {
        if (this.intervalId) {
            return
        }
        this.intervalId = setInterval(() => {
            this.move()
        }, this.intervalTime)
    }

    static stop() {
        if (!this.intervalId) {
            return
        }
        clearInterval(this.intervalId)
        this.intervalId = undefined
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