import assert from 'assert'
import { config } from '../src/config.js'

export const configTest = () => {

    // Should get localhost from config.json
    {
        assert.deepEqual(config.getItem('host'), 'localhost', 'Should get localhost from config.json')
    }
    

    // Should be true after first using .getItem()
    {
        assert.deepEqual(config.configReady, true, 'Should be true after first using .getItem()')
    }
    

    // Should not be empty object after first using .getItem()
    {
        assert.notDeepEqual(config.values, {}, 'Should not be empty object after first using .getItem()')
    }
    

    // Should get asteroids_test from config.json
    {
        assert.deepEqual(config.getItem('database'), 'asteroids_test', 'Should get asteroids_test from config.json')
    }
    

    // Should get number 3000 from config.json
    {
        assert.deepEqual(config.getItem('httpPort'), 3000, 'Should get number 3000 from config.json')
    }
    

    // Should be truthy if parameter is defined in config.json
    {
        assert.ok(config.getItem('httpsPort'), 'Should be truthy if parameter is defined in config.json')
    }
    

    // Should be undefined if missing value in config.json
    {
        assert.deepEqual(config.getItem('aaa'), undefined, 'Should be undefined if missing value in config.json')
        assert.deepEqual(config.getItem({}), undefined, 'Should be undefined if missing value in config.json')
    }
    
}