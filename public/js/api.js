export const api = {

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
                return await response.json()
            } else {
                // return {
                //     error: "",
                //     status: response.status
                // }
                return undefined
            }
    
        } catch {
            return undefined
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

            if (response.ok) {
                return response.status
            } else {
                return undefined
            }
    
        } catch {
            return undefined
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

            if (response.ok) {
                return response.status
            } else {
                return undefined
            }
    
        } catch {
            return undefined
        }
        
    },

    async profile() {

        try {
            const response = await fetch('/users/me')

            if (response.ok) {
                return await response.json()
            } else {
                return undefined
            }
    
        } catch {
            return undefined
        }

    }

}