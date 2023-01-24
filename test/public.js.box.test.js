import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { game } from '../public/js/game.js'
import { Box } from '../public/js/box.js'


// Prepare mocks
game.mainDiv = global.document.body


test('Should create box and assign default data', () => {
    const box = new Box(global.document.body)

    assert.deepEqual(box.parentElement, document.body)

    assert.deepEqual(box.container.constructor.name, 'HTMLDivElement')
    assert.deepEqual(box.container.id.startsWith('box'), true)
    assert.deepEqual(box.container.className, 'box-container')

    assert.deepEqual(box.menuX.constructor.name, 'HTMLDivElement')
    assert.deepEqual(box.menuX.id.startsWith('box-start'), true)
    assert.deepEqual(box.menuX.classList.contains('menu-start'), true)
    assert.deepEqual(box.menuX.classList.contains('menu-x'), true)

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

    assert.deepEqual(box.isOpen, false)
    assert.deepEqual(box.content.innerHTML, '')
})


test('Should create box and assign given data', () => {
    const box = new Box(global.document.body, '<p>test HTML</p>')
    assert.deepEqual(box.content.innerHTML, '<p>test HTML</p>')
})


test('Should open box', () => {
    const box = new Box(global.document.body)
    box.open()

    const $container = document.getElementById(box.container.id)
    assert.deepEqual($container, box.container)

    const $menuX = document.getElementById(box.menuX.id)
    assert.deepEqual($menuX, box.menuX)

    const $content = document.getElementById(box.content.id)
    assert.deepEqual($content, box.content)

    assert.deepEqual(box.isOpen, true)
})


test('Should send "boxopen" event', () => {
    // Prepare mocks
    let boxOpenMock = ''
    game.mainDiv.addEventListener('boxopen', (e) => boxOpenMock = e.detail.name)

    const box = new Box(global.document.body, '<p>test HTML</p>')
    box.open()

    assert.deepEqual(boxOpenMock, 'Box')
})

test('Should close box', () => {
    const box = new Box(global.document.body)
    box.open()
    box.close()

    const $container = document.getElementById(box.container.id)
    assert.deepEqual($container, null)

    assert.deepEqual(box.isOpen, false)
})


test('Should sent "boxclose" event', () => {
    // Prepare mocks
    let boxCloseMock = ''
    game.mainDiv.addEventListener('boxclose', (e) => boxCloseMock = e.detail.name)

    const box = new Box(global.document.body, '<p>test HTML</p>')
    box.open()
    box.close()

    assert.deepEqual(boxCloseMock, 'Box')
})


test('Should close box after click menuX', () => {
    const box = new Box(global.document.body)
    box.open()
    box.menuX.dispatchEvent(new CustomEvent('click'))
    
    const $container = document.getElementById(box.container.id)
    assert.deepEqual($container, null)
})