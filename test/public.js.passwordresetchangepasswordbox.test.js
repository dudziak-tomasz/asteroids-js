import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { errors } from '../public/js/errors.js'
import { loginBox } from '../public/js/loginbox.js'
import { passwordResetChangePasswordBox } from '../public/js/passwordresetchangepasswordbox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare passwordResetChangePasswordBox and assign data', () => {
    passwordResetChangePasswordBox.createBox(document.body)

    assert.deepEqual(passwordResetChangePasswordBox.box.constructor.name, 'Box')
    assert.deepEqual(passwordResetChangePasswordBox.box.content.innerHTML.includes('<p class="box-title">CHANGE PASSWORD</p>'), true)
})


test('Should open passwordResetChangePassword box', () => {
    passwordResetChangePasswordBox.openBox()

    assert.deepEqual(passwordResetChangePasswordBox.box.isOpen, true)
})


test('Should open passwordResetChangePassword box and assign given token', () => {
    passwordResetChangePasswordBox.openBox('test token')

    assert.deepEqual(passwordResetChangePasswordBox.box.isOpen, true)
    assert.deepEqual(passwordResetChangePasswordBox.token, 'test token')
})


test('Should handle HTML elements', () => {
    passwordResetChangePasswordBox.handleElements()

    assert.deepEqual(passwordResetChangePasswordBox.$boxErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(passwordResetChangePasswordBox.$boxErrorMessage.id, 'box-error-message')
    assert.deepEqual(passwordResetChangePasswordBox.$boxErrorMessage.innerHTML, '')

    assert.deepEqual(passwordResetChangePasswordBox.$changePasswordForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(passwordResetChangePasswordBox.$changePasswordForm.id, 'box-change-password-form')
    assert.deepEqual(typeof passwordResetChangePasswordBox.$changePasswordForm.onsubmit, 'function')

    assert.deepEqual(passwordResetChangePasswordBox.$newPassword.constructor.name, 'HTMLInputElement')
    assert.deepEqual(passwordResetChangePasswordBox.$newPassword.id, 'new-password')
    assert.deepEqual(passwordResetChangePasswordBox.$newPassword.value, '')
    assert.deepEqual(typeof passwordResetChangePasswordBox.$newPassword.onkeydown, 'function')
    assert.deepEqual(passwordResetChangePasswordBox.$newPassword, document.activeElement)

    assert.deepEqual(passwordResetChangePasswordBox.$retypeNewPassword.constructor.name, 'HTMLInputElement')
    assert.deepEqual(passwordResetChangePasswordBox.$retypeNewPassword.id, 'retype-new-password')
    assert.deepEqual(passwordResetChangePasswordBox.$retypeNewPassword.value, '')
    assert.deepEqual(typeof passwordResetChangePasswordBox.$retypeNewPassword.onkeydown, 'function')
})


test('Should show a message and disable submit button after submit', async () => {
    // Prepare mocks
    let innerHTML, disabled
    api.passwordUpdate = () => {
        innerHTML = passwordResetChangePasswordBox.$boxErrorMessage.innerHTML
        disabled = passwordResetChangePasswordBox.$changePasswordForm.submit.disabled
    }

    passwordResetChangePasswordBox.openBox()
    await passwordResetChangePasswordBox.$changePasswordForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(innerHTML, 'CHANGING PASSWORD...')
    assert.deepEqual(disabled, true)
    assert.deepEqual(passwordResetChangePasswordBox.$changePasswordForm.submit.disabled, false)
})


test('Should close box and open loginBox with message after status 200', async () => {
    loginBox.createBox(document.body)
    assert.deepEqual(loginBox.box.isOpen, false)

    // Prepare mocks
    api.passwordUpdate = () => { 
        return { status: 200 }
    }    

    passwordResetChangePasswordBox.openBox()
    await passwordResetChangePasswordBox.$changePasswordForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(loginBox.box.isOpen, true)
    assert.deepEqual(loginBox.$boxErrorMessage.innerHTML, 'PASSWORD CHANGED. YOU CAN LOG IN.')
    assert.deepEqual(passwordResetChangePasswordBox.box.isOpen, false)
})


test('Should show error 400', async () => {
    // Prepare mocks
    api.passwordUpdate = () => { 
        return { 
            status: 400, 
            error: 'test error message'
        }
    }    

    passwordResetChangePasswordBox.openBox()
    await passwordResetChangePasswordBox.$changePasswordForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetChangePasswordBox.$boxErrorMessage.innerHTML, 'TEST ERROR MESSAGE')
})


test('Should show error 403', async () => {
    // Prepare mocks
    api.passwordUpdate = () => { 
        return { status: 403 }
    }    

    passwordResetChangePasswordBox.openBox()
    await passwordResetChangePasswordBox.$changePasswordForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetChangePasswordBox.$boxErrorMessage.innerHTML, errors.PasswordResetFail)
})


test('Should show connection problem', async () => {
    // Prepare mocks
    api.passwordUpdate = () => { 
        return { status: 500 }
    }    

    passwordResetChangePasswordBox.openBox()
    await passwordResetChangePasswordBox.$changePasswordForm.dispatchEvent(new CustomEvent('submit'))

    assert.deepEqual(passwordResetChangePasswordBox.$boxErrorMessage.innerHTML, errors.ConnectionProblem)
})