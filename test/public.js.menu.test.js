import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'

import { game } from '../public/js/game.js'
import { loginBox } from '../public/js/loginbox.js'
import { passwordResetChangePasswordBox } from '../public/js/passwordresetchangepasswordbox.js'
import { Menu } from '../public/js/menu.js'


// Prepare mocks
game.mainDiv = global.document.body


test('Should create menu and assign data', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    assert.deepEqual(menu.container.className, 'menu-container')
    assert.deepEqual(menu.menuX.classList.contains('menu-x'), false)
    assert.deepEqual(menu.content.className, 'menu-content')

    assert.deepEqual(Menu.boxHowToPlay.constructor.name, 'Box')
    assert.deepEqual(Menu.boxAbout.constructor.name, 'Box')
    assert.deepEqual(Menu.box404.constructor.name, 'Box')

    assert.deepEqual(menu.items.constructor.name, 'Array')
    assert.deepEqual(menu.items.length, 8)

    const $menuItems = document.querySelectorAll('.menu-item')
    assert.deepEqual($menuItems.length, 8)
    $menuItems.forEach((item, index) => assert.deepEqual(item.innerHTML, menu.items[index].text))

    const $container = document.getElementById(menu.container.id)
    assert.deepEqual($container, menu.container)
})


test('Should open Menu.box404', () => {
        // Prepare mocks
        global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu?q=404' })
    
        const menu = new Menu(global.document.body)

        assert.deepEqual(Menu.box404.isOpen, true)
})


test('Should open passwordResetChangePasswordBox and set window.location.search to empty string', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu?q=mocktoken' })
    let qParamMock = ''
    passwordResetChangePasswordBox.openBox = (qParam) => qParamMock = qParam

    const menu = new Menu(global.document.body)

    assert.deepEqual(qParamMock, 'mocktoken')
    assert.deepEqual(window.location.search, '')
})


test('Should call menuXClick() after click menuX', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })
    let boxOpenMock = ''
    game.mainDiv.addEventListener('boxopen', (e) => boxOpenMock = e.detail.name)
    let boxCloseMock = ''
    game.mainDiv.addEventListener('boxclose', (e) => boxCloseMock = e.detail.name)

    const menu = new Menu(global.document.body)

    menu.menuX.dispatchEvent(new CustomEvent('click'))
    assert.deepEqual(menu.menuX.classList.contains('menu-x'), true)
    assert.deepEqual(menu.content.classList.contains('menu-content-show'), true)
    assert.deepEqual(boxOpenMock, 'Menu')

    menu.menuX.dispatchEvent(new CustomEvent('click'))
    assert.deepEqual(menu.menuX.classList.contains('menu-x'), false)
    assert.deepEqual(menu.content.classList.contains('menu-content-show'), false)
    assert.deepEqual(boxCloseMock, 'Menu')
})


test('Should call menuItemClick() after click content', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    menu.content.id = 'menu-item-1'
    let menuItemClickMock = ''
    menu.menuItemClick = (itemId) => menuItemClickMock = itemId

    menu.content.dispatchEvent(new CustomEvent('click'))
    assert.deepEqual(menuItemClickMock, 1)
})


test('Should call initializeMenuItems() after fullscreenchange event', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    let initializeMenuItemsMock = false
    menu.initializeMenuItems = () => initializeMenuItemsMock = true

    document.dispatchEvent(new CustomEvent('fullscreenchange'))
    assert.deepEqual(initializeMenuItemsMock, true)
})


test('Should call initializeMenuItems() after login event', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    let initializeMenuItemsMock = false
    menu.initializeMenuItems = () => initializeMenuItemsMock = true

    game.mainDiv.dispatchEvent(new CustomEvent('login'))
    assert.deepEqual(initializeMenuItemsMock, true)
})


test('Should call initializeMenuItems() after logout event', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    let initializeMenuItemsMock = false
    menu.initializeMenuItems = () => initializeMenuItemsMock = true

    game.mainDiv.dispatchEvent(new CustomEvent('logout'))
    assert.deepEqual(initializeMenuItemsMock, true)
})


test('Should open loginBox after menuItemClick(0)', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    loginBox.createBox(global.document.body)
    loginBox.handleLogin = () => {}

    menu.menuItemClick(0)
    assert.deepEqual(loginBox.box.isOpen, true)
})


test('Should call makeFullscreen after menuItemClick(3)', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    let makeFullscreenMock = false
    menu.makeFullscreen = () => makeFullscreenMock = true
    menu.assignMenuItems()

    menu.menuItemClick(3)
    assert.deepEqual(makeFullscreenMock, true)
})


test('Should call exitFullscreen after menuItemClick(4)', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    // Prepare mocks
    let exitFullscreenMock = false
    menu.exitFullscreen = () => exitFullscreenMock = true
    menu.assignMenuItems()

    menu.menuItemClick(4)
    assert.deepEqual(exitFullscreenMock, true)
})


test('Should open boxHowToPlay after menuItemClick(6)', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    menu.menuItemClick(6)
    assert.deepEqual(Menu.boxHowToPlay.isOpen, true)
})


test('Should open boxAbout after menuItemClick(7)', () => {
    // Prepare mocks
    global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

    const menu = new Menu(global.document.body)

    menu.menuItemClick(7)
    assert.deepEqual(Menu.boxAbout.isOpen, true)
})
