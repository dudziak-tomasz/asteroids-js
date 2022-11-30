import { game } from './game.js'

export const api = {

    user: undefined,
    parseError: { status: 499 },

    async getLeaderboard() {

        try {
            const response = await fetch('/leaderboard')

            if (response.ok) {
                return await response.json()
            } else {
                return undefined
            }
    
        } catch {
            return undefined
        }
        
    },

    async login(user) {

        try {
            const response = await fetch('/users/login', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })

            if (response.ok) {
                this.user = await response.json()
                game.mainDiv.dispatchEvent(new CustomEvent('login'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }
        
    },

    async logout() {

        try {
            const response = await fetch('/users/logout', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                })

            if (response.ok || response.status === 403) {
                this.user = undefined
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }
        
    },

    async logoutAll() {

        try {
            const response = await fetch('/users/logoutall', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                })

            if (response.ok || response.status === 403) {
                this.user = undefined
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }
        
    },

    async profile() {

        try {
            const response = await fetch('/users/me')

            if (response.ok) {
                this.user = await response.json()
                game.mainDiv.dispatchEvent(new CustomEvent('login'))
            } else {
                this.user = undefined
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            }

            return { status: response.status }
    
        } catch {
            return this.parseError
        }

    },

    async updateUser(user = undefined) {

        try {
            if (!user) user = { highscore: this.user.highscore }

            const response = await fetch('/users/me', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })
                        
            if (response.ok) {
                this.user = await response.json()
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }

    },

    async deleteUser() {

        try {
            const response = await fetch('/users/me', {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                })

            if (response.ok || response.status === 403) {
                this.user = undefined
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }

    }

}