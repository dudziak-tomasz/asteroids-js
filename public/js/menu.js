import { Box} from './box.js'
import { pages } from './pages.js'
import { game } from './game.js'
import { Spacetime } from './spacetime.js'

export class Menu extends Box {
    constructor(parentElement) {

        super(parentElement)

        this.container.className = 'menu-container'
        
        this.menuStart.classList.toggle('menu-x')

        this.content.className = 'menu-content'

        this.items = [{
            text: 'LOGIN',
            enabled: true
        }, {
            text: 'PROFILE',
            enabled: false
        }, {
            text: 'PREFERENCES',
            enabled: true
        }, {
            text: 'HOW TO PLAY',
            enabled: true
        }, {
            text: 'ABOUT',
            enabled: true
        }]    

        this.box = undefined

        this.audio = new Audio('../audio/fire.mp3')

        this.initializeMenuItems()
    }

    initializeMenuItems() {
        this.content.innerHTML = ''
        for (let i = 0; i < this.items.length; i++) {
            const item = document.createElement('div')
            item.className = 'menu-item'
            item.id = 'menu-item-' + i
            item.innerHTML = this.items[i].text
            if (!this.items[i].enabled) item.classList.toggle('menu-item-disabled')
            this.content.appendChild(item)
        }
    }

    menuStartClick() {
        this.menuStart.classList.toggle('menu-x')
        this.content.classList.toggle('menu-content-show')
    }

    menuItemClick(itemId) {
        this.menuStartClick()

        if (itemId === 0 || itemId === 1) {
            this.items[0].enabled = !this.items[0].enabled
            this.items[1].enabled = !this.items[1].enabled
            this.initializeMenuItems()
        }

        if (this.box) this.box.close()

        if (pages.has(this.items[itemId].text)) {
            const innerHTML = pages.get(this.items[itemId].text)
            this.box = new Box(this.parentElement, innerHTML)
            this.handlePageElements()
        } else {
            this.box = new Box(this.parentElement, `<p class="box-title">${this.items[itemId].text}</p><p>UNDER CONSTRUCTION</p>`)
        }  
    }

    handlePageElements() {
        this.$boxSliderMusic = document.getElementById('box-slider-music')
        if (this.$boxSliderMusic) {
            this.$boxSliderMusic.value = game.getAudioVolume()
            this.$boxSliderMusic.oninput = () => {
                const volume = parseFloat(this.$boxSliderMusic.value)
                game.setAudioVolume(volume)
                game.playAudio()
            }
        }

        this.$boxSliderSound = document.getElementById('box-slider-sound')
        if (this.$boxSliderSound) {
            this.$boxSliderSound.value = Spacetime.getAudioVolume()
            this.$boxSliderSound.oninput = () => {
                const volume = parseFloat(this.$boxSliderSound.value)
                Spacetime.setAudioVolume(volume)
                this.audio.volume = Spacetime.audioVolume
                this.audio.play()
            }
        }

        this.$boxRadios = document.querySelectorAll('input[name="box-radio-background"]')
        if (this.$boxRadios.length > 0) {
            const track = game.audioTrack
            this.$boxRadios.forEach((radio) => {
                if (radio.value === track) radio.checked = true
                radio.oninput = (e) => {
                    game.setAudioTrack(e.target.value)
                    game.playAudio()
                }
            })
        }
    }

    initializeEvents() {
        this.menuStart.addEventListener('click', () => this.menuStartClick())

        this.content.addEventListener('click', (event) => {
            const target = event.target.id
            if (target.startsWith('menu-item-')) this.menuItemClick(parseInt(target.replace('menu-item-', '')))
        })
    }
}