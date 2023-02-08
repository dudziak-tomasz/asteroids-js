import jsdom from 'jsdom'

const { JSDOM } = jsdom
const dom = new JSDOM()

global.dom = dom
global.window = dom.window
global.document = dom.window.document
global.CustomEvent = dom.window.CustomEvent

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
    },
    clear() {
        this.storage = new Map()
    }
}

global.Audio = class {
    constructor(src) {
        this.src = src
        this.isPlaying = false
        this.volume = 1
    }
    play() {
        this.isPlaying = true
    }
    pause() {
        this.isPlaying = false
    }
}
