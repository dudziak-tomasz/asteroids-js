import assert from 'assert'
import { Shard } from '../public/js/shard.js'

export const shardTest = () => {

    // Should create new shard
    {
        const shard = new Shard(200, 100)
        assert.ok(shard.id, 'Should assign id')
        assert.deepEqual(shard.id, shard.canvas.id, 'Should be the same id')
        assert.ok(shard.minSpeed > 0, 'Should assign positive value')
        assert.ok(shard.maxSpeed > 0, 'Should assign positive value')
        assert.deepEqual(shard.timeOfDestruction, 50, 'Should assign timeOfDestruction')
        assert.deepEqual(shard.left, 200, 'Should assign left')
        assert.deepEqual(shard.top, 100, 'Should assign top')
        assert.ok(shard.speedX < 0 || 0 < shard.speedX, 'Should assign nonzero value')
        assert.ok(shard.speedY < 0 || 0 < shard.speedY, 'Should assign nonzero value')
    }

    // Should increase counterOfDestruction by 1
    {
        const shard = new Shard(200, 100)
        assert.deepEqual(shard.counterOfDestruction, 1, 'Should increase value by 1')
        shard.draw()
        assert.deepEqual(shard.counterOfDestruction, 2, 'Should increase value by 1')
    }
    
}