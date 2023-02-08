export const alert = {
    
    initialize(parentElement) {
        this.canvas = document.createElement('div')
        this.canvas.className = 'alert'
        parentElement.appendChild(this.canvas)    
    },

    show(alertHTML) {
        this.canvas.innerHTML = alertHTML
        this.canvas.className = 'alert'
    },

    hide() {
        this.canvas.className = 'alert-hidden'
    },
}