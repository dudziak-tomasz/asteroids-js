import assert from 'assert'
import { test } from 'node:test'
import { Spacetime } from '../public/js/spacetime.js'
import { Shard } from '../public/js/shard.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'


test('Should create new shard and assign data', () => {
    const shard = new Shard({left: 200, top: 100})
    assert.ok(shard.id, 'Should assign id')
    assert.deepEqual(shard.id, shard.canvas.id, 'Should be the same id')
    assert.ok(shard.minSpeed > 0, 'Should assign positive value')
    assert.ok(shard.maxSpeed > 0, 'Should assign positive value')
    assert.deepEqual(shard.timeOfDestruction, 50, 'Should assign timeOfDestruction')
    assert.deepEqual(shard.left, 200, 'Should assign left')
    assert.deepEqual(shard.top, 100, 'Should assign top')
    assert.ok(shard.speedX < 0 || 0 < shard.speedX, 'Should assign nonzero value')
    assert.ok(shard.speedY < 0 || 0 < shard.speedY, 'Should assign nonzero value')
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