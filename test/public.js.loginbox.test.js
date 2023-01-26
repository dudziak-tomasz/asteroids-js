import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { errors } from '../public/js/errors.js'
import { registerBox } from '../public/js/registerbox.js'
import { passwordResetBox } from '../public/js/passwordresetbox.js'
import { loginBox } from '../public/js/loginbox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare loginBox and prepare data', () => {
    loginBox.createBox(document.body)

    assert.deepEqual(loginBox.box.constructor.name, 'Box')
    assert.deepEqual(loginBox.box.content.innerHTML.includes('<p class="box-title">LOGIN</p>'), true)
})


test('Should open login box', () => {
    loginBox.openBox()

    assert.deepEqual(loginBox.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    loginBox.handleElements()

    assert.deepEqual(loginBox.$boxErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(loginBox.$boxErrorMessage.id, 'box-error-message')
    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, '')

    assert.deepEqual(loginBox.$boxRegisterButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(loginBox.$boxRegisterButton.id, 'box-register-button')
    assert.deepEqual(typeof loginBox.$boxRegisterButton.onclick, 'function')

    assert.deepEqual(loginBox.$boxPasswordResetButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(loginBox.$boxPasswordResetButton.id, 'box-password-reset-button')
    assert.deepEqual(typeof loginBox.$boxPasswordResetButton.onclick, 'function')

    assert.deepEqual(loginBox.$loginForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(loginBox.$loginForm.id, 'box-login-form')
    assert.deepEqual(typeof loginBox.$loginForm.onsubmit, 'function')

    assert.deepEqual(loginBox.$username.constructor.name, 'HTMLInputElement')
    assert.deepEqual(loginBox.$username.id, 'username')
    assert.deepEqual(loginBox.$username.value, '')
    assert.deepEqual(typeof loginBox.$username.oninput, 'function')
    assert.deepEqual(loginBox.$username, document.activeElement)

    assert.deepEqual(loginBox.$password.constructor.name, 'HTMLInputElement')
    assert.deepEqual(loginBox.$password.id, 'password')
    assert.deepEqual(loginBox.$password.value, '')
    assert.deepEqual(typeof loginBox.$password.onkeydown, 'function')
})


test('Should handle HTML elements and assign message text', () => {
    loginBox.handleElements('test message')
    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, 'test message')
})


test('Should show a message and disable submit button after submit', async () => {
    // Prepare mocks
    let innerHTML, disabled
    api.login = () => {
        innerHTML = loginBox.$boxErrorMessage.innerHTML
        disabled = loginBox.$loginForm.submit.disabled
    }

    loginBox.openBox()
    await loginBox.$loginForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(innerHTML, 'LOGIN...')
    assert.deepEqual(disabled, true)
    assert.deepEqual(loginBox.$loginForm.submit.disabled, false)
})


test('Should close box after status 200', async () => {
    // Prepare mocks
    api.login = () => { 
        return { status: 200 }
    }

    loginBox.openBox()
    await loginBox.$loginForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(loginBox.box.isOpen, false)
})


test('Should show error 403', async () => {
    // Prepare mocks
    api.login = () => { 
        return { status: 403 }
    }

    loginBox.openBox()
    await loginBox.$loginForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, errors.UsernameOrPasswordIncorect)
})


test('Should show connection problem error', async () => {
    // Prepare mocks
    api.login = () => { 
        return { status: 500 }
    }

    loginBox.openBox()
    await loginBox.$loginForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, errors.ConnectionProblem)
})


test('Should show CapsLock message', async () => {
    //Prepare mocks
    errors.getCapsLockError = () => errors.CapsLock

    loginBox.openBox()
    await loginBox.$password.dispatchEvent(new CustomEvent('keydown'))

    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, errors.CapsLock)
})


test('Should hide CapsLock message', async () => {
    //Prepare mocks
    errors.getCapsLockError = () => errors.CapsLock

    loginBox.openBox()
    await loginBox.$password.dispatchEvent(new CustomEvent('keydown'))
    await loginBox.$username.dispatchEvent(new CustomEvent('input'))

    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, '')
})


test('Should open register box and close login box', async () => {
    registerBox.createBox(document.body)
    assert.deepEqual(registerBox.box.isOpen, false)

    loginBox.openBox()
    await loginBox.$boxRegisterButton.dispatchEvent(new CustomEvent('click'))

    assert.deepEqual(registerBox.box.isOpen, true)
    assert.deepEqual(loginBox.box.isOpen, false)
})


test('Should open password reset box and close login box', async () => {
    passwordResetBox.createBox(document.body)
    assert.deepEqual(passwordResetBox.box.isOpen, false)

    loginBox.openBox()
    await loginBox.$boxPasswordResetButton.dispatchEvent(new CustomEvent('click'))

    assert.deepEqual(passwordResetBox.box.isOpen, true)
    assert.deepEqual(loginBox.box.isOpen, false)
})