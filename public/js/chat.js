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

        this.container = document.createElement('div')
        this.container.classList.add('chat-container')
        this.container.id = getRandomID('chat')
        this.parentElement.appendChild(this.container)

        this.box = new Box(parentElement, pages.get('CHAT'))
        this.box.container.classList.add('box-chat-container')
        this.box.content.classList.add('box-chat-content')

        this.socket = io(config.getItem('apiPrefix'))

        this.socket.on('messageclient', (message) => this.messageClient(message))

        this.initializeEvents()
    },

    openBox() {
        chat.box.open()
        chat.handleChatBox()
    },

    getTime(time) {
        const date = new Date(time)
        const hours = date.getHours()
        let minutes = date.getMinutes()
        if (minutes < 10) minutes = '0' + minutes

        return `${hours}:${minutes}`
    },

    messageClient(message) {
        this.messages.push(message)
        if (this.messages.length > this.messagesMaxNumber) this.messages.shift()

        this.showChat()
        
        this.container.insertAdjacentHTML('beforeend', `<p>${this.getTime(message.time)} ${message.username}: ${message.text}</p>`)

        this.scrollMessages()
        this.hideChat()

        this.renderAndScrollMessageIfChatBoxOpen(message)
    },

    renderMessage(message) {
        const html = `
            <p>
                <span class="box-dark-gray">${this.getTime(message.time)}</span>
                <span class="box-light-gray">${message.username}</span>: 
                <span ${message.username === 'admin'? 'class="box-light-gray"': ''}>${message.text}</span>
            </p>
        `

        this.$chatMessages.insertAdjacentHTML('beforeend', html)
    },

    renderAndScrollMessageIfChatBoxOpen(message) {
        if (this.box.isOpen) {
            this.renderMessage(message)
            if (this.isScrollBottom) this.scrollBoxMessages()
        }
    },

    scrollMessages() {
        this.container.scrollTop = this.container.scrollHeight
    },

    scrollBoxMessages() {
        this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight
    },

    hideChat() {
        if (this.timeoutHideID) return

        this.timeoutHideID = setTimeout(() => {
            this.timeoutHideID = undefined
            this.container.classList.add('chat-container-hidden')
        }, this.showChatTime)
    },

    showChat() {
        if (this.timeoutHideID) {
            clearTimeout(this.timeoutHideID)
            this.timeoutHideID = undefined
        } else {
            this.container.classList.remove('chat-container-hidden')
        }
    },

    handleChatBox() {
        this.isScrollBottom = true
        this.$chatMessages = document.getElementById('box-chat-messages')
        this.$chatForm = document.getElementById('box-chat-form')

        this.loginChatServer()

        this.messages.forEach(message => this.renderMessage(message))
        this.scrollBoxMessages()

        this.$chatForm.message.focus()

        this.$chatForm.onsubmit = (e) => {
            e.preventDefault()

            const messageText = this.$chatForm.message.value.trim()
            if (messageText !== '') {

                const message = {
                    user: api.user,
                    token: api.getToken(),
                    text: messageText
                }

                this.socket.emit('messageserver', message)
            }

            this.$chatForm.message.value = ''
            this.$chatForm.message.focus()
        }

        this.$chatMessages.onscroll = () => {
            const scrollPosition = Math.abs(this.$chatMessages.scrollHeight - this.$chatMessages.scrollTop - this.$chatMessages.clientHeight)
            
            const lastElementStyle = getComputedStyle(this.$chatMessages.lastElementChild)
            const lastElementMargin = parseInt(lastElementStyle.marginBottom)
            const lastElementHeight = this.$chatMessages.lastElementChild.clientHeight + lastElementMargin

            this.isScrollBottom = scrollPosition < lastElementHeight
        }
    },

    loginChatServer() {
        const data = {
            user: api.user,
            token: api.getToken()
        }

        this.socket.emit('loginserver', data, (error, response) => {
            this.deleteAdminMessages()
            if (!error) {
                this.messages.push(response)
            } else {
                this.renderAndScrollMessageIfChatBoxOpen(error)
            }
        })
    },

    logoutChatServer() {
        this.socket.emit('logoutserver')
        this.deleteAdminMessages()
    },

    deleteAdminMessages() {
        this.messages = this.messages.filter((message) => message.username !== 'admin')
    },

    updateScore(score) {
        this.socket.emit('updatescore', score)
    },

    updateUsername() {
        this.socket.emit('updateusername')
    },

    initializeEvents() {
        game.mainDiv.addEventListener('login', () => this.loginChatServer())
        game.mainDiv.addEventListener('logout', () => this.logoutChatServer())
        game.mainDiv.addEventListener('username', () => this.updateUsername())
    }

}