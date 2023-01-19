import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { game } from '../public/js/game.js'
import { Box } from '../public/js/box.js'


// Prepare mocks
game.mainDiv = global.document.body


test('Should create box and assign default data', () => {
    // Prepare mocks
    let boxOpenMock = false
    game.mainDiv.addEventListener('boxopen', () => boxOpenMock = true)

    const box = new Box(global.document.body)

    assert.deepEqual(box.parentElement, document.body)
    assert.deepEqual(box.name, '')

    assert.deepEqual(box.container.constructor.name, 'HTMLDivElement')
    assert.deepEqual(box.container.id.startsWith('box'), true)
    assert.deepEqual(box.container.className, 'box-container')
    const $container = document.getElementById(box.container.id)
    assert.deepEqual($container, box.container)

    assert.deepEqual(box.menuX.constructor.name, 'HTMLDivElement')
    assert.deepEqual(box.menuX.id.startsWith('box-start'), true)
    assert.deepEqual(box.menuX.classList.contains('menu-start'), true)
    assert.deepEqual(box.menuX.classList.contains('menu-x'), true)
    const $menuX = document.getElementById(box.menuX.id)
    assert.deepEqual($menuX, box.menuX)

    const $menuBars = box.menuX.querySelectorAll('div')
    assert.deepEqual($menuBars.length, 3)
    $menuBars.forEach(menuBar => {
        assert.deepEqual(menuBar.constructor.name, 'HTMLDivElement')
        assert.deepEqual(menuBar.id.startsWith('menu-bar'), true)
        assert.deepEqual(menuBar.className.startsWith('menu-bar'), true)
    })

    assert.deepEqual(box.content.constructor.name, 'HTMLDivElement')
    assert.deepEqual(box.content.id.startsWith('box-content'), true)
    assert.deepEqual(box.content.className, 'box-content')
    const $content = document.getElementById(box.content.id)
    assert.deepEqual($content, box.content)

    assert.deepEqual(box.content.innerHTML, '')
    assert.deepEqual(boxOpenMock, true)
})


test('Should create box and assign given data', () => {
    // Prepare mocks
    let boxOpenMock = ''
    game.mainDiv.addEventListener('boxopen', (e) => boxOpenMock = e.detail.name)

    const box = new Box(global.document.body, '<p>test HTML</p>', 'TEST NAME')

    assert.deepEqual(box.name, 'TEST NAME')
    assert.deepEqual(box.content.innerHTML, '<p>test HTML</p>')
    assert.deepEqual(boxOpenMock, 'TEST NAME')
})


test('Should close box', () => {
    const box = new Box(global.document.body)
    const containerId = box.container.id

    box.close()

    const $container = document.getElementById(containerId)
    assert.deepEqual($container, null)
    assert.deepEqual(box.container, undefined)
})


test('Should sent "boxclose" event', () => {
        // Prepare mocks
        let boxCloseMock = ''
        game.mainDiv.addEventListener('boxclose', (e) => boxCloseMock = e.detail.name)
    
        const box = new Box(global.document.body, '<p>test HTML</p>', 'TEST NAME')
        box.close()

        assert.deepEqual(boxCloseMock, 'TEST NAME')
})


test('Should close box after click menuX', () => {
    const box = new Box(global.document.body)
    box.menuX.dispatchEvent(new CustomEvent('click'))
    assert.deepEqual(box.container, undefined)
})