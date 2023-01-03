import assert from 'assert'
import { config } from '../src/config.js'

export const configTest = () => {

    assert.equal(config.configReady, false, 'Should be false before first using .getItem()')

    assert.deepEqual(config.values, {}, 'Should be empty object before first using .getItem()')

    assert.deepEqual(config.getItem('host'), 'localhost', 'Should get localhost from config.json')

    assert.equal(config.configReady, true, 'Should be true after first using .getItem()')

    assert.notDeepEqual(config.values, {}, 'Should not be empty object after first using .getItem()')

    assert.deepEqual(config.getItem('database'), 'asteroids_test', 'Should get asteroids from config.json')

    assert.deepEqual(config.getItem('httpPort'), 3000, 'Should get number 3000 from config.json')

    assert.ok(config.getItem('httpsPort'), 'Should be truthy')

    assert.deepEqual(config.getItem('aaa'), undefined, 'Should be undefined if missing value in config.json')

    assert.deepEqual(config.getItem({}), undefined, 'Should be undefined if missing value in config.json')

}