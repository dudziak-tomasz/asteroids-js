import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { errors } from '../public/js/errors.js'
import { passwordResetBox } from '../public/js/passwordresetbox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare passwordResetBox and assign data', () => {
    passwordResetBox.createBox(document.body)

    assert.deepEqual(passwordResetBox.box.constructor.name, 'Box')
    assert.deepEqual(passwordResetBox.box.content.innerHTML.includes('<p class="box-title">PASSWORD RESET</p>'), true)
    assert.deepEqual(passwordResetBox.boxPasswordResetInfo.constructor.name, 'Box')
    assert.deepEqual(passwordResetBox.boxPasswordResetInfo.content.innerHTML.includes('<p class="box-title">CHECK YOUR INBOX</p>'), true)
})


test('Should open password reset box', () => {
    passwordResetBox.openBox()
    assert.deepEqual(passwordResetBox.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    passwordResetBox.handleElements()

    assert.deepEqual(passwordResetBox.$boxErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(passwordResetBox.$boxErrorMessage.id, 'box-error-message')
    assert.deepEqual(passwordResetBox.$boxErrorMessage.innerHTML, '')

    assert.deepEqual(passwordResetBox.$passwordResetForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(passwordResetBox.$passwordResetForm.id, 'box-password-reset-form')
    assert.deepEqual(typeof passwordResetBox.$passwordResetForm.onsubmit, 'function')

    assert.deepEqual(passwordResetBox.$email.constructor.name, 'HTMLInputElement')
    assert.deepEqual(passwordResetBox.$email.id, 'email')
    
    const isFocused = document.activeElement === passwordResetBox.$email
    assert.deepEqual(isFocused, true)
})


test('Should show a message and disable submit button after submit', async () => {
    // Prepare mocks
    let innerHTML, disabled
    api.passwordReset = () => {
        innerHTML = passwordResetBox.$boxErrorMessage.innerHTML
        disabled = passwordResetBox.$passwordResetForm.submit.disabled
    }

    passwordResetBox.openBox()
    await passwordResetBox.$passwordResetForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(innerHTML, 'SENDING...')
    assert.deepEqual(disabled, true)
    assert.deepEqual(passwordResetBox.$passwordResetForm.submit.disabled, false)
})


test('Should close box and open boxPasswordResetInfo after status 200', async () => {
    // Prepare mocks
    api.passwordReset = () => { 
        return { status: 200 }
    }

    passwordResetBox.openBox()
    await passwordResetBox.$passwordResetForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetBox.box.isOpen, false)
    assert.deepEqual(passwordResetBox.boxPasswordResetInfo.isOpen, true)
})


test('Should show 400 error', async () => {
    // Prepare mocks
    api.passwordReset = () => { 
        return { 
            status: 400, 
            error: 'test error message'
        }
    }

    passwordResetBox.openBox()
    await passwordResetBox.$passwordResetForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetBox.$boxErrorMessage.innerHTML, 'TEST ERROR MESSAGE')
})


test('Should show 403 error', async () => {
    // Prepare mocks
    api.passwordReset = () => { 
        return { status: 403 }
    }

    passwordResetBox.openBox()
    await passwordResetBox.$passwordResetForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetBox.$boxErrorMessage.innerHTML, errors.PasswordResetFail)
})


test('Should show conection problem error', async () => {
    // Prepare mocks
    api.passwordReset = () => { 
        return { status: 500 }
    }

    passwordResetBox.openBox()
    await passwordResetBox.$passwordResetForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetBox.$boxErrorMessage.innerHTML, errors.ConnectionProblem)
})