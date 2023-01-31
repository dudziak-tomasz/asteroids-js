import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { messages } from '../public/js/messages.js'
import { changePasswordBox } from '../public/js/changepasswordbox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare changePasswordBox and assign data', () => {
    changePasswordBox.createBox(document.body)

    assert.deepEqual(changePasswordBox.box.constructor.name, 'Box')
    assert.deepEqual(changePasswordBox.box.content.innerHTML.includes('<p class="box-title">CHANGE PASSWORD</p>'), true)
})


test('Should open changePassword box', () => {
    changePasswordBox.openBox()

    assert.deepEqual(changePasswordBox.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    changePasswordBox.handleElements()

    assert.deepEqual(changePasswordBox.$boxErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(changePasswordBox.$boxErrorMessage.id, 'box-error-message')
    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, '')

    assert.deepEqual(changePasswordBox.$boxPasswordInfo.constructor.name, 'HTMLSpanElement')
    assert.deepEqual(changePasswordBox.$boxPasswordInfo.id, 'box-password-info')
    assert.deepEqual(changePasswordBox.$boxPasswordInfo.innerHTML, messages.PasswordInvalid)

    assert.deepEqual(changePasswordBox.$changePasswordForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(changePasswordBox.$changePasswordForm.id, 'box-change-password-form')
    assert.deepEqual(typeof changePasswordBox.$changePasswordForm.onsubmit, 'function')
    assert.deepEqual(changePasswordBox.$changePasswordForm.submit.disabled, false)

    assert.deepEqual(changePasswordBox.$currentPassword.constructor.name, 'HTMLInputElement')
    assert.deepEqual(changePasswordBox.$currentPassword.id, 'current-password')
    assert.deepEqual(changePasswordBox.$currentPassword.value, '')
    assert.deepEqual(changePasswordBox.$currentPassword, document.activeElement)
    assert.deepEqual(typeof changePasswordBox.$currentPassword.onkeydown, 'function')

    assert.deepEqual(changePasswordBox.$newPassword.constructor.name, 'HTMLInputElement')
    assert.deepEqual(changePasswordBox.$newPassword.id, 'new-password')
    assert.deepEqual(changePasswordBox.$newPassword.value, '')
    assert.deepEqual(typeof changePasswordBox.$newPassword.onkeydown, 'function')

    assert.deepEqual(changePasswordBox.$retypeNewPassword.constructor.name, 'HTMLInputElement')
    assert.deepEqual(changePasswordBox.$retypeNewPassword.id, 'retype-new-password')
    assert.deepEqual(changePasswordBox.$retypeNewPassword.value, '')
    assert.deepEqual(typeof changePasswordBox.$retypeNewPassword.onkeydown, 'function')
})


test('Should reset element values after reopen box', () => {
    changePasswordBox.openBox()

    changePasswordBox.$boxErrorMessage.innerHTML = 'testing'
    changePasswordBox.$changePasswordForm.submit.disabled = true
    changePasswordBox.$currentPassword.value = 'testing'
    changePasswordBox.$newPassword.value = 'testing'
    changePasswordBox.$retypeNewPassword.value = 'testing'

    changePasswordBox.box.close()
    changePasswordBox.openBox()

    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, '')
    assert.deepEqual(changePasswordBox.$changePasswordForm.submit.disabled, false)
    assert.deepEqual(changePasswordBox.$currentPassword.value, '')
    assert.deepEqual(changePasswordBox.$newPassword.value, '')
    assert.deepEqual(changePasswordBox.$retypeNewPassword.value, '')
})


test('Should show error message NEW PASSWORD DOES NOT MATCH RETYPED PASSWORD', async () => {
    // Prepare mocks
    api.login = () => {}
    api.updateUser = () => {}

    changePasswordBox.openBox()
    changePasswordBox.$newPassword.value = 'testing'
    changePasswordBox.$retypeNewPassword.value = 'qwerty'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, messages.NewPasswordNotMatchRetyped)
})


test('Should show error message NEW PASSWORD SHOULD BE DIFFERENT FROM CURRENT PASSWORD', async () => {
    // Prepare mocks
    api.login = () => {}
    api.updateUser = () => {}

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing'
    changePasswordBox.$newPassword.value = 'testing'
    changePasswordBox.$retypeNewPassword.value = 'testing'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, messages.NewPasswordShouldBeDifferent)
})


test('Should show message and disable submit button after submit', async () => {
    // Prepare mocks
    let innerHTML, disabled
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        innerHTML = changePasswordBox.$boxErrorMessage.innerHTML
        disabled = changePasswordBox.$changePasswordForm.submit.disabled
        return { status: 200 }
    }
    api.updateUser = () => {
        return { status: 200 }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))
    
    assert.deepEqual(innerHTML, 'CHANGING PASSWORD...')
    assert.deepEqual(disabled, true)
})


test('Should close changePassword box and open info box after status 200', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        return { status: 200 }
    }
    api.updateUser = () => {
        return { status: 200 }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(changePasswordBox.box.isOpen, false)
    assert.deepEqual(changePasswordBox.boxPasswordChangedInfo.isOpen, true)
})


test('Should show error 403 #1: incorrect current password', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        return { status: 403 }
    }
    api.updateUser = () => {
        return { status: 200 }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))
  
    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, messages.IncorrectCurrentPassword)
})


test('Should show connection problem error #1', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        return { status: 500 }
    }
    api.updateUser = () => {
        return { status: 200 }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))
  
    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should show connection problem error #2', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        return { status: 200 }
    }
    api.updateUser = () => {
        return { status: 500 }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))
  
    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should show error 400', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        return { status: 200 }
    }
    api.updateUser = () => {
        return { 
            status: 400,
            error: 'testing'
        }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))
  
    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, `TESTING: ${messages.PasswordInvalid}`)
})


test('Should show error 403 #2: not logged', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing'
    }
    api.login = () => {
        return { status: 200 }
    }
    api.updateUser = () => {
        return { status: 403 }
    }

    changePasswordBox.openBox()
    changePasswordBox.$currentPassword.value = 'testing1'
    changePasswordBox.$newPassword.value = 'testing2'
    changePasswordBox.$retypeNewPassword.value = 'testing2'
    await changePasswordBox.changePasswordFormSubmit(new CustomEvent('submit'))
  
    assert.deepEqual(changePasswordBox.$boxErrorMessage.innerHTML, messages.NotLogged)
})


