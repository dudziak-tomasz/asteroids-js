import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { Spacetime } from '../public/js/spacetime.js'
import { game } from '../public/js/game.js'
import { preferencesBox } from '../public/js/preferencesbox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare preferencessBox and assign data', () => {
    preferencesBox.createBox(global.document.body)

    assert.deepEqual(preferencesBox.audio.src, '/audio/fire.mp3')
    assert.deepEqual(preferencesBox.box.constructor.name, 'Box')
    assert.deepEqual(preferencesBox.box.content.innerHTML.includes('<p class="box-title">PREFERENCES</p>'), true)
})


test('Should open preferences box', () => {
    preferencesBox.openBox()
    assert.deepEqual(preferencesBox.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    preferencesBox.handlePreferences()

    assert.deepEqual(preferencesBox.$boxSliderSound.constructor.name, 'HTMLInputElement')
    assert.deepEqual(preferencesBox.$boxSliderSound.id, 'box-slider-sound')
    assert.deepEqual(preferencesBox.$boxSliderSound.value, '0.9')
    assert.deepEqual(typeof preferencesBox.$boxSliderSound.oninput, 'function')

    assert.deepEqual(preferencesBox.$boxSliderMusic.constructor.name, 'HTMLInputElement')
    assert.deepEqual(preferencesBox.$boxSliderMusic.id, 'box-slider-music')
    assert.deepEqual(preferencesBox.$boxSliderMusic.value, '0.3')
    assert.deepEqual(typeof preferencesBox.$boxSliderMusic.oninput, 'function')

    assert.deepEqual(preferencesBox.$boxRadioTracks.constructor.name, 'NodeList')
    assert.deepEqual(preferencesBox.$boxRadioTracks.length, 3)
    preferencesBox.$boxRadioTracks.forEach((radio) => {
        assert.deepEqual(radio.constructor.name, 'HTMLInputElement')
        assert.deepEqual(radio.checked, radio.value === 'background2.mp3')
    })
})


test('Should set sound volume and play audio sample after input sound slider', () => {
    assert.deepEqual(Spacetime.audioVolume, 0.9)
    assert.deepEqual(preferencesBox.audio.volume, 1)
    assert.deepEqual(preferencesBox.audio.isPlaying, false)

    preferencesBox.$boxSliderSound.value = '0.5'
    preferencesBox.$boxSliderSound.dispatchEvent(new CustomEvent('input'))

    assert.deepEqual(Spacetime.audioVolume, 0.5)
    assert.deepEqual(preferencesBox.audio.volume, 0.5)
    assert.deepEqual(preferencesBox.audio.isPlaying, true)
})


test('Should set background audio volume and play background audio after input music slider', () => {
    assert.deepEqual(game.audio.volume, 0.3)
    assert.deepEqual(game.audio.isPlaying, false)

    preferencesBox.$boxSliderMusic.value = '0.5'
    preferencesBox.$boxSliderMusic.dispatchEvent(new CustomEvent('input'))

    assert.deepEqual(game.audio.volume, 0.5)
    assert.deepEqual(game.audio.isPlaying, true)
})


test('Should change background music track and play', () => {
    game.audio.pause()
    assert.deepEqual(game.audio.isPlaying, false)
    assert.deepEqual(game.audio.src, '/audio/background2.mp3')

    assert.deepEqual(preferencesBox.$boxRadioTracks[0].value, 'background1.mp3')
    assert.deepEqual(preferencesBox.$boxRadioTracks[0].checked, false)

    preferencesBox.$boxRadioTracks[0].checked = true
    preferencesBox.$boxRadioTracks[0].dispatchEvent(new CustomEvent('input'))
    
    assert.deepEqual(preferencesBox.$boxRadioTracks[0].checked, true)
    assert.deepEqual(game.audio.isPlaying, true)
    assert.deepEqual(game.audio.src, '/audio/background1.mp3')
})


test('Should close preferences box', () => {
    preferencesBox.box.close()
    assert.deepEqual(preferencesBox.box.isOpen, false)
})
