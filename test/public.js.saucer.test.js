import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Saucer } from '../public/js/saucer.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new saucer and assign data for size = 2', () => {
    Spacetime.createSpacetime(document.body)
    const saucer = new Saucer()
    assert.deepEqual(saucer.id.slice(0,6), 'saucer')
    assert.deepEqual(saucer.maxSizeSmall, 27)
    assert.deepEqual(saucer.amounOfShards, 10)
    assert.deepEqual(saucer.startMargin, 40)
    assert.deepEqual(saucer.size, 2)
    assert.deepEqual(saucer.width, 54)
    assert.deepEqual(saucer.height, 54)
    assert.deepEqual(saucer.counterChangeDirection, 1)
    assert.deepEqual(saucer.counterMaxChangeDirection, 50)
    assert.deepEqual(saucer.counterFire, 1)
    assert.deepEqual(saucer.counterMaxFire, 300)
    assert.deepEqual(saucer.probabilityFireAccurate, 0)
    assert.deepEqual(saucer.maxSpeed, 0.9)
    assert.ok(saucer.speedX === -0.9 || saucer.speedX === 0.9)
    assert.deepEqual(saucer.speedY, 0)
    assert.ok(saucer.left === 0 || saucer.left === 1920 - 54)
    assert.ok(saucer.top === 40 || saucer.top === 1080 - 54 - 40)

    assert.deepEqual(saucer.canvas.id, saucer.id)
    assert.deepEqual(saucer.canvas.style.width, '54px')
    assert.deepEqual(saucer.canvas.style.height, '54px')
    assert.deepEqual(saucer.polygon.getAttributeNS(undefined, 'points'), saucer.points.toString())

    assert.deepEqual(saucer.line1.constructor.name, 'SVGElement')
    assert.deepEqual(saucer.line1.getAttributeNS(undefined, 'x1'), saucer.points[2].toString())
    assert.deepEqual(saucer.line1.getAttributeNS(undefined, 'y1'), saucer.points[3].toString())
    assert.deepEqual(saucer.line1.getAttributeNS(undefined, 'x2'), saucer.points[8].toString())
    assert.deepEqual(saucer.line1.getAttributeNS(undefined, 'y2'), saucer.points[9].toString())
    assert.deepEqual(saucer.line1.getAttributeNS(undefined, 'stroke'), 'white')
    assert.deepEqual(saucer.line1.getAttributeNS(undefined, 'stroke-width'), '2')

    assert.deepEqual(saucer.line2.constructor.name, 'SVGElement')
    assert.deepEqual(saucer.line2.getAttributeNS(undefined, 'x1'), saucer.points[0].toString())
    assert.deepEqual(saucer.line2.getAttributeNS(undefined, 'y1'), saucer.points[1].toString())
    assert.deepEqual(saucer.line2.getAttributeNS(undefined, 'x2'), saucer.points[10].toString())
    assert.deepEqual(saucer.line2.getAttributeNS(undefined, 'y2'), saucer.points[11].toString())
    assert.deepEqual(saucer.line2.getAttributeNS(undefined, 'stroke'), 'white')
    assert.deepEqual(saucer.line2.getAttributeNS(undefined, 'stroke-width'), '2')

    const $lines = saucer.canvas.querySelectorAll('line')
    assert.deepEqual($lines[0], saucer.line1)
    assert.deepEqual($lines[1], saucer.line2)

    assert.deepEqual(saucer.audioFlying.src, '/audio/saucer_big.mp3')
    assert.deepEqual(saucer.audioFlying.loop, true)
    assert.deepEqual(saucer.audioFlying.volume, 0.9)
    assert.deepEqual(saucer.audioBang.src, '/audio/bang_saucer_big.mp3')
    assert.deepEqual(saucer.audioBang.volume, 0.9)
})


test('Should create new saucer and assign data for size = 1', () => {
    const saucer = new Saucer(1)
    assert.deepEqual(saucer.size, 1)
    assert.deepEqual(saucer.width, 27)
    assert.deepEqual(saucer.height, 27)
    assert.deepEqual(saucer.counterMaxFire, 150)
    assert.deepEqual(saucer.probabilityFireAccurate, 0.25)
    assert.deepEqual(saucer.maxSpeed, 1.8)
    assert.ok(saucer.speedX === -1.8 || saucer.speedX === 1.8)

    assert.deepEqual(saucer.canvas.style.width, '27px')
    assert.deepEqual(saucer.canvas.style.height, '27px')

    assert.deepEqual(saucer.audioFlying.src, '/audio/saucer_small.mp3')
    assert.deepEqual(saucer.audioBang.src, '/audio/bang_saucer_small.mp3')
})


test('Should get audio volume from Spacetime', () => {
    Spacetime.createSpacetime(document.body)
    const saucer = new Saucer()
    saucer.audioFlying.volume = 0
    saucer.audioBang.volume = 0
    assert.deepEqual(saucer.audioFlying.volume, 0)
    assert.deepEqual(saucer.audioBang.volume, 0)
    saucer.setAudioVolume()
    assert.deepEqual(saucer.audioFlying.volume, 0.9)
    assert.deepEqual(saucer.audioBang.volume, 0.9)
})


test('Should play audio after create', () => {
    const saucer = new Saucer()
    assert.deepEqual(saucer.audioFlying.isPlaying, true)
})


test('Should stop playing audio', () => {
    const saucer = new Saucer()
    saucer.stopPlay()
    assert.deepEqual(saucer.audioFlying.isPlaying, false)
})


test('Should be destroyed if flies over the left edge', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer(1)
    assert.notDeepEqual(Spacetime.saucer, undefined)
    Spacetime.saucer.left = -28
    Spacetime.saucer.draw()
    assert.deepEqual(Spacetime.saucer, undefined)
})


test('Should be destroyed if flies over the right edge', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer(1)
    assert.notDeepEqual(Spacetime.saucer, undefined)
    Spacetime.saucer.left = 1921
    Spacetime.saucer.draw()
    assert.deepEqual(Spacetime.saucer, undefined)
})


test('Should be destroyed if flies over the top edge', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer(1)
    assert.notDeepEqual(Spacetime.saucer, undefined)
    Spacetime.saucer.top = -28
    Spacetime.saucer.draw()
    assert.deepEqual(Spacetime.saucer, undefined)
})


test('Should be destroyed if flies over the bottom edge', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer(1)
    assert.notDeepEqual(Spacetime.saucer, undefined)
    Spacetime.saucer.top = 1081
    Spacetime.saucer.draw()
    assert.deepEqual(Spacetime.saucer, undefined)
})


test('Should increase counterChangeDirection', () => {
    const saucer = new Saucer()
    assert.deepEqual(saucer.counterChangeDirection, 1)
    saucer.draw()
    assert.deepEqual(saucer.counterChangeDirection, 2)
})


test('Should increase counterFire', () => {
    const saucer = new Saucer()
    assert.deepEqual(saucer.counterFire, 1)
    saucer.draw()
    assert.deepEqual(saucer.counterFire, 2)
})


test('Should change direction if spaceship exists', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const saucer = new Saucer()
    saucer.counterChangeDirection = saucer.counterMaxChangeDirection + 1
    saucer.probabilityChangeDirection = 1
    const oldSpeedX = saucer.speedX
    const oldSpeedY = saucer.speedY
    saucer.draw()
    assert.notDeepEqual(saucer.speedX, oldSpeedX)
    assert.notDeepEqual(saucer.speedY, oldSpeedY)
})


test('Should fire missile', () => {
    Spacetime.createSpacetime(document.body)
    const saucer = new Saucer()
    saucer.counterFire = saucer.counterMaxFire + 1
    assert.deepEqual(Spacetime.missiles.size, 0)
    saucer.draw()
    assert.deepEqual(Spacetime.missiles.size, 1)
})


test('Should fire missile at the spaceship - saucer to the right of the spaceship', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const saucer = new Saucer()
    saucer.left = 10
    saucer.top = Spacetime.spaceship.top
    saucer.probabilityFireAccurate = 1

    assert.deepEqual(Spacetime.missiles.size, 0)
    saucer.fire()
    assert.deepEqual(Spacetime.missiles.size, 1)

    const missile = [...Spacetime.missiles.values()][0]
    assert.ok(missile.speedX > 0)
})


test('Should fire missile at the spaceship - saucer to the left of the spaceship', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const saucer = new Saucer()
    saucer.left = 1910
    saucer.top = Spacetime.spaceship.top
    saucer.probabilityFireAccurate = 1

    assert.deepEqual(Spacetime.missiles.size, 0)
    saucer.fire()
    assert.deepEqual(Spacetime.missiles.size, 1)

    const missile = [...Spacetime.missiles.values()][0]
    assert.ok(missile.speedX < 0)
})


test('Should fire missile at the spaceship - saucer above the spaceship', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const saucer = new Saucer()
    saucer.left = Spacetime.spaceship.left
    saucer.top = 10
    saucer.probabilityFireAccurate = 1

    assert.deepEqual(Spacetime.missiles.size, 0)
    saucer.fire()
    assert.deepEqual(Spacetime.missiles.size, 1)

    const missile = [...Spacetime.missiles.values()][0]
    assert.ok(missile.speedY > 0)
})


test('Should fire missile at the spaceship - saucer under the spaceship', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSpaceship()
    const saucer = new Saucer()
    saucer.left = Spacetime.spaceship.left
    saucer.top = 1080
    saucer.probabilityFireAccurate = 1

    assert.deepEqual(Spacetime.missiles.size, 0)
    saucer.fire()
    assert.deepEqual(Spacetime.missiles.size, 1)

    const missile = [...Spacetime.missiles.values()][0]
    assert.ok(missile.speedY < 0)
})


test('Should be destroyed after hit', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer()
    assert.notDeepEqual(Spacetime.saucer, undefined)
    Spacetime.saucer.hit()
    assert.deepEqual(Spacetime.saucer, undefined)
})


test('Should create 10 shards after hit', () => {
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer()
    assert.deepEqual(Spacetime.shards.size, 0)
    Spacetime.saucer.hit()
    assert.deepEqual(Spacetime.shards.size, 10)
})


test('Should play sound after hit', () => {
    // Prepare mocks
    Spacetime.createSpacetime(document.body)
    Spacetime.createSaucer()
    
    const saucer = new Saucer()
    saucer.hit()
    assert.deepEqual(saucer.audioBang.isPlaying, true)
})