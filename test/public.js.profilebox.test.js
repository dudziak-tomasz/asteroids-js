import assert from 'node:assert/strict'
import { test } from 'node:test'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { messages } from '../public/js/messages.js'
import { changePasswordBox } from '../public/js/changepasswordbox.js'
import { profileBox } from '../public/js/profilebox.js'


// Prepare mocks
game.createGame(document.body)


test('Should prepare profileBox and assign data', () => {
    profileBox.createBox(document.body)

    assert.deepEqual(profileBox.box.constructor.name, 'Box')
    assert.deepEqual(profileBox.box.content.innerHTML.includes('<p class="box-title">PROFILE</p>'), true)
})


test('Should open profile box', () => {
    profileBox.openBox()

    assert.deepEqual(profileBox.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    profileBox.handleElements()

    assert.deepEqual(profileBox.$boxProfileErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(profileBox.$boxProfileErrorMessage.id, 'box-profile-error-message')
    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, 'LOADING PROFILE...')

    assert.deepEqual(profileBox.$boxProfileDiv.constructor.name, 'HTMLDivElement')
    assert.deepEqual(profileBox.$boxProfileDiv.id, 'box-profile-div')
    assert.deepEqual(profileBox.$boxProfileDiv.innerHTML.includes('<form id="box-profile-form">'), true)
    assert.deepEqual(profileBox.$boxProfileDiv.style.display, 'none')

    assert.deepEqual(profileBox.$profileForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(profileBox.$profileForm.id, 'box-profile-form')
    assert.deepEqual(typeof profileBox.$profileForm.onsubmit, 'function')

    assert.deepEqual(profileBox.$username.constructor.name, 'HTMLInputElement')
    assert.deepEqual(profileBox.$username.id, 'username')
    assert.deepEqual(profileBox.$username.value, '')
    assert.deepEqual(typeof profileBox.$username.oninput, 'function')

    assert.deepEqual(profileBox.$email.constructor.name, 'HTMLInputElement')
    assert.deepEqual(profileBox.$email.id, 'email')
    assert.deepEqual(profileBox.$email.value, '')
    assert.deepEqual(typeof profileBox.$email.oninput, 'function')

    assert.deepEqual(profileBox.$highscore.constructor.name, 'HTMLInputElement')
    assert.deepEqual(profileBox.$highscore.id, 'highscore')
    assert.deepEqual(profileBox.$highscore.value, '')

    assert.deepEqual(profileBox.$boxErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(profileBox.$boxErrorMessage.id, 'box-error-message')
    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, '')

    assert.deepEqual(profileBox.$logoutButton.constructor.name, 'HTMLButtonElement')
    assert.deepEqual(profileBox.$logoutButton.id, 'box-logout-button')
    assert.deepEqual(typeof profileBox.$logoutButton.onclick, 'function')

    assert.deepEqual(profileBox.$changePasswordButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(profileBox.$changePasswordButton.id, 'box-change-password-button')
    assert.deepEqual(typeof profileBox.$changePasswordButton.onclick, 'function')

    assert.deepEqual(profileBox.$logoutAllButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(profileBox.$logoutAllButton.id, 'box-logoutall-button')
    assert.deepEqual(typeof profileBox.$logoutAllButton.onclick, 'function')

    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.id, 'box-logoutall-error-message')
    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.innerHTML, '')

    assert.deepEqual(profileBox.$closeAccountButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(profileBox.$closeAccountButton.id, 'box-close-account-button')
    assert.deepEqual(typeof profileBox.$closeAccountButton.onclick, 'function')

    assert.deepEqual(profileBox.$boxCloseMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(profileBox.$boxCloseMessage.id, 'box-close-message')
    assert.deepEqual(profileBox.$boxCloseMessage.innerHTML, 'ARE YOU SURE? <a id="box-close-yes-button">YES</a> <a id="box-close-no-button">NO</a>')
    assert.deepEqual(profileBox.$boxCloseMessage.style.display, 'none')

    assert.deepEqual(profileBox.$closeYesButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(profileBox.$closeYesButton.id, 'box-close-yes-button')
    assert.deepEqual(typeof profileBox.$closeYesButton.onclick, 'function')

    assert.deepEqual(profileBox.$closeNoButton.constructor.name, 'HTMLAnchorElement')
    assert.deepEqual(profileBox.$closeNoButton.id, 'box-close-no-button')
    assert.deepEqual(typeof profileBox.$closeNoButton.onclick, 'function')

    assert.deepEqual(profileBox.$boxCloseErrorMessage.constructor.name, 'HTMLParagraphElement')
    assert.deepEqual(profileBox.$boxCloseErrorMessage.id, 'box-close-error-message')
    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, '')
})


test('Should reset element values after reopen box', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {}
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()

    profileBox.$boxProfileErrorMessage.innerHTML = 'testing'
    profileBox.$boxErrorMessage.innerHTML = 'testing'
    profileBox.$boxLogoutAllErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseErrorMessage.innerHTML = 'testing'

    profileBox.box.close()
    await profileBox.openBox()

    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, '')
})


test('Should load profile and show profile DIV', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {}
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()

    assert.deepEqual(profileBox.$username.value, 'testing')
    assert.deepEqual(profileBox.$email.value, 'testing@')
    assert.deepEqual(profileBox.$highscore.value, '999')

    assert.deepEqual(profileBox.$boxProfileDiv.style.display, 'block')
})


test('Should not load profile, not show profile DIV and show 403 error', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {}
    api.profile = () => {
        return { status: 403 }
    }

    await profileBox.openBox()

    assert.deepEqual(profileBox.$username.value, '')
    assert.deepEqual(profileBox.$email.value, '')
    assert.deepEqual(profileBox.$highscore.value, '')

    assert.deepEqual(profileBox.$boxProfileDiv.style.display, 'none')
    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, messages.NotLogged)
})


test('Should not load profile, not show profile DIV and show connection problem error', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {}
    api.profile = () => {
        return { status: 500 }
    }

    await profileBox.openBox()

    assert.deepEqual(profileBox.$username.value, '')
    assert.deepEqual(profileBox.$email.value, '')
    assert.deepEqual(profileBox.$highscore.value, '')

    assert.deepEqual(profileBox.$boxProfileDiv.style.display, 'none')
    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should not save if no change', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {}
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    await profileBox.profileFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, 'NO CHANGE, NO SAVE')
})


test('Should show message SAVING... and disable save button', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    let innerHTML, disabled
    api.updateUser = () => {
        innerHTML = profileBox.$boxErrorMessage.innerHTML
        disabled = profileBox.$profileForm.submit.disabled
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.$username.value = 'testing1'
    await profileBox.profileFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(innerHTML, 'SAVING...')
    assert.deepEqual(disabled, true)
})


test('Should show message SAVED after status 200', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.$username.value = 'testing1'
    await profileBox.profileFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, 'SAVED')
})


test('Should show error message #1 after status 400', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { 
            status: 400,
            error: 'username is invalid'
        }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.$username.value = 'testing1'
    await profileBox.profileFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, `USERNAME IS INVALID: ${messages.UsernameInvalid}`)
})


test('Should show error message #2 after status 400', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { 
            status: 400,
            error: 'email is invalid'
        }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.$email.value = 'testing1@'
    await profileBox.profileFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, 'EMAIL IS INVALID')
})


test('Should show connection problem error', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 500 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.$email.value = 'testing1@'
    await profileBox.profileFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should close box and open changePasswordBox', async () => {
        // Prepare mocks
        changePasswordBox.createBox(document.body)
        api.user = {
            username: 'testing',
            email: 'testing@',
            highscore: 999
        }
        api.updateUser = () => {
            return { status: 200 }
        }
        api.profile = () => {
            return { status: 200 }
        }
    
        await profileBox.openBox()
        profileBox.$changePasswordButton.dispatchEvent(new CustomEvent('click'))

        assert.deepEqual(profileBox.box.isOpen, false)
        assert.deepEqual(changePasswordBox.box.isOpen, true)
})


test('Should show message LOGOUT... and disable logout button', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    let innerHTML, disabled
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logout = () => {
        innerHTML = profileBox.$boxErrorMessage.innerHTML
        disabled = profileBox.$logoutButton.disabled
        return { status: 200 }
    }

    await profileBox.openBox()
    await profileBox.logoutButtonClick()

    assert.deepEqual(innerHTML, 'LOGOUT...')
    assert.deepEqual(disabled, true)
})


test('Should close box after logout with status 200', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logout = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    await profileBox.logoutButtonClick()

    assert.deepEqual(profileBox.box.isOpen, false)
})


test('Should close box after logout with status 403', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logout = () => {
        return { status: 403 }
    }

    await profileBox.openBox()
    await profileBox.logoutButtonClick()

    assert.deepEqual(profileBox.box.isOpen, false)
})


test('Should show connection problem error after logout with status 500', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logout = () => {
        return { status: 500 }
    }

    await profileBox.openBox()
    await profileBox.logoutButtonClick()

    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should show message LOGOUT... and disable logoutAll button', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    let innerHTML, disabled
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logoutAll = () => {
        innerHTML = profileBox.$boxLogoutAllErrorMessage.innerHTML
        disabled = profileBox.$logoutAllButton.disabled
        return { status: 200 }
    }

    await profileBox.openBox()
    await profileBox.logoutAllButtonClick()

    assert.deepEqual(innerHTML, 'LOGOUT...')
    assert.deepEqual(disabled, true)
})


test('Should close box after logoutAll with status 200', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logoutAll = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    await profileBox.logoutAllButtonClick()

    assert.deepEqual(profileBox.box.isOpen, false)
})


test('Should close box after logoutAll with status 403', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logoutAll = () => {
        return { status: 403 }
    }

    await profileBox.openBox()
    await profileBox.logoutAllButtonClick()

    assert.deepEqual(profileBox.box.isOpen, false)
})


test('Should show connection problem error after logoutAll with status 499', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.logoutAll = () => {
        return { status: 499 }
    }

    await profileBox.openBox()
    await profileBox.logoutAllButtonClick()

    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should show close account block', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.closeAccountButtonClick()

    assert.deepEqual(profileBox.$boxCloseMessage.style.display, 'block')
})


test('Should hide close account block', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.closeAccountButtonClick()
    profileBox.closeNoButtonClick()

    assert.deepEqual(profileBox.$boxCloseMessage.style.display, 'none')
})


test('Should show CLOSING ACCOUNT... message', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    let innerHTML
    api.deleteUser = () => {
        innerHTML = profileBox.$boxCloseErrorMessage.innerHTML
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.closeAccountButtonClick()
    await profileBox.closeYesButtonClick()

    assert.deepEqual(innerHTML, 'CLOSING ACCOUNT...')
})


test('Should close box after close account with code 200', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.deleteUser = () => {
        return { status: 200 }
    }

    await profileBox.openBox()
    profileBox.closeAccountButtonClick()
    await profileBox.closeYesButtonClick()

    assert.deepEqual(profileBox.box.isOpen, false)
})


test('Should show error after close account with code 403', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.deleteUser = () => {
        return { status: 403 }
    }

    await profileBox.openBox()
    profileBox.closeAccountButtonClick()
    await profileBox.closeYesButtonClick()

    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, messages.NotLogged)
})


test('Should show connection problem error after close account with code 500', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }
    api.deleteUser = () => {
        return { status: 500 }
    }

    await profileBox.openBox()
    profileBox.closeAccountButtonClick()
    await profileBox.closeYesButtonClick()

    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, messages.ConnectionProblem)
})


test('Should hide all messages', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()

    profileBox.$boxProfileErrorMessage.innerHTML = 'testing'
    profileBox.$boxErrorMessage.innerHTML = 'testing'
    profileBox.$boxLogoutAllErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseMessage.style.display = 'block'

    profileBox.clearMessages()

    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseMessage.style.display, 'none')
})


test('Should hide all messages after username input', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()

    profileBox.$boxProfileErrorMessage.innerHTML = 'testing'
    profileBox.$boxErrorMessage.innerHTML = 'testing'
    profileBox.$boxLogoutAllErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseMessage.style.display = 'block'

    profileBox.$username.dispatchEvent(new CustomEvent('input'))

    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseMessage.style.display, 'none')
})


test('Should hide all messages after email input', async () => {
    // Prepare mocks
    api.user = {
        username: 'testing',
        email: 'testing@',
        highscore: 999
    }
    api.updateUser = () => {
        return { status: 200 }
    }
    api.profile = () => {
        return { status: 200 }
    }

    await profileBox.openBox()

    profileBox.$boxProfileErrorMessage.innerHTML = 'testing'
    profileBox.$boxErrorMessage.innerHTML = 'testing'
    profileBox.$boxLogoutAllErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseErrorMessage.innerHTML = 'testing'
    profileBox.$boxCloseMessage.style.display = 'block'

    profileBox.$email.dispatchEvent(new CustomEvent('input'))

    assert.deepEqual(profileBox.$boxProfileErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxLogoutAllErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseErrorMessage.innerHTML, '')
    assert.deepEqual(profileBox.$boxCloseMessage.style.display, 'none')
})


