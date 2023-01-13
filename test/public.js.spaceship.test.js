import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Spaceship } from '../public/js/spaceship.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new spaceship and assign default data', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    assert.deepEqual(ship.id.slice(0,9), 'spaceship')
    assert.deepEqual(ship.width, 27)
    assert.deepEqual(ship.height, 34)
    assert.deepEqual(ship.amounOfPieces, 8)
    assert.deepEqual(ship.intervalTimeAccelerate, 100)
    assert.deepEqual(ship.intervalIdAccelerate, undefined)
    assert.deepEqual(ship.maxAccelerate, 0.5)
    assert.deepEqual(ship.maxRotation, 3)
    assert.deepEqual(ship.maxNumberOfMissiles, 5)
    assert.deepEqual(ship.numberOfMissiles, 0)
    assert.deepEqual(ship.intervalTimeFire, 100)
    assert.deepEqual(ship.intervalIdFire, undefined)
    assert.deepEqual(ship.hyperspace, 0)
    assert.deepEqual(ship.maxHyperspaceTime, 100)
    assert.deepEqual(ship.left, 946.5)
    assert.deepEqual(ship.top, 523)
    assert.deepEqual(ship.canvas.id, ship.id)
    assert.deepEqual(ship.canvas.style.width, '27px')
    assert.deepEqual(ship.canvas.style.height, '34px')

    assert.deepEqual(ship.polygon.getAttributeNS(undefined, 'points'), ship.points.toString())
    
    assert.deepEqual(ship.polygonEngine.constructor.name, 'SVGElement')
    assert.deepEqual(ship.polygonEngine.getAttributeNS(undefined, 'points'), ship.pointsEngine.toString())
    assert.deepEqual(ship.polygonEngine.getAttributeNS(undefined, 'fill'), 'none')
    assert.deepEqual(ship.polygonEngine.getAttributeNS(undefined, 'stroke'), 'white')
    assert.deepEqual(ship.polygonEngine.getAttributeNS(undefined, 'stroke-width'), '2')
    const $polygons = ship.canvas.querySelectorAll('polygon')
    assert.deepEqual($polygons[1], ship.polygonEngine)

    assert.deepEqual(ship.audioEngine.src, '/audio/thrust.mp3')
    assert.deepEqual(ship.audioEngine.loop, true)
    assert.deepEqual(ship.audioEngine.volume, 0.9)
    assert.deepEqual(ship.audioBang.src, '/audio/bang_ship.mp3')
    assert.deepEqual(ship.audioBang.volume, 0.9)
})


test('Should create new spaceship and assign given data', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship({ size: 0.6, position: 'static', color: 'gray' })
    assert.deepEqual(ship.width, 16.2)
    assert.deepEqual(ship.height, 20.4)
    assert.deepEqual(ship.canvas.style.position, 'static')
    assert.deepEqual(ship.polygon.getAttributeNS(undefined, 'stroke'), 'gray')
    assert.deepEqual(ship.canvas.style.width, '16.2px')
    assert.deepEqual(ship.canvas.style.height, '20.4px')
})


test('Should show and hide engine fire', () => {
    const ship = new Spaceship()
    ship.intervalIdAccelerate = 'mock id'
    ship.draw()
    assert.deepEqual(ship.polygonEngine.getAttributeNS(undefined, 'display'), 'block')
    ship.intervalIdAccelerate = undefined
    ship.draw()
    assert.deepEqual(ship.polygonEngine.getAttributeNS(undefined, 'display'), 'none')
})


test('Should be hidden in hyperspace', () => {
    const ship = new Spaceship()
    ship.hyperspace = 1
    ship.draw()
    assert.deepEqual(ship.canvas.style.opacity, '0')
})


test('Sholud get random position in central rectangle before exit hyperspace', () => {
    const ship = new Spaceship()
    ship.hyperspace = ship.maxHyperspaceTime - 1
    ship.draw()
    assert.deepEqual(240 <= ship.left && ship.left < 1680, true)
    assert.deepEqual(135 <= ship.top && ship.top < 945, true)
})


test('Should become visible after exit hyperspace', () => {
    const ship = new Spaceship()
    ship.hyperspace = 1
    ship.draw()
    assert.deepEqual(ship.canvas.style.opacity, '0')
    ship.hyperspace = ship.maxHyperspaceTime
    ship.draw()
    assert.deepEqual(ship.canvas.style.opacity, '1')
})


test('Should get points with saucer shape', () => {
    const ship = new Spaceship()
    ship.points = undefined
    ship.getPoints()
    assert.deepEqual(ship.points, [14, 0, 27, 34, 14, 26, 0, 34])
})


test('Should get points with engine fire shape', () => {
    const ship = new Spaceship()
    ship.pointsEngine = undefined
    ship.getPoints()
    assert.deepEqual(ship.pointsEngine, [14, 34, 10, 29, 14, 26, 17, 29])
})


test('Should set audio volume from Spacetime', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.audioEngine.volume = 0
    ship.audioBang.volume = 0
    ship.setAudioVolume()
    assert.deepEqual(ship.audioEngine.volume, 0.9)
    assert.deepEqual(ship.audioBang.volume, 0.9)
})


test('Should rotate clockwise', () => {
    const ship = new Spaceship()
    ship.angle = 90
    ship.startRotation('right')
    assert.deepEqual(ship.rotation, 3)
    ship.move()
    assert.deepEqual(ship.angle, 93)
})


test('Should rotate counter-clockwise', () => {
    const ship = new Spaceship()
    ship.angle = 90
    ship.startRotation('left')
    assert.deepEqual(ship.rotation, -3)
    ship.move()
    assert.deepEqual(ship.angle, 87)
})


test('Should stop rotate', () => {
    const ship = new Spaceship()
    ship.startRotation('right')
    assert.deepEqual(ship.rotation, 3)
    ship.stopRotation()
    assert.deepEqual(ship.rotation, 0)
})


test('Should accelerate', () => {
    const ship = new Spaceship()
    ship.speedX = 0
    ship.speedY = 0
    ship.angle = 45
    ship.accelerate()
    assert.notDeepEqual(ship.speedX, 0)
    assert.notDeepEqual(ship.speedX, 0)
})


test('Should start and stop accelerate', () => {
    const ship = new Spaceship()
    ship.startAccelerate()
    assert.notDeepEqual(ship.intervalIdAccelerate, undefined)
    ship.stopAccelerate()
    assert.deepEqual(ship.intervalIdAccelerate, undefined)
})


test('Should play engine sound when accelerate', () => {
    const ship = new Spaceship()
    ship.startAccelerate()
    assert.deepEqual(ship.audioEngine.isPlaying, true)
    ship.stopAccelerate()
})


test('Should not play engine sound when accelerate', () => {
    const ship = new Spaceship()
    ship.startAccelerate()
    ship.stopAccelerate()
    assert.deepEqual(ship.audioEngine.isPlaying, false)
})


test('Should start and stop fire', () => {
    const ship = new Spaceship()
    ship.startFire()
    assert.notDeepEqual(ship.intervalIdFire, undefined)
    ship.stopFire()
    assert.deepEqual(ship.intervalIdFire, undefined)
})


test('Should fire missile', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.fire()
    assert.deepEqual(Spacetime.missiles.size, 1)
})


test('Should not fire missile if numberOfMissiles >= 5', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.numberOfMissiles = 5
    ship.fire()
    assert.deepEqual(Spacetime.missiles.size, 0)
})


test('Should not fire missile if is in hyperspace', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.startHyperspace()
    ship.fire()
    assert.deepEqual(Spacetime.missiles.size, 0)
})


test('Should fire missile at 30 deg angle', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.angle = 30
    ship.fire()
    const missile = [...Spacetime.missiles.values()][0]
    assert.deepEqual(Math.round(100 * missile.speedX * Math.sqrt(3)), Math.round(100 * -missile.speedY))
})


test('Should fire missile at 45 deg angle', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.angle = 45
    ship.fire()
    const missile = [...Spacetime.missiles.values()][0]
    assert.deepEqual(Math.round(100 * missile.speedX), Math.round(100 * -missile.speedY))
})


test('Should fire missile at 60 deg angle', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.angle = 60
    ship.fire()
    const missile = [...Spacetime.missiles.values()][0]
    assert.deepEqual(Math.round(100 * missile.speedX), Math.round(100 * -missile.speedY * Math.sqrt(3)))
})


test('Should fire missile at 135 deg angle', () => {
    Spacetime.createSpacetime(document.body)
    const ship = new Spaceship()
    ship.angle = 135
    ship.fire()
    const missile = [...Spacetime.missiles.values()][0]
    assert.deepEqual(Math.round(100 * missile.speedX), Math.round(100 * missile.speedY))
})


test('Should be hit if is not in hyperspace', () => {
    const ship = new Spaceship()
    const isHit = ship.isHitBy({left: 0, top: 0, width: 1920, height: 1080})
    assert.deepEqual(isHit, true)
})


test('Should not be hit if is in hyperspace', () => {
    const ship = new Spaceship()
    ship.startHyperspace()
    const isHit = ship.isHitBy({left: 0, top: 0, width: 1920, height: 1080})
    assert.deepEqual(isHit, false)
})


test('Should create 8 pieceOfSpaceship after hit', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    Spacetime.spaceship.hit()
    assert.deepEqual(Spacetime.shards.size, 8)
    Spacetime.shards.forEach(shard => assert.deepEqual(shard.constructor.name, 'PieceOfSpaceship'))
})


test('Should play audio after hit', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const ship = new Spaceship()
    ship.hit()
    assert.deepEqual(ship.audioBang.isPlaying, true)
})


test('Should be destroyed after hit', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    Spacetime.spaceship.hit()
    assert.deepEqual(Spacetime.spaceship, undefined)
})


test('Should stop fire after destroy', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const ship = new Spaceship()
    ship.startFire()
    ship.destroy()
    assert.deepEqual(ship.intervalIdFire, undefined)
})


test('Should stop accelerate after destroy', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const ship = new Spaceship()
    ship.startAccelerate()
    ship.destroy()
    assert.deepEqual(ship.intervalIdAccelerate, undefined)
})


