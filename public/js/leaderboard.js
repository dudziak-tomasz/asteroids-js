import { api } from './api.js'

export const leaderboard = {
    
    initialize(parentElement) {
        this.canvas = document.createElement('div')
        this.canvas.className = 'leaderboard-hidden'
        parentElement.appendChild(this.canvas)    
    },

    async show() {
        this.leaderboard = await api.getLeaderboard()
        if (!this.leaderboard) return

        let innerHTML = '<table class="leaderboard-table">'

        this.leaderboard.forEach((leader) => innerHTML += `
            <tr>
            <td class="leader-score box-light-gray">${leader.highscore}</td>
            <td class="leader-name">${leader.username.toUpperCase()}</td>
            </tr>
        `)

        innerHTML += '</table>'
        this.canvas.innerHTML = innerHTML
        this.canvas.className = 'leaderboard'    
    },

    hide() {
        this.canvas.className = 'leaderboard-hidden'
    },

}