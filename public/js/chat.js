import { config } from './config.js'
import { api } from './api.js'
import { game } from './game.js'
import { getRandomID } from './utils.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const chat = {

    messages: [],
    messagesMaxNumber: 100,
    showChatInGameTime: 15000,
    hideChatInGameTimeoutID: undefined,

    createChat(parentElementForBox) {
        this.parentElementForBox = parentElementForBox
        this.parentElementForInGame = game.mainDiv

        this.initializeContainerInGame()
        this.initializeBox()
        this.initializeSocket()
        this.initializeCustomEventListeners()
    },

    initializeContainerInGame() {
        this.containerInGame = document.createElement('div')
        this.containerInGame.classList.add('chat-container')
        this.containerInGame.classList.add('chat-container-hidden')
        this.containerInGame.id = getRandomID('chat')
        this.parentElementForInGame.appendChild(this.containerInGame)
    },

    initializeBox() {
        this.box = new Box(this.parentElementForBox, pages.get('CHAT'))
        this.box.container.classList.add('box-chat-container')
        this.box.content.classList.add('box-chat-content')
    },

    initializeSocket() {
        this.socket = io(config.getItem('apiPrefix'))
        this.socket.on('messageclient', (message) => this.processMessageFromServer(message))
    },

    initializeCustomEventListeners() {
        game.mainDiv.addEventListener('login', () => this.loginChatServer())
        game.mainDiv.addEventListener('logout', () => this.logoutChatServer())
        game.mainDiv.addEventListener('username', () => this.updateUsername())
    },

    loginChatServer() {
        const authorization = {
            user: api.user,
            token: api.getToken()
        }

        this.socket.emit('loginserver', authorization, this.loginChatServerCallback)
    },

    loginChatServerCallback(error, response) {
        chat.deleteAdminMessages()
        if (error) chat.renderAndScrollMessageInBox(error)
        else chat.messages.push(response)
    },

    logoutChatServer() {
        this.socket.emit('logoutserver')
        this.deleteAdminMessages()
    },

    updateUsername() {
        this.socket.emit('updateusername')
    },

    deleteAdminMessages() {
        this.messages = this.messages.filter((message) => message.username !== 'admin')
    },

    processMessageFromServer(message) {
        this.messages.push(message)
        if (this.messages.length > this.messagesMaxNumber) this.messages.shift()

        this.renderAndScrollMessageInGame(message)
        this.renderAndScrollMessageInBox(message)
    },

    renderAndScrollMessageInGame(message) {
        if (message.username === 'admin') return 

        const html = `<p>${this.getFormattedTime(message.time)} ${message.username}: ${message.text}</p>`
        this.containerInGame.insertAdjacentHTML('beforeend', html)
        this.containerInGame.scrollTop = this.containerInGame.scrollHeight

        this.showChatInGameAndHideAfterTime()
    },

    showChatInGameAndHideAfterTime() {
        this.containerInGame.classList.remove('chat-container-hidden')

        if (this.hideChatInGameTimeoutID) clearTimeout(this.hideChatInGameTimeoutID)

        this.hideChatInGameTimeoutID = setTimeout(() => {
            this.containerInGame.classList.add('chat-container-hidden')
            this.hideChatInGameTimeoutID = undefined
        }, this.showChatInGameTime)
    },

    renderAndScrollMessageInBox(message) {
        if (!this.box.isOpen) return

        this.renderMessageInBox(message)
        if (this.isScrolledDown) this.scrollBoxMessages()
    },

    renderMessageInBox(message) {
        const html = `
            <p>
                <span class="box-dark-gray">${this.getFormattedTime(message.time)}</span>
                <span class="box-light-gray">${message.username}</span>: 
                <span ${message.username === 'admin'? 'class="box-light-gray"': ''}>${message.text}</span>
            </p>
        `

        this.$chatMessages.insertAdjacentHTML('beforeend', html)
    },

    scrollBoxMessages() {
        this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight
    },

    getFormattedTime(time) {
        const date = new Date(time)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if (minutes < 10) minutes = '0' + minutes

        return `${hours}:${minutes}`
    },

    updateScore(score) {
        this.socket.emit('updatescore', score)
    },

    openBox() {
        this.box.open()
        this.handleElements()
        this.loadAllMessagesInBox()
        this.loginChatServer()
    },

    loadAllMessagesInBox() {
        this.messages.forEach(message => this.renderMessageInBox(message))
        this.scrollBoxMessages()
        this.isScrolledDown = true
    },

    handleElements() {
        this.$chatMessages = document.getElementById('box-chat-messages')
        this.$chatMessages.innerHTML = ''
        this.$chatMessages.onscroll = () => this.chatMessagesOnScroll()

        this.$chatForm = document.getElementById('box-chat-form')
        this.$chatForm.onsubmit = (e) => this.chatFormSubmit(e)

        this.$message = document.getElementById('message')
        this.$message.value = ''
        this.$message.focus()
    },

    chatMessagesOnScroll() {
        const scrollPosition = Math.abs(this.$chatMessages.scrollHeight 
            - this.$chatMessages.scrollTop 
            - this.$chatMessages.clientHeight)
            
        const lastElementStyle = getComputedStyle(this.$chatMessages.lastElementChild)
        const lastElementMargin = parseInt(lastElementStyle.marginBottom)
        const lastElementHeight = this.$chatMessages.lastElementChild.clientHeight + lastElementMargin

        this.isScrolledDown = scrollPosition < lastElementHeight
    },

    chatFormSubmit(event) {
        event.preventDefault()

        const messageText = this.$message.value.trim()
        this.$message.value = ''
        this.$message.focus()

        if (messageText === '') return

        this.socket.emit('messageserver', {
            user: api.user,
            token: api.getToken(),
            text: messageText
        })
    },
}