import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Asteroid } from '../public/js/asteroid.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new asteroid and assign default data', () => {
    Spacetime.createSpacetime(document.body)
    const asteroid = new Asteroid()
    assert.deepEqual(asteroid.id.slice(0, 8), 'asteroid')
    assert.deepEqual(asteroid.maxSizeSmall, 27)
    assert.deepEqual(asteroid.amounOfShards, 6)
    assert.deepEqual(asteroid.size, 3)
    assert.deepEqual(asteroid.minSpeed, 0.3)
    assert.deepEqual(asteroid.maxSpeed, 1.35)
    assert.deepEqual(asteroid.minRotation, 0.3)
    assert.deepEqual(asteroid.maxRotation, 0.7)
    assert.ok(-1.35 <= asteroid.speedX && asteroid.speedX <= -0.3 || 0.3 <= asteroid.speedX && asteroid.speedX <= 1.35)
    assert.ok(-1.35 <= asteroid.speedY && asteroid.speedY <= -0.3 || 0.3 <= asteroid.speedY && asteroid.speedY <= 1.35)
    assert.ok(-0.7 <= asteroid.rotation && asteroid.rotation <= -0.3 || 0.3 <= asteroid.rotation && asteroid.rotation <= 0.7)
    assert.ok(asteroid.left <= 640 || 1280 <= asteroid.left)
    assert.ok(asteroid.top <= 360 || 720 <= asteroid.top)
    assert.deepEqual(asteroid.width, 81)
    assert.deepEqual(asteroid.height, 81)
    assert.deepEqual(asteroid.canvas.id, asteroid.id)
    assert.deepEqual(asteroid.canvas.style.width, '81px')
    assert.deepEqual(asteroid.canvas.style.height, '81px')
    asteroid.points.forEach(point => assert.ok(0 <= point && point <= 81))
    assert.deepEqual(asteroid.polygon.getAttributeNS(undefined, 'points'), asteroid.points.toString())
    assert.deepEqual(asteroid.audioBang.src, '/audio/bang_large.mp3')
    assert.deepEqual(asteroid.audioBang.volume, 0.9)
})


test('Should create new asteroid and assign given data for size = 1', () => {
    const asteroid = new Asteroid(1, {left: 100, top: 200})
    assert.deepEqual(asteroid.size, 1)
    assert.deepEqual(asteroid.maxSpeed, 2.4)
    assert.ok(-2.4 <= asteroid.speedX && asteroid.speedX <= -0.3 || 0.3 <= asteroid.speedX && asteroid.speedX <= 2.4)
    assert.ok(-2.4 <= asteroid.speedY && asteroid.speedY <= -0.3 || 0.3 <= asteroid.speedY && asteroid.speedY <= 2.4)
    assert.deepEqual(asteroid.left, 100)
    assert.deepEqual(asteroid.top, 200)
    assert.deepEqual(asteroid.width, 27)
    assert.deepEqual(asteroid.height, 27)
    assert.deepEqual(asteroid.canvas.style.width, '27px')
    assert.deepEqual(asteroid.canvas.style.height, '27px')
    asteroid.points.forEach(point => assert.ok(0 <= point && point <= 27))
    assert.deepEqual(asteroid.audioBang.src, '/audio/bang_small.mp3')
})


test('Should create new asteroid and assign given data for size = 2', () => {
    const asteroid = new Asteroid(2)
    assert.deepEqual(asteroid.size, 2)
    assert.deepEqual(Math.round(asteroid.maxSpeed * 10) / 10, 1.7)
    assert.ok(-1.7 <= asteroid.speedX && asteroid.speedX <= -0.3 || 0.3 <= asteroid.speedX && asteroid.speedX <= 1.7)
    assert.ok(-1.7 <= asteroid.speedY && asteroid.speedY <= -0.3 || 0.3 <= asteroid.speedY && asteroid.speedY <= 1.7)
    assert.deepEqual(asteroid.width, 54)
    assert.deepEqual(asteroid.height, 54)
    assert.deepEqual(asteroid.canvas.style.width, '54px')
    assert.deepEqual(asteroid.canvas.style.height, '54px')
    asteroid.points.forEach(point => assert.ok(0 <= point && point <= 54))
    assert.deepEqual(asteroid.audioBang.src, '/audio/bang_medium.mp3')
})


test('Should create new asteroid and assign given data for different sizes', () => {
    const asteroid1 = new Asteroid(3)
    assert.deepEqual(asteroid1.size, 3)
    const asteroid2 = new Asteroid(0)
    assert.deepEqual(asteroid2.size, 3)
    const asteroid3 = new Asteroid({})
    assert.deepEqual(asteroid3.size, 3)
})


test('Should remove after hit', () => {
    Spacetime.createSpacetime(document.body)
    const asteroid = new Asteroid()
    assert.deepEqual(Spacetime.asteroids.has(asteroid.id), false)
    Spacetime.addAsteroid(asteroid)
    assert.deepEqual(Spacetime.asteroids.has(asteroid.id), true)
    asteroid.hit()
    assert.deepEqual(Spacetime.asteroids.has(asteroid.id), false)
})


test('Should create 2 smaller asteroids after hit for size 3', () => {
    Spacetime.createSpacetime(document.body)
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const asteroid = new Asteroid(3)
    Spacetime.addAsteroid(asteroid)
    asteroid.hit()
    assert.deepEqual(Spacetime.asteroids.size, 2)
    Spacetime.asteroids.forEach(asteroid => assert.deepEqual(asteroid.size, 2))
})


test('Should create 2 smaller asteroids after hit for size 2', () => {
    Spacetime.createSpacetime(document.body)
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const asteroid = new Asteroid(2)
    Spacetime.addAsteroid(asteroid)
    asteroid.hit()
    assert.deepEqual(Spacetime.asteroids.size, 2)
    Spacetime.asteroids.forEach(asteroid => assert.deepEqual(asteroid.size, 1))
})


test('Should not create asteroids after hit for size 1', () => {
    Spacetime.createSpacetime(document.body)
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const asteroid = new Asteroid(1)
    Spacetime.addAsteroid(asteroid)
    asteroid.hit()
    assert.deepEqual(Spacetime.asteroids.size, 0)
})


test('Should create 6 shards after hit', () => {
    Spacetime.createSpacetime(document.body)
    assert.deepEqual(Spacetime.shards.size, 0)
    const asteroid = new Asteroid()
    asteroid.hit()
    assert.deepEqual(Spacetime.shards.size, 6)
})


test('Should play bang sound after hit', () => {
    const asteroid = new Asteroid()
    asteroid.hit()
    assert.deepEqual(asteroid.audioBang.isPlaying, true)
})