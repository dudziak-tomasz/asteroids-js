import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
import { config } from './config.js'
import { api } from './api.js'
import { game } from './game.js'
import { getRandomID, isMobileDevice } from './utils.js'

export const chat = {

    messages: [],
    messagesMaxNumber: 100,
    showChatTime: 15000,
    timeoutHideID: undefined,
    isChatBox: false, 

    createChat(parentElement) {

        this.parentElement = parentElement

        this.container = document.createElement('div')
        this.container.classList.add('chat-container')
        this.container.id = getRandomID('chat')
        this.parentElement.appendChild(this.container)

        this.socket = io(config.getItem('apiPrefix'))

        this.socket.on('messageclient', (message) => this.messageClient(message))

        this.initializeEvents()

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

        if (this.isChatBox) {
            this.renderChatBoxMessage(message)
        }
    },

    renderChatBoxMessage(message) {
        const html = `
            <p>
                <span class="box-dark-gray">${this.getTime(message.time)}</span>
                <span class="box-light-gray">${message.username}</span>: 
                <span ${message.username === 'admin'? 'class="box-light-gray"': ''}>${message.text}</span>
            </p>
        `

        this.$chatMessages.insertAdjacentHTML('beforeend', html)
        this.scrollBoxMessages()
    },

    scrollMessages() {
        this.container.scrollTop = this.container.scrollHeight
    },

    scrollBoxMessages() {
        const $lastMessage = this.$chatMessages.lastElementChild

        const lastMessageStyles = getComputedStyle($lastMessage)
        const lastMessageMargin = parseInt(lastMessageStyles.marginBottom)
        const lastMessageHeight = $lastMessage.offsetHeight + lastMessageMargin
        
        const visibleHeight = this.$chatMessages.offsetHeight
        const containerHeight = this.$chatMessages.scrollHeight
        const scrollOffset = this.$chatMessages.scrollTop + visibleHeight
    
        if (containerHeight - lastMessageHeight <= scrollOffset || isMobileDevice()) {
            this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight
        }
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
        this.isChatBox = true
        this.$chatMessages = document.getElementById('box-chat-messages')
        this.$chatForm = document.getElementById('box-chat-form')

        if (this.messages.length === 0) {
            this.messages.push({ username: 'admin', text:'welcome!', time: Date.now() })
        }
            
        this.messages.forEach(message => this.renderChatBoxMessage(message))

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
                this.$chatMessages.scrollTop = this.$chatMessages.scrollHeight
            }

            this.$chatForm.message.value = ''
            this.$chatForm.message.focus()
        }

    },

    initializeEvents() {
        game.mainDiv.addEventListener('boxclose', (e) => {
            if (e.detail && e.detail.name === 'CHAT') {
                this.isChatBox = false   
            }
        })
    }

}