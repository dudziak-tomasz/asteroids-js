import jsdom from 'jsdom'

const { JSDOM } = jsdom
const dom = new JSDOM()

global.dom = dom
global.window = dom.window
global.document = dom.window.document

global.screen = {
    availWidth: 1920,
    availHeight: 1080    
}

global.localStorage = {
    storage: new Map(),
    setItem(key, value) {
        this.storage.set(key, value)
    },
    getItem(key) {
        return this.storage.get(key)
    },
    removeItem(key) {
        this.storage.delete(key)
    }
}

global.Audio = class {
    constructor(src) {
        this.src = src
        this.isPlaying = false
    }
    play() {
        this.isPlaying = true
    }
    pause() {
        this.isPlaying = false
    }

}