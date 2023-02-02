import assert from 'node:assert/strict'
import { test } from 'node:test'
import { sleep } from './__mocks__/mock.sleep.js'

import './__mocks__/mock.dom.js'
import './__mocks__/mock.spacetime.js'

import { game } from '../public/js/game.js'
import { api } from '../public/js/api.js'
import { chat } from '../public/js/chat.js'


// Prepare mocks
game.createGame(document.body)

global.io = () => {
    return {
        on: () => {}
    }
}


test('Should prepare chat and assign data', () => {
    chat.createChat(document.body)

    assert.deepEqual(chat.messages.constructor.name, 'Array')
    assert.deepEqual(chat.messages.length, 0)
    assert.deepEqual(chat.messagesMaxNumber, 100)
    assert.deepEqual(chat.showChatInGameTime, 15000)
    assert.deepEqual(chat.hideChatInGameTimeoutID, undefined)
    assert.deepEqual(chat.parentElementForBox, document.body)
    assert.deepEqual(chat.parentElementForInGame, game.mainDiv)

    assert.deepEqual(chat.containerInGame.constructor.name, 'HTMLDivElement')
    assert.deepEqual(chat.containerInGame.classList.contains('chat-container'), true)
    assert.deepEqual(chat.containerInGame.classList.contains('chat-container-hidden'), true)
    assert.deepEqual(chat.containerInGame.id.startsWith('chat'), true)
    assert.deepEqual(chat.containerInGame.innerHTML, '')
    const $container = document.getElementById(chat.containerInGame.id)
    assert.deepEqual($container, chat.containerInGame)

    assert.deepEqual(chat.box.constructor.name, 'Box')
    assert.deepEqual(chat.box.content.innerHTML.includes('<div class="box-chat-title"><p class="box-title">CHAT</p></div>'), true)
    assert.deepEqual(chat.box.container.classList.contains('box-chat-container'), true)
    assert.deepEqual(chat.box.content.classList.contains('box-chat-content'), true)

    assert.ok(chat.socket)
    assert.deepEqual(typeof chat.socket.on, 'function')
})


test('Should listen for "login" event', () => {
    // Prepare mocks 
    let loginEventMock
    chat.socket.emit = (socketEvent) => loginEventMock = socketEvent

    game.mainDiv.dispatchEvent(new CustomEvent('login'))
    assert.deepEqual(loginEventMock, 'loginserver')
})


test('Should listen for "logout" event', () => {
    // Prepare mocks 
    let logoutEventMock
    chat.socket.emit = (socketEvent) => logoutEventMock = socketEvent

    game.mainDiv.dispatchEvent(new CustomEvent('logout'))
    assert.deepEqual(logoutEventMock, 'logoutserver')
})


test('Should listen for "logout" event', () => {
    // Prepare mocks 
    let usernameEventMock
    chat.socket.emit = (socketEvent) => usernameEventMock = socketEvent

    game.mainDiv.dispatchEvent(new CustomEvent('username'))
    assert.deepEqual(usernameEventMock, 'updateusername')
})


test('Should add response to chat.messages', () => {
    // Prepare mocks
    const response = {
        time: Date.now(),
        username: 'admin',
        text: 'testing'
    }

    chat.loginChatServerCallback(undefined, response)
    assert.deepEqual(chat.messages.length, 1)
    assert.deepEqual(chat.messages[0], response)
})


test('Should delete messages from "admin"', () => {
    // Prepare mocks
    const message = {
        time: Date.now(),
        username: 'admin',
        text: 'testing'
    }

    chat.messages = []
    chat.messages.push(message)
    assert.deepEqual(chat.messages.length, 1)
    chat.deleteAdminMessages()
    assert.deepEqual(chat.messages.length, 0)
})


test('Should push message to chat.messages', () => {
    // Prepare mocks
    const message = {
        time: Date.now(),
        username: 'admin',
        text: 'testing'
    }

    chat.processMessageFromServer(message)
    const lastMessage = chat.messages[chat.messages.length - 1]
    assert.deepEqual(lastMessage, message)
})


test('Should remove first message', () => {
    // Prepare mocks
    const firstMessage = {
        time: Date.now(),
        username: 'admin',
        text: 'first'
    }
    const message = {
        time: Date.now(),
        username: 'admin',
        text: 'testing'
    }

    chat.messages = []
    chat.processMessageFromServer(firstMessage)
    for (let i = 0; i < chat.messagesMaxNumber - 1; i++)
        chat.processMessageFromServer(message)
    
    assert.deepEqual(chat.messages.length, chat.messagesMaxNumber)
    assert.deepEqual(chat.messages[0], firstMessage)

    chat.processMessageFromServer(message)

    assert.deepEqual(chat.messages.length, chat.messagesMaxNumber)
    assert.notDeepEqual(chat.messages[0], firstMessage)
})


test('Should not add admin message to in-game chat', () => {
    // Prepare mocks
    const message = {
        time: Date.now(),
        username: 'admin',
        text: 'testing'
    }

    chat.containerInGame.innerHTML = ''
    chat.renderAndScrollMessageInGame(message)
    assert.deepEqual(chat.containerInGame.innerHTML, '')
})


test('Should add message to in-game chat and scroll down messages', () => {
    // Prepare mocks
    const message = {
        time: Date.now(),
        username: 'user1',
        text: 'testing'
    }

    chat.showChatInGameTime = 1
    chat.containerInGame.innerHTML = ''
    chat.renderAndScrollMessageInGame(message)
    assert.deepEqual(chat.containerInGame.innerHTML.includes('user1: testing'), true)
    assert.deepEqual(chat.containerInGame.scrollTop, chat.containerInGame.scrollHeight)
})


test('Should remove "chat-container-hidden" class and add after time', async () => {
    chat.showChatInGameTime = 5
    chat.showChatInGameAndHideAfterTime()
    assert.deepEqual(chat.containerInGame.classList.contains('chat-container-hidden'), false)
    await sleep(10)
    assert.deepEqual(chat.containerInGame.classList.contains('chat-container-hidden'), true)
})


test('Should open box', () => {
    chat.openBox()
    assert.deepEqual(chat.box.isOpen, true)
})


test('Should handle HTML elements', () => {
    chat.handleElements()

    assert.deepEqual(chat.$chatMessages.constructor.name, 'HTMLDivElement')
    assert.deepEqual(chat.$chatMessages.id, 'box-chat-messages')
    assert.deepEqual(chat.$chatMessages.innerHTML, '')
    assert.deepEqual(typeof chat.$chatMessages.onscroll, 'function')

    assert.deepEqual(chat.$chatForm.constructor.name, 'HTMLFormElement')
    assert.deepEqual(chat.$chatForm.id, 'box-chat-form')
    assert.deepEqual(typeof chat.$chatForm.onsubmit, 'function')

    assert.deepEqual(chat.$message.constructor.name, 'HTMLInputElement')
    assert.deepEqual(chat.$message.id, 'message')
    assert.deepEqual(chat.$message.value, '')
    assert.deepEqual(chat.$message, document.activeElement)
})


test('Should reset element values after reopen box', () => {
    chat.messages = []
    chat.openBox()

    chat.$chatMessages.innerHTML = 'testing'
    chat.$message.value = 'testing'

    chat.box.close()
    chat.openBox()

    assert.deepEqual(chat.$chatMessages.innerHTML, '')
    assert.deepEqual(chat.$message.value, '')
})


test('Should render message in box', () => {
    // Prepare mocks
    const message = {
        time: Date.now(),
        username: 'user1',
        text: 'testing'
    }

    chat.openBox()
    chat.$chatMessages.innerHTML = ''
    chat.renderMessageInBox(message)

    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span class="box-light-gray">user1</span>'), true)
    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span>testing</span>'), true)
})


test('Should scroll down messages in box', () => {
    chat.scrollBoxMessages()
    assert.deepEqual(chat.$chatMessages.scrollTop, chat.$chatMessages.scrollHeight)
})


test('Should render and scroll messages in box', () => {
    // Prepare mocks
    const message = {
        time: Date.now(),
        username: 'user1',
        text: 'testing'
    }

    chat.openBox()
    chat.$chatMessages.innerHTML = ''
    chat.renderAndScrollMessageInBox(message)

    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span class="box-light-gray">user1</span>'), true)
    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span>testing</span>'), true)
    assert.deepEqual(chat.$chatMessages.scrollTop, chat.$chatMessages.scrollHeight)
})


test('Should format time from date', () => {
    const date = new Date('December 17, 1995 03:04:40')
    const time = chat.getFormattedTime(date.getTime())

    assert.deepEqual(time, '3:04')
})


test('Should send score to chat server', () => {
    // Prepare mocks 
    let eventMock, scoreMock
    chat.socket.emit = (socketEvent, socketData) => [eventMock, scoreMock] = [socketEvent, socketData]

    chat.updateScore(1000)
    assert.deepEqual(eventMock, 'updatescore')
    assert.deepEqual(scoreMock, 1000)
})


test('Should add all messages in box chat and scroll down messages', () => {
    // Prepare mocks
    const message1 = {
        time: Date.now(),
        username: 'user1',
        text: 'testing1'
    }
    const message2 = {
        time: Date.now(),
        username: 'user2',
        text: 'testing2'
    }

    chat.openBox()
    chat.$chatMessages.innerHTML = ''
    chat.messages = []
    chat.messages.push(message1)
    chat.messages.push(message2)

    chat.loadAllMessagesInBox()

    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span class="box-light-gray">user1</span>'), true)
    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span>testing1</span>'), true)
    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span class="box-light-gray">user2</span>'), true)
    assert.deepEqual(chat.$chatMessages.innerHTML.includes('<span>testing2</span>'), true)
    assert.deepEqual(chat.$chatMessages.scrollTop, chat.$chatMessages.scrollHeight)
})


test('Should set isScrolledDown property', () => {
    //Prepare mock
    global.getComputedStyle = window.getComputedStyle

    chat.openBox()

    assert.deepEqual(chat.isScrolledDown, true)
    chat.chatMessagesOnScroll()

    assert.deepEqual(chat.isScrolledDown, false)
})


test('Should send message to chat server', () => {
    // Prepare mocks 
    let eventMock, dataMock
    chat.socket.emit = (socketEvent, socketData) => [eventMock, dataMock] = [socketEvent, socketData]

    api.user = 'test user'
    api.setToken('test token')
    chat.$message.value = '   test message   '

    chat.chatFormSubmit(new CustomEvent('submit'))

    assert.deepEqual(eventMock, 'messageserver')
    assert.deepEqual(dataMock.user, 'test user')
    assert.deepEqual(dataMock.token, 'test token')
    assert.deepEqual(dataMock.text, 'test message')
})


test('Should not send empty message to chat server', () => {
    // Prepare mocks 
    let emitMock = false
    chat.socket.emit = () => emitMock = true

    chat.$message.value = '    '

    chat.chatFormSubmit(new CustomEvent('submit'))

    assert.notDeepEqual(emitMock, true)
})


