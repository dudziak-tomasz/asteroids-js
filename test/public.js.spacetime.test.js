import assert from 'assert'
import { Spacetime } from '../public/js/spacetime.js'
import { Shard } from '../public/js/shard.js'

export const spacetimeTest = () => {

    // Prepare mocks
    Spacetime.start = () => {}
    Spacetime.sendEvent = () => {}

    // Should create Spacetime
    {
        Spacetime.createSpacetime(global.document.body)
        assert.deepEqual(Spacetime.canvas, global.document.body, 'Should assign document.body')
        assert.deepEqual(Spacetime.asteroids.size, 0, 'Should be empty Map')
        assert.deepEqual(Spacetime.shards, [], 'Should be emty table')
        assert.deepEqual(Spacetime.missiles, [], 'Should be emty table')
    }

    // Should get canvas size
    {
        // Prepare mocks
        Spacetime.canvas = {
            offsetWidth: 1920,
            offsetHeight: 1080
        }

        const canvasWidth = Spacetime.getWidth()
        assert.deepEqual(canvasWidth, 1920, 'Should be canvas.offsetWidth')

        const canvasHeight = Spacetime.getHeight()
        assert.deepEqual(canvasHeight, 1080, 'Should be canvas.offsetHeight')

        const size = Spacetime.getSize()
        assert.deepEqual(size, 1080, 'Should be smaller value of canvas.offsetWidth and canvas.offsetHeight')

        // Delete mocks
        Spacetime.canvas = global.document.body
    }


    // Should add shard
    {
        assert.deepEqual(Spacetime.shards.length, 0, 'Should be empty array')
        const shard = new Shard(150, 100)
        Spacetime.addShard(shard)
        assert.deepEqual(Spacetime.shards.length, 1, 'Should be one element in array')
        assert.deepEqual(Spacetime.shards[0].id, shard.id, 'Should be the same id')
    }


    //Should remove shard
    {
        const shard = Spacetime.shards[0]
        Spacetime.removeShard(shard)
        assert.deepEqual(Spacetime.shards.length, 0, 'Should be empty array')
    }

}