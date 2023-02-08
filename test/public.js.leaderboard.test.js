import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { api } from '../public/js/api.js'
import { leaderboard } from '../public/js/leaderboard.js'


test('Should prepare canvas', () => {
    leaderboard.initialize(document.body)

    assert.deepEqual(leaderboard.canvas.constructor.name, 'HTMLDivElement')
    assert.deepEqual(leaderboard.canvas.className, 'leaderboard-hidden')
    const $canvas = document.querySelector('.leaderboard-hidden')
    assert.deepEqual($canvas, leaderboard.canvas)
})


test('Should not show leaderboard', async () => {
    // Prepare mocks
    api.getLeaderboard = () => undefined

    await leaderboard.show()

    assert.deepEqual(leaderboard.canvas.innerHTML, '')
    assert.deepEqual(leaderboard.canvas.className, 'leaderboard-hidden')
})


test('Should load leaderboard from api into innerHTML', async () => {
    // Prepare mocks
    api.getLeaderboard = () => [{ username: 'user1', highscore: 1000}]

    await leaderboard.show()

    assert.deepEqual(leaderboard.canvas.innerHTML.includes('<table class="leaderboard-table">'), true)
    assert.deepEqual(leaderboard.canvas.innerHTML.includes('<tr>'), true)
    assert.deepEqual(leaderboard.canvas.innerHTML.includes('<td class="leader-score box-light-gray">1000</td>'), true)
    assert.deepEqual(leaderboard.canvas.innerHTML.includes('<td class="leader-name">USER1</td>'), true)
    assert.deepEqual(leaderboard.canvas.innerHTML.includes('</tr>'), true)
    assert.deepEqual(leaderboard.canvas.innerHTML.includes('</table>'), true)

    assert.deepEqual(leaderboard.canvas.className, 'leaderboard')
})


test('Should hide leaderboard', () => {
    leaderboard.hide()
    assert.deepEqual(leaderboard.canvas.className, 'leaderboard-hidden')
})