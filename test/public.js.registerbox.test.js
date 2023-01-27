import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { errors } from '../public/js/errors.js'
import { registerBox } from '../public/js/registerbox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare registerBox and assign data', () => {
    registerBox.createBox(document.body)

    assert.deepEqual(registerBox.box.constructor.name, 'Box')
    assert.deepEqual(registerBox.box.content.innerHTML.includes('<p class="box-title">REGISTER</p>'), true)

    assert.deepEqual(registerBox.boxWelcome.constructor.name, 'Box')
    assert.deepEqual(registerBox.boxWelcome.content.innerHTML.includes('<p>WE ARE HAPPY TO HAVE YOU ON BOARD!</p>'), true)
})


test('Should open register box', () => {
    registerBox.openBox()

    assert.deepEqual(registerBox.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    registerBox.handleElements()

    assert.deepEqual(registerBox.$boxErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(registerBox.$boxErrorMessage.id, 'box-error-message')
    assert.deepEqual(registerBox.$boxErrorMessage.innerHTML, '')

    assert.deepEqual(registerBox.$boxUsernameInfo.constructor.name, 'HTMLSpanElement')
    assert.deepEqual(registerBox.$boxUsernameInfo.id, 'box-username-info')
    assert.deepEqual(registerBox.$boxUsernameInfo.innerHTML, errors.UsernameInvalid)

    assert.deepEqual(registerBox.$boxPasswordInfo.constructor.name, 'HTMLSpanElement')
    assert.deepEqual(registerBox.$boxPasswordInfo.id, 'box-password-info')
    assert.deepEqual(registerBox.$boxPasswordInfo.innerHTML, errors.PasswordInvalid)

    assert.deepEqual(registerBox.$boxEmailInfo.constructor.name, 'HTMLSpanElement')
    assert.deepEqual(registerBox.$boxEmailInfo.id, 'box-email-info')
    assert.deepEqual(registerBox.$boxEmailInfo.innerHTML, errors.ForPasswordResetOnly)

    assert.deepEqual(registerBox.$registerForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(registerBox.$registerForm.id, 'box-register-form')
    assert.deepEqual(typeof registerBox.$registerForm.onsubmit, 'function')

    assert.deepEqual(registerBox.$username.constructor.name, 'HTMLInputElement')
    assert.deepEqual(registerBox.$username.id, 'username')
    assert.deepEqual(registerBox.$username.value, '')
    assert.deepEqual(typeof registerBox.$username.oninput, 'function')
    assert.deepEqual(registerBox.$username, document.activeElement)

    assert.deepEqual(registerBox.$password.constructor.name, 'HTMLInputElement')
    assert.deepEqual(registerBox.$password.id, 'password')
    assert.deepEqual(registerBox.$password.value, '')
    assert.deepEqual(typeof registerBox.$password.onkeydown, 'function')

    assert.deepEqual(registerBox.$email.constructor.name, 'HTMLInputElement')
    assert.deepEqual(registerBox.$email.id, 'email')
    assert.deepEqual(registerBox.$email.value, '')
    assert.deepEqual(typeof registerBox.$email.oninput, 'function')
})


test('Should reset element values after reopen box', () => {
    registerBox.openBox()

    registerBox.$boxErrorMessage.innerHTML = 'testing'
    registerBox.$username.value = 'testing'
    registerBox.$password.value = 'testing'
    registerBox.$email.value = 'testing'

    registerBox.box.close()
    registerBox.openBox()

    assert.deepEqual(registerBox.$boxErrorMessage.innerHTML, '')
    assert.deepEqual(registerBox.$username.value, '')
    assert.deepEqual(registerBox.$password.value, '')
    assert.deepEqual(registerBox.$email.value, '')
})


test('Should show a message and disable submit button after submit', async () => {
    // Prepare mocks
    let innerHTML, disabled
    api.newUser = () => {
        innerHTML = registerBox.$boxErrorMessage.innerHTML
        disabled = registerBox.$registerForm.submit.disabled
    }

    registerBox.openBox()
    await registerBox.$registerForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(innerHTML, 'USER REGISTRATION...')
    assert.deepEqual(disabled, true)
    assert.deepEqual(registerBox.$registerForm.submit.disabled, false)
})


test('Should close register box and open welcome box after status 200', async () => {
    // Prepare mocks
    api.newUser = () => { 
        return { status: 201 }
    }

    registerBox.openBox()
    await registerBox.$registerForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(registerBox.box.isOpen, false)
    assert.deepEqual(registerBox.boxWelcome.isOpen, true)
})


test('Should show error 400', async () => {
    // Prepare mocks
    api.newUser = () => { 
        return { 
            status: 400,
            error: 'test message'
        }
    }

    registerBox.openBox()
    await registerBox.$registerForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(registerBox.$boxErrorMessage.innerHTML, 'TEST MESSAGE')
})


test('Should show connection problem error', async () => {
    // Prepare mocks
    api.newUser = () => { 
        return { status: 500 }
    }

    registerBox.openBox()
    await registerBox.$registerForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(registerBox.$boxErrorMessage.innerHTML, errors.ConnectionProblem)
})