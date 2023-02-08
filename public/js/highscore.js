import { api } from './api.js'

export const highscore = {
    highscore: 0,
    achieved: false,

    initialize(parentElement) {
        this.parentElement = parentElement
        this.canvas = document.createElement('div')
        this.canvas.className = 'high-score'
        this.parentElement.appendChild(this.canvas)    

        this.initializeCustomEvents()
        this.getAndRefresh()
    },

    initializeCustomEvents () {
        this.parentElement.addEventListener('login', () => this.getAndRefresh())
        this.parentElement.addEventListener('logout', () => this.getAndRefresh())
        this.parentElement.addEventListener('username', () => this.getAndRefresh())
    },

    getAndRefresh() {
        if (api.user) {
            this.highscore = api.user.highscore
        } else {
            const hs = localStorage.getItem('highScore')
            if (hs) this.highscore = parseInt(hs)
            else this.setAndRefresh()        
        }

        this.refresh()
    },

    setAndRefresh() {
        if (api.user) api.user.highscore = this.highscore
        else localStorage.setItem('highScore', this.highscore)

        this.refresh()
    },

    refresh() {
        this.canvas.innerHTML = `${this.highscore} ${api.user ? api.user.username.toUpperCase() : ''}`
    },

}