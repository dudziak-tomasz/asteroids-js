import assert from 'node:assert/strict'
import { test } from 'node:test'
import { config } from '../src/config.js'


test('Should be false before first using getItem()', () => {
    assert.deepEqual(config.configReady, false)
})


test('Should be empty object before first using getItem()', () => {
    assert.deepEqual(config.values, {})
})


test('Should get localhost from config.json', () => {
    assert.deepEqual(config.getItem('host'), 'localhost')
})


test('Should be true after first using getItem()', () => {
    assert.deepEqual(config.configReady, true)
})


test('Should not be empty object after first using getItem()', () => {
    assert.notDeepEqual(config.values, {})
})


test('Should get asteroids_test from config.json', () => {
    assert.deepEqual(config.getItem('database'), 'asteroids_test')
})


test('Should get number 3000 from config.json', () => {
    assert.deepEqual(config.getItem('httpPort'), 3000)
})


test('Should be truthy if parameter is defined in config.json', () => {
    assert.ok(config.getItem('httpsPort'))
})


test('Should be undefined if missing value in config.json', () => {
    assert.deepEqual(config.getItem('aaa'), undefined)
    assert.deepEqual(config.getItem({}), undefined)
})
