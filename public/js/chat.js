import { config } from './config.js'
import { api } from './api.js'
import { game } from './game.js'
import { getRandomID } from './utils.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const chat = {

    messages: [],
    messagesMaxNumber: 100,
    showChatTime: 15000,
    timeoutHideID: undefined,

    createChat(parentElement) {
        this.parentElement = parentElement

        this.initializeContainerInGame()
        this.initializeBox()
        this.initializeCustomEventListeners()
        this.initializeSocket()
    },

    initializeContainerInGame() {
        this.container = document.createElement('div')
        this.container.classList.add('chat-container')
        this.container.id = getRandomID('chat')
        this.parentElement.appendChild(this.container)
    },

    initializeBox() {
        this.box = new Box(this.parentElement, pages.get('CHAT'))
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

        this.socket.emit('loginserver', authorization, (error, response) => {
            this.deleteAdminMessages()
            if (error) this.renderAndScrollMessageInBox(error)
            else this.messages.push(response)
        })
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

        const html = `<p>${this.getTime(message.time)} ${message.username}: ${message.text}</p>`
        this.container.insertAdjacentHTML('beforeend', html)
        this.container.scrollTop = this.container.scrollHeight

        this.showChatInGameIfHidden()
        this.hideChatInGameAfterTime()
    },

    showChatInGameIfHidden() {
        if (!this.timeoutHideID) this.container.classList.remove('chat-container-hidden')
        else {
            clearTimeout(this.timeoutHideID)
            this.timeoutHideID = undefined
        }
    },

    hideChatInGameAfterTime() {
        if (this.timeoutHideID) return

        this.timeoutHideID = setTimeout(() => {
            this.timeoutHideID = undefined
            this.container.classList.add('chat-container-hidden')
        }, this.showChatTime)
    },

    renderAndScrollMessageInBox(message) {
        if (!this.box.isOpen) return

        this.renderMessageInBox(message)
        if (this.isScrolledDown) this.scrollBoxMessages()
    },

    renderMessageInBox(message) {
        const html = `
            <p>
                <span class="box-dark-gray">${this.getTime(message.time)}</span>
                <span class="box-light-gray">${message.username}</span>: 
                <span ${message.username === 'admin'? 'class="box-light-gray"': ''}>${message.text}</span>
            </p>
        `

        this.$chatMessages.insertAdjacentHTML('beforeend', html)
    },

    scrollBoxMessages() {
        this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight
    },

    getTime(time) {
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
        chat.box.open()
        chat.handleElements()
        chat.loadAllMessagesInBox()
        chat.loginChatServer()
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