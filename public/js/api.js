import { config } from './config.js'
import { game } from './game.js'

export const api = {

    user: undefined,
    parseError: { status: 499 },
    prefix: config.getItem('apiPrefix'),

    setToken(token) {
        localStorage.setItem('token', token)
    },

    getToken() {
        return localStorage.getItem('token')
    },

    removeToken() {
        localStorage.removeItem('token')
    },

    async getLeaderboard() {

        try {
            const response = await fetch(this.prefix + '/leaderboard')

            if (response.ok) {
                return await response.json()
            } else {
                return undefined
            }
    
        } catch {
            return undefined
        }
        
    },

    async newUser(user = undefined) {

        try {
            
            const response = await fetch(this.prefix + '/users/new', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })
                        
            let res = {}

            if (response.ok) {
                this.user = await response.json()
                this.setToken(this.user.token)
                game.mainDiv.dispatchEvent(new CustomEvent('login'))
            } else if (response.status === 400) {
                res = await response.json()
            }

            res.status = response.status
            
            return res
    
        } catch {
            return this.parseError
        }

    },

    async passwordReset(user) {

        try {
            
            const response = await fetch(this.prefix + '/users/passwordreset', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })
                        
            let res = {}

            if (response.status === 400) {
                res = await response.json()
            }

            res.status = response.status
            
            return res
    
        } catch {
            return this.parseError
        }

    },

    async passwordUpdate(user) {

        try {
            
            const response = await fetch(this.prefix + '/users/passwordreset', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })
                        
            let res = {}

            if (response.status === 400) {
                res = await response.json()
            }

            res.status = response.status
            
            return res
    
        } catch {
            return this.parseError
        }

    },

    async login(user) {

        try {
            const response = await fetch(this.prefix + '/users/login', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json'
                                    },
                                    body: JSON.stringify(user)
                                })

            if (response.ok && !user.test) {
                this.user = await response.json()
                this.setToken(this.user.token)
                game.mainDiv.dispatchEvent(new CustomEvent('login'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }
        
    },

    async logout() {

        try {
            const response = await fetch(this.prefix + '/users/logout', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'Bearer ' + this.getToken()
                                    }
                                })

            if (response.ok || response.status === 403) {
                this.user = undefined
                this.removeToken()
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }
        
    },

    async logoutAll() {

        try {
            const response = await fetch(this.prefix + '/users/logoutall', {
                                    method: 'POST',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'Bearer ' + this.getToken()
                                    }
                                })

            if (response.ok || response.status === 403) {
                this.user = undefined
                this.removeToken()
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            } 

            return { status: response.status }
    
        } catch {
            return this.parseError
        }
        
    },

    async profile() {

        try {
            const response = await fetch(this.prefix + '/users/me', {
                                    method: 'GET',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'Bearer ' + this.getToken()
                                    }
                                })

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

            const oldUsername = this.user.username

            const response = await fetch(this.prefix + '/users/me', {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'Bearer ' + this.getToken()
                                    },
                                    body: JSON.stringify(user)
                                })
                        
            let res = {}

            if (response.ok) {
                this.user = await response.json()
                if (oldUsername !== this.user.username) {
                    game.mainDiv.dispatchEvent(new CustomEvent('username'))
                }
            } else if (response.status === 400) {
                res = await response.json()
            } else if (response.status === 403) {
                this.user = undefined
                game.mainDiv.dispatchEvent(new CustomEvent('logout'))
            }

            res.status = response.status
            
            return res
    
        } catch {
            return this.parseError
        }

    },

    async deleteUser() {

        try {
            const response = await fetch(this.prefix + '/users/me', {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-type': 'application/json',
                                        'Authorization': 'Bearer ' + this.getToken()
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