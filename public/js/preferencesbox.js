import { game } from './game.js'
import { Spacetime } from './spacetime.js'
import { Box} from './box.js'
import { pages } from './pages.js'

export const preferencesBox = {
    
    audio: new Audio('/audio/fire.mp3'),

    createBox(parentElement) {
        this.box = new Box(parentElement, pages.get('PREFERENCES'))
    },

    openBox() {
        preferencesBox.box.open()
        preferencesBox.handlePreferences()
    },

    handlePreferences() {
        this.$boxSliderMusic = document.getElementById('box-slider-music')
        this.$boxSliderSound = document.getElementById('box-slider-sound')
        this.$boxRadios = document.querySelectorAll('input[name="box-radio-background"]')

        this.$boxSliderMusic.value = game.getAudioVolume()
        this.$boxSliderMusic.oninput = () => {
            const volume = parseFloat(this.$boxSliderMusic.value)
            game.setAudioVolume(volume)
            game.playAudio()
        }

        this.$boxSliderSound.value = Spacetime.getAudioVolume()
        this.$boxSliderSound.oninput = () => {
            const volume = parseFloat(this.$boxSliderSound.value)
            Spacetime.setAudioVolume(volume)
            this.audio.volume = Spacetime.audioVolume
            this.audio.play()
        }

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