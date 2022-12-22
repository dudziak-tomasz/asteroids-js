import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'
import { config } from './config.js'
import { api } from './api.js'
import { getRandomID } from './utils.js'

export const chat = {

    showChatTime: 15000,
    timeoutHideID: undefined,

    createChat(parentElement) {

        this.parentElement = parentElement

        this.container = document.createElement('div')
        this.container.classList.add('chat-container')
        this.container.id = getRandomID('chat')
        this.parentElement.appendChild(this.container)

        this.socket = io(config.getItem('apiPrefix'))

        this.socket.on('messageclient', (message) => this.messageClient(message))

    },

    messageClient(message) {
        this.showChat()
        // console.log(message)
        this.container.innerHTML += `<p>${message}</p>`

        this.scrollMessages()
        this.hideChat()
    },

    scrollMessages() {
        this.container.scrollTop = this.container.scrollHeight
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
    }

}