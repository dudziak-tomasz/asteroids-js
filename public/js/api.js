export const api = {
    async getLeaderboard() {
        try {
            const response = await fetch('/leaderboard')

            const leaderboard = await response.json()

            if (response.ok) return leaderboard
            else return undefined
    
        } catch (e) {
            return undefined
        }
        
    }
}