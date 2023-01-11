import assert from 'assert'
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
    Spacetime.setAudioVolume(0.3)
    const vol = localStorage.getItem('soundVolume')
    assert.deepEqual(vol, 0.3)
    assert.deepEqual(Spacetime.audioVolume, 0.3)
})


test('Should get audio volume from localStorage', () => {
    localStorage.setItem('soundVolume', '0.5')
    const vol = Spacetime.getAudioVolume()
    assert.deepEqual(vol, 0.5)
    assert.deepEqual(Spacetime.audioVolume, 0.5)
})


test('Should create spaceship and append to document', () => {
    assert.deepEqual(Spacetime.spaceship, undefined)
    Spacetime.createSpaceship()
    assert.notDeepEqual(Spacetime.spaceship, undefined)
    const $spaceship = document.getElementById(Spacetime.spaceship.id)
    assert.deepEqual($spaceship, Spacetime.spaceship.canvas)
})


test('Should remove spaceship', () => {
    const spaceshipId = Spacetime.spaceship.id
    Spacetime.removeSpaceship()
    assert.deepEqual(Spacetime.spaceship, undefined)
    const $spaceship = document.getElementById(spaceshipId)
    assert.deepEqual($spaceship, undefined)
})


test('Should create saucer and append to document', () => {
    assert.deepEqual(Spacetime.saucer, undefined)
    Spacetime.createSaucer()
    assert.notDeepEqual(Spacetime.saucer, undefined)
    const $saucer = document.getElementById(Spacetime.saucer.id)
    assert.deepEqual($saucer, Spacetime.saucer.canvas)
})


test('Should remove saucer', () => {
    const saucerId = Spacetime.saucer.id
    Spacetime.removeSaucer()
    assert.deepEqual(Spacetime.saucer, undefined)
    const $saucer = document.getElementById(saucerId)
    assert.deepEqual($saucer, undefined)
})


test('Should add asteroid and append to document', () => {
    assert.deepEqual(Spacetime.asteroids.size, 0, 'Should be empty Map')
    const asteroid = new Asteroid()
    Spacetime.addAsteroid(asteroid)
    assert.deepEqual(Spacetime.asteroids.size, 1)
    assert.deepEqual(Spacetime.asteroids.get(asteroid.id), asteroid)
    const $asteroid = document.getElementById(asteroid.id)
    assert.deepEqual($asteroid, asteroid.canvas)
})


test('Should remove asteroid', () => {
    const asteroid = [...Spacetime.asteroids.values()][0]
    Spacetime.removeAsteroid(asteroid)
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const $asteroid = document.getElementById(asteroid.id)
    assert.deepEqual($asteroid, undefined)
})


test('Should create 10 asteroids', () => {
    Spacetime.createAsteroids(10)
    assert.deepEqual(Spacetime.asteroids.size, 10)
    const asteroids = document.querySelectorAll('[id^="asteroid"]')
    assert.deepEqual(asteroids.length, 10)
})


test('Should remove all asteroids', () => {
    Spacetime.removeAllAsteroid()
    assert.deepEqual(Spacetime.asteroids.size, 0)
    const asteroids = document.querySelectorAll('[id^="asteroid"]')
    assert.deepEqual(asteroids.length, 0)
})


test('Should add shard and append to document', () => {
    assert.deepEqual(Spacetime.shards.size, 0, 'Should be empty Map')
    const shard = new Shard()
    Spacetime.addShard(shard)
    assert.deepEqual(Spacetime.shards.size, 1)
    assert.deepEqual([...Spacetime.shards.values()][0], shard)
    const $shard = document.getElementById(shard.id)
    assert.deepEqual($shard, shard.canvas)
})


test('Should remove shard', () => {
    const shard = [...Spacetime.shards.values()][0]
    Spacetime.removeShard(shard)
    assert.deepEqual(Spacetime.shards.size, 0, 'Should be empty Map')
    const $shard = document.getElementById(shard.id)
    assert.deepEqual($shard, undefined)
})


test('Should add missile and append to document', () => {
    assert.deepEqual(Spacetime.missiles.size, 0, 'Should be empty Map')
    const missile = new Missile()
    Spacetime.addMissile(missile)
    assert.deepEqual(Spacetime.missiles.size, 1)
    assert.deepEqual([...Spacetime.missiles.values()][0], missile)
    const $missile = document.getElementById(missile.id)
    assert.deepEqual($missile, missile.canvas)
})


test('Should remove missile', () => {
    const missile = [...Spacetime.missiles.values()][0]
    Spacetime.removeMissile(missile)
    assert.deepEqual(Spacetime.missiles.size, 0, 'Should be empty Map')
    const $missile = document.getElementById(missile.id)
    assert.deepEqual($missile, undefined)
})


test('Should move all flying objects', { todo: 'add tests for Spacetime.move()' }, () => {
    Spacetime.move()
    assert.ok(true)
})


test('Should get canvas size', () => {
    const canvasWidth = Spacetime.getWidth()
    assert.deepEqual(canvasWidth, 1920)
    const canvasHeight = Spacetime.getHeight()
    assert.deepEqual(canvasHeight, 1080)
    const size = Spacetime.getSize()
    assert.deepEqual(size, 1080)
})