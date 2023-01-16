import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Shard } from '../public/js/shard.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new shard and assign data', () => {
    const shard = new Shard({left: 200, top: 100})
    assert.deepEqual(shard.id.startsWith('shard'), true)
    assert.deepEqual(shard.id, shard.canvas.id)
    assert.deepEqual(shard.minSpeed, 0.5)
    assert.deepEqual(shard.maxSpeed, 2)
    assert.deepEqual(shard.timeOfDestruction, 50)
    assert.deepEqual(shard.counterOfDestruction, 1)
    assert.deepEqual(shard.left, 200)
    assert.deepEqual(shard.top, 100)
    assert.deepEqual(-2 < shard.speedX && shard.speedX <= -0.5 || -0.5 < shard.speedX && shard.speedX <= 2, true)
    assert.deepEqual(-2 < shard.speedY && shard.speedY <= -0.5 || -0.5 < shard.speedY && shard.speedY <= 2, true)
})


test('Should increase counterOfDestruction by 1', () => {
    const shard = new Shard({left: 200, top: 100})
    assert.deepEqual(shard.counterOfDestruction, 1)
    shard.draw()
    assert.deepEqual(shard.counterOfDestruction, 2)
})


test('Should remove shard after 50 steps from Spacetime.shards', () => {
    Spacetime.createSpacetime(document.body)
    const shard = new Shard({left: 200, top: 100})
    Spacetime.addShard(shard)
    for (let i = 0; i < 49; i++) shard.draw() 
    assert.deepEqual(Spacetime.shards.size, 1)
    shard.draw()
    assert.deepEqual(Spacetime.shards.size, 0)
})