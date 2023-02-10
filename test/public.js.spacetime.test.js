import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Asteroid } from '../public/js/asteroid.js'
import { Shard } from '../public/js/shard.js'
import { Missile } from '../public/js/missile.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

// Prepare mocks
const canvas = document.createElement('div')
canvas.id = 'spacetime'
canvas.style.position = 'fixed'
canvas.style.width = '100vw'
canvas.style.height = '100vh'
canvas.style.backgroundColor = 'black'
canvas.style.top = '0'
canvas.style.left = '0'
document.body.appendChild(canvas)


test('Should create Spacetime and assign data', () => {
    Spacetime.createSpacetime(canvas)
    assert.deepEqual(Spacetime.canvas, canvas)
    assert.deepEqual(Spacetime.asteroids.constructor.name, 'Map')
    assert.deepEqual(Spacetime.shards.constructor.name, 'Map')
    assert.deepEqual(Spacetime.missiles.constructor.name, 'Map')
    assert.deepEqual(Spacetime.spaceship, undefined)
    assert.deepEqual(Spacetime.saucer, undefined)
    assert.deepEqual(Spacetime.intervalTime, 10)
    assert.deepEqual(Spacetime.intervalId, undefined)
    assert.deepEqual(Spacetime.oneSecond, 100)
    assert.deepEqual(Spacetime.oneSecondCountdown, 0)
    assert.deepEqual(Spacetime.audioVolume, 0.9)
})


test('Should set audio volume in localStorage and in this.audioVolume', () => {
    Spacetime.createSpacetime(canvas)
    Spacetime.setAudioVolume(0.3)
    const vol = localStorage.getItem('soundVolume')
    assert.deepEqual(vol, 0.3)
    assert.deepEqual(Spacetime.audioVolume, 0.3)
})


test('Should get audio volume from localStorage', () => {
    Spacetime.createSpacetime(canvas)
    localStorage.setItem('soundVolume', '0.5')
    const vol = Spacetime.getAudioVolume()
    assert.deepEqual(vol, 0.5)
    assert.deepEqual(Spacetime.audioVolume, 0.5)
})


test('Should create spaceship and append to document', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    assert.deepEqual(Spacetime.spaceship, undefined)
    Spacetime.createSpaceship()
    assert.notDeepEqual(Spacetime.spaceship, undefined)
    const $spaceship = document.getElementById(Spacetime.spaceship.id)
    assert.deepEqual($spaceship, Spacetime.spaceship.canvas)
})


test('Should remove spaceship', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSpaceship()
    const spaceshipId = Spacetime.spaceship.id
    Spacetime.removeSpaceship()
    assert.deepEqual(Spacetime.spaceship, undefined)
    const $spaceship = document.getElementById(spaceshipId)
    assert.deepEqual($spaceship, null)
})


test('Should create saucer and append to document', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    assert.deepEqual(Spacetime.saucer, undefined)
    Spacetime.createSaucer()
    assert.notDeepEqual(Spacetime.saucer, undefined)
    const $saucer = document.getElementById(Spacetime.saucer.id)
    assert.deepEqual($saucer, Spacetime.saucer.canvas)
})


test('Should remove saucer', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSaucer()
    const saucerId = Spacetime.saucer.id
    Spacetime.removeSaucer()
    assert.deepEqual(Spacetime.saucer, undefined)
    const $saucer = document.getElementById(saucerId)
    assert.deepEqual($saucer, null)
})


test('Should add asteroid and append to document', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    assert.deepEqual(Spacetime.asteroids.size, 0, 'Should be empty Map')
    const asteroid = new Asteroid()
    Spacetime.addAsteroid(asteroid)
    assert.deepEqual(Spacetime.asteroids.size, 1)
    assert.deepEqual(Spacetime.asteroids.get(asteroid.id), asteroid)
    const $asteroid = document.getElementById(asteroid.id)
    assert.deepEqual($asteroid, asteroid.canvas)
})


test('Should remove asteroid', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.addAsteroid(new Asteroid())
    const asteroid = [...Spacetime.asteroids.values()][0]
    Spacetime.removeAsteroid(asteroid)
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const $asteroid = document.getElementById(asteroid.id)
    assert.deepEqual($asteroid, null)
})


test('Should create 10 asteroids', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createAsteroids(10)
    assert.deepEqual(Spacetime.asteroids.size, 10)
    const asteroids = document.querySelectorAll('[id^="asteroid"]')
    assert.deepEqual(asteroids.length, 10)
})


test('Should remove all asteroids', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createAsteroids(10)
    Spacetime.restart()
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const asteroids = document.querySelectorAll('[id^="asteroid"]')
    assert.deepEqual(asteroids.length, 0)
})


test('Should add shard and append to document', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    assert.deepEqual(Spacetime.shards.size, 0, 'Should be empty Map')
    const shard = new Shard()
    Spacetime.addShard(shard)
    assert.deepEqual(Spacetime.shards.size, 1)
    assert.deepEqual([...Spacetime.shards.values()][0], shard)
    const $shard = document.getElementById(shard.id)
    assert.deepEqual($shard, shard.canvas)
})


test('Should remove shard', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.addShard(new Shard())
    const shard = [...Spacetime.shards.values()][0]
    Spacetime.removeShard(shard)
    assert.deepEqual(Spacetime.shards.size, 0, 'Should be empty Map')
    const $shard = document.getElementById(shard.id)
    assert.deepEqual($shard, null)
})


test('Should add missile and append to document', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    assert.deepEqual(Spacetime.missiles.size, 0, 'Should be empty Map')
    const missile = new Missile()
    Spacetime.addMissile(missile)
    assert.deepEqual(Spacetime.missiles.size, 1)
    assert.deepEqual([...Spacetime.missiles.values()][0], missile)
    const $missile = document.getElementById(missile.id)
    assert.deepEqual($missile, missile.canvas)
})


test('Should remove missile', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.addMissile(new Missile())
    const missile = [...Spacetime.missiles.values()][0]
    Spacetime.removeMissile(missile)
    assert.deepEqual(Spacetime.missiles.size, 0, 'Should be empty Map')
    const $missile = document.getElementById(missile.id)
    assert.deepEqual($missile, null)
})


test('Should get canvas size', () => {
    const canvasWidth = Spacetime.getWidth()
    assert.deepEqual(canvasWidth, 1920)
    const canvasHeight = Spacetime.getHeight()
    assert.deepEqual(canvasHeight, 1080)
    const size = Spacetime.getSize()
    assert.deepEqual(size, 1080)
})


test('Should create onsecond event', () => {
    Spacetime.createSpacetime(canvas)

    // Prepare mocks
    let isOneSecond = false
    canvas.addEventListener('onesecond', () => isOneSecond = true)
    Spacetime.oneSecondCountdown = Spacetime.oneSecond

    Spacetime.createOneSecond()
    assert.deepEqual(isOneSecond, true)
})


test('Should move spaceship', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSpaceship()
    Spacetime.spaceship.angle = 45
    Spacetime.spaceship.accelerate()

    const { left, top } = Spacetime.spaceship

    Spacetime.moveSpaceshipSaucerAndCheckSpaceshipIsHitBySaucer()
    assert.notDeepEqual(Spacetime.spaceship.left, left)
    assert.notDeepEqual(Spacetime.spaceship.top, top)
})


test('Should move saucer', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSaucer()

    const { left } = Spacetime.saucer

    Spacetime.moveSpaceshipSaucerAndCheckSpaceshipIsHitBySaucer()
    assert.notDeepEqual(Spacetime.saucer.left, left)
})


test('Should saucer hit spaceship and create saucerhit event', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSpaceship()
    Spacetime.createSaucer()
    Spacetime.saucer.left = Spacetime.spaceship.left
    Spacetime.saucer.top = Spacetime.spaceship.top

    //Prepare mocks
    let isSaucerHit = false
    canvas.addEventListener('saucerhit', () => isSaucerHit = true)

    Spacetime.moveSpaceshipSaucerAndCheckSpaceshipIsHitBySaucer()
    assert.deepEqual(Spacetime.spaceship, undefined)
    assert.deepEqual(Spacetime.saucer, undefined)
    assert.deepEqual(isSaucerHit, true)
})


test('Should move missiles', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    for (let i = 0; i < 10; i++) 
        Spacetime.addMissile(new Missile({ x: 100 * Math.random(), y: 100 * Math.random()}, { angle: 10 + 70 * Math.random() }))
    
    const missilesCopy = new Map()
    Spacetime.missiles.forEach((missile, id) => missilesCopy.set(id, {...missile}))

    Spacetime.moveMissilesAndCheckMissileHit()

    Spacetime.missiles.forEach((missile, id) => {
        assert.notDeepEqual(missile.left, missilesCopy.get(id).left)
        assert.notDeepEqual(missile.top, missilesCopy.get(id).top)
    })
})


test('Should missile hit saucer', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSaucer()
    Spacetime.saucer.top = 100
    Spacetime.saucer.left = 100
    Spacetime.saucer.speedX = 0
    Spacetime.addMissile(new Missile({ x: 102, y: 108}, { angle: 0}))

    Spacetime.moveMissilesAndCheckMissileHit()
    assert.deepEqual(Spacetime.saucer, undefined)
    assert.deepEqual(Spacetime.missiles.size, 0)
})


test('Should hit spaceship', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSpaceship()
    Spacetime.spaceship.top = 100
    Spacetime.spaceship.left = 100
    Spacetime.addMissile(new Missile({ x: 102, y: 108}, { angle: 0}, { idPrefix: 'alien' }))

    Spacetime.moveMissilesAndCheckMissileHit()
    assert.deepEqual(Spacetime.spaceship, undefined)
    assert.deepEqual(Spacetime.missiles.size, 0)
})


test('Should not hit spaceship - non-alien missile', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSpaceship()
    Spacetime.spaceship.top = 100
    Spacetime.spaceship.left = 100
    Spacetime.addMissile(new Missile({ x: 102, y: 108}, { angle: 0}))

    Spacetime.moveMissilesAndCheckMissileHit()
    assert.notDeepEqual(Spacetime.spaceship, undefined)
    assert.deepEqual(Spacetime.missiles.size, 1)
})


test('Should move asteroids', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    for (let i = 0; i < 10; i++) Spacetime.addAsteroid(new Asteroid())

    const asteroidsCopy = new Map()
    Spacetime.asteroids.forEach((asteroid, id) => asteroidsCopy.set(id, {...asteroid}))

    Spacetime.moveAsteroidsAndCheckAsteroidHit()

    Spacetime.asteroids.forEach((asteroid, id) => {
        assert.notDeepEqual(asteroid.left, asteroidsCopy.get(id).left)
        assert.notDeepEqual(asteroid.top, asteroidsCopy.get(id).top)
    })
})


test('Should hit asteroid and create asteroidhit event', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    const asteroid = new Asteroid(1)
    Spacetime.addAsteroid(asteroid)
    const missile = new Missile()
    Spacetime.addMissile(missile)

    missile.left = asteroid.left + 1
    missile.top = asteroid.top + 1
    missile.speedX = asteroid.speedX
    missile.speedY = asteroid.speedY

    // Prepare mocks
    let isAsteroidHit = false
    canvas.addEventListener('asteroidhit', () => isAsteroidHit = true)

    Spacetime.moveAsteroidsAndCheckAsteroidHit()

    assert.deepEqual(Spacetime.asteroids.size, 0)
    assert.deepEqual(Spacetime.missiles.size, 0)
    assert.deepEqual(isAsteroidHit, true)
})


test('Should hit asteroid and should not create asteroidhit event - alien missile', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    const asteroid = new Asteroid(1)
    Spacetime.addAsteroid(asteroid)
    const missile = new Missile({}, {}, { idPrefix: 'alien' })
    Spacetime.addMissile(missile)

    missile.left = asteroid.left + 1
    missile.top = asteroid.top + 1
    missile.speedX = asteroid.speedX
    missile.speedY = asteroid.speedY

    // Prepare mocks
    let isAsteroidHit = false
    canvas.addEventListener('asteroidhit', () => isAsteroidHit = true)

    Spacetime.moveAsteroidsAndCheckAsteroidHit()

    assert.deepEqual(Spacetime.asteroids.size, 0)
    assert.deepEqual(Spacetime.missiles.size, 0)
    assert.deepEqual(isAsteroidHit, false)
})


test('Should hit saucer', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    const asteroid = new Asteroid(1)
    Spacetime.addAsteroid(asteroid)
    Spacetime.createSaucer()

    Spacetime.saucer.left = asteroid.left
    Spacetime.saucer.top = asteroid.top
    Spacetime.saucer.speedX = asteroid.speedX
    Spacetime.saucer.speedY = asteroid.speedY

    Spacetime.moveAsteroidsAndCheckAsteroidHit()

    assert.deepEqual(Spacetime.asteroids.size, 0)
    assert.deepEqual(Spacetime.saucer, undefined)
})


test('Should hit spaceship and create asteroidhit event', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    const asteroid = new Asteroid(1)
    Spacetime.addAsteroid(asteroid)
    Spacetime.createSpaceship()

    Spacetime.spaceship.left = asteroid.left
    Spacetime.spaceship.top = asteroid.top
    Spacetime.spaceship.speedX = asteroid.speedX
    Spacetime.spaceship.speedY = asteroid.speedY

    // Prepare mocks
    let isAsteroidHit = false
    canvas.addEventListener('asteroidhit', () => isAsteroidHit = true)

    Spacetime.moveAsteroidsAndCheckAsteroidHit()

    assert.deepEqual(Spacetime.asteroids.size, 0)
    assert.deepEqual(Spacetime.spaceship, undefined)
    assert.deepEqual(isAsteroidHit, true)
})


test('Should move shards', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    for (let i = 0; i < 10; i++) 
        Spacetime.addShard(new Shard({ left: 100 * Math.random(), top: 100 * Math.random()}))
    
    const shardsCopy = new Map()
    Spacetime.shards.forEach((shard, id) => shardsCopy.set(id, {...shard}))

    Spacetime.moveShards()

    Spacetime.shards.forEach((shard, id) => {
        assert.notDeepEqual(shard.left, shardsCopy.get(id).left)
        assert.notDeepEqual(shard.top, shardsCopy.get(id).top)
    })
})


test('Should start/stop Spacetime', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.startMock()
    assert.ok(Spacetime.intervalId)
    Spacetime.stop()
    assert.deepEqual(Spacetime.intervalId, undefined)
})


test('Should play/pause saucer audio after start/stop Spacetime', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSaucer()
    Spacetime.saucer.audioFlying.pause()
    assert.deepEqual(Spacetime.saucer.audioFlying.isPlaying, false)
    Spacetime.startMock()
    assert.deepEqual(Spacetime.saucer.audioFlying.isPlaying, true)
    Spacetime.stop()
    assert.deepEqual(Spacetime.saucer.audioFlying.isPlaying, false)
})


test('Should stop spaceship accelerate/fire/rotation after stop Spacetime', () => {
    canvas.innerHTML = ''
    Spacetime.createSpacetime(canvas)
    Spacetime.createSpaceship()

    Spacetime.startMock()

    Spacetime.spaceship.startAccelerate()
    Spacetime.spaceship.startFire()
    Spacetime.spaceship.startRotation('left')

    Spacetime.stop()

    assert.deepEqual(Spacetime.spaceship.intervalIdAccelerate, undefined)
    assert.deepEqual(Spacetime.spaceship.intervalIdFire, undefined)
    assert.deepEqual(Spacetime.spaceship.rotation, 0)
})