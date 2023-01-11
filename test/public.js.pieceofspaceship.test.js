import assert from 'assert'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { PieceOfSpaceship } from '../public/js/pieceofspaceship.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new pieceofspaceship and assign data', () => {
    const startPoint = {
        x: 100,
        y: 100
    }
    const startSpeed = {
        speedX: 10,
        speedY: -10
    }

    const piece = new PieceOfSpaceship(startPoint, startSpeed)

    assert.ok(piece.id.startsWith('piece'))
    assert.deepEqual(piece.canvas.id, piece.id)
    assert.deepEqual(piece.minSpeed, 0.1)
    assert.deepEqual(piece.maxSpeed, 0.3)
    assert.deepEqual(piece.minRotation, 0.7)
    assert.deepEqual(piece.maxRotation, 1.5)
    assert.deepEqual(piece.timeOfDestruction, 200)
    assert.deepEqual(piece.counterOfDestruction, 1)
    assert.deepEqual(piece.height, Math.round(1080 / 60))
    assert.deepEqual(piece.width, 2)
    assert.deepEqual(piece.left, 100)
    assert.deepEqual(piece.top, 100 - piece.height)
    assert.ok(-0.3 + 10 / 3 <= piece.speedX && piece.speedX <= -0.1 + 10 / 3 || 0.1 + 10 / 3 <= piece.speedX && piece.speedX <= 0.3 + 10 / 3)
    assert.ok(-0.3 - 10 / 3 <= piece.speedY && piece.speedY <= -0.1 - 10 / 3 || 0.1 - 10 / 3 <= piece.speedY && piece.speedY <= 0.3 - 10 / 3)
    assert.ok(-1.5 <= piece.rotation && piece.rotation <= -0.7 || 0.7 <= piece.rotation && piece.rotation <= 1.5)
    assert.ok(0 <= piece.angle && piece.angle < 360)
    assert.deepEqual(piece.canvas.style.width, '2px')
    assert.deepEqual(piece.canvas.style.height, '18px')
})


test('Should set new values after .draw()', () => {
    const piece = new PieceOfSpaceship()
    piece.angle = 10
    piece.counterOfDestruction = 0
    piece.draw()
    assert.deepEqual(piece.canvas.style.transform, 'rotate(10deg)')
    assert.deepEqual(piece.counterOfDestruction, 1)
})


test('Should change opacity after 80% of timeOfDestruction', () => {
    const piece = new PieceOfSpaceship()
    piece.counterOfDestruction = 0.9 * piece.timeOfDestruction
    piece.draw()
    assert.ok(piece.canvas.style.opacity < 1)
})


test('Should remove from Spacetime.shards after 200 steps', () => {
    Spacetime.createSpacetime(document.body)
    const piece = new PieceOfSpaceship()
    Spacetime.addShard(piece)
    for (let i = 0; i < 199; i++) piece.draw() 
    assert.deepEqual(Spacetime.shards.size, 1)
    piece.draw()
    assert.deepEqual(Spacetime.shards.size, 0)
})