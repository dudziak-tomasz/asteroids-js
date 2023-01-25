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
        this.$boxSliderSound = document.getElementById('box-slider-sound')
        this.$boxSliderSound.value = Spacetime.getAudioVolume()
        this.$boxSliderSound.oninput = () => this.sliderSoundInput()

        this.$boxSliderMusic = document.getElementById('box-slider-music')
        this.$boxSliderMusic.value = game.getAudioVolume()
        this.$boxSliderMusic.oninput = () => this.sliderMusicInput()

        this.$boxRadioTracks = document.getElementsByName('box-radio-track')
        this.$boxRadioTracks.forEach(radioTrack => this.setRadioTrack(radioTrack))
    },

    sliderSoundInput() {
        const volume = parseFloat(this.$boxSliderSound.value)
        Spacetime.setAudioVolume(volume)
        this.audio.volume = Spacetime.audioVolume
        this.audio.play()
    },

    sliderMusicInput() {
        const volume = parseFloat(this.$boxSliderMusic.value)
        game.setAudioVolume(volume)
        game.playAudio()
    },

    setRadioTrack(radioTrack) {
        radioTrack.checked = radioTrack.value === game.audioTrack
        radioTrack.oninput = (e) => this.radioTrackInput(e.target.value)
    },

    radioTrackInput(audioTrack) {
        game.setAudioTrack(audioTrack)
        game.playAudio()
    }
}