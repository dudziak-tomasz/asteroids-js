export const pages = new Map()

pages.set('PREFERENCES', `
    <p class="box-title">PREFERENCES</p>
    <p class="box-title-small">SOUND VOLUME</p>
    <p><input type="range" min="0" max="1" step="0.01" id="box-slider-sound" class="slider"></p>
    <p class="box-title-small">BACKGROUND MUSIC VOLUME</p>
    <p><input type="range" min="0" max="1" step="0.01" id="box-slider-music" class="slider"></p>
    <p class="box-title-small">BACKGROUND MUSIC TRACK</p>
    <p>
        <input type="radio" id="box-radio-background1" name="box-radio-background" value="background1.mp3" class="radio">
        <label for="box-background1" id="box-label-background1">BACKGROUND1</label>
    </p>
    <p>
        <input type="radio" id="box-radio-background2" name="box-radio-background" value="background2.mp3" class="radio">
        <label for="box-background2" id="box-label-background2">BACKGROUND2</label>
    </p>
`)

pages.set('HOW TO PLAY', `
    <p class="box-title">HOW TO PLAY</p>
    <p class="box-title-small">MOUSE + KEYBOARD</p>
    <p><span class="box-light-gray">A</span> / <span class="box-light-gray">D</span> - ROTATE LEFT / RIGHT</p>
    <p><span class="box-light-gray">W</span> - ACCELERATE</p>
    <p><span class="box-light-gray">LMB</span> - FIRE</p>
    <p><span class="box-light-gray">RMB</span> - HYPERSPACE</p>
    <p class="box-title-small">KEYBOARD</p>
    <p><span class="box-light-gray">SPACE</span> - FIRE</p>
    <p><span class="box-light-gray">H</span> - HYPERSPACE</p>
    <p><span class="box-light-gray">ESCAPE</span> / <span class="box-light-gray">P</span> - PAUSE / UNPAUSE</p>
    <p class="box-title-small">TOUCH GESTURES</p>
    <p><span class="box-light-gray">SWIPE LEFT</span> / <span class="box-light-gray">RIGHT</span> - ROTATE LEFT / RIGHT</p>
    <p><span class="box-light-gray">SWIPE UP</span> - ACCELERATE</p>
    <p><span class="box-light-gray">TAP</span> / <span class="box-light-gray">PRESS</span> - FIRE / STOP ROTATE</p>
    <p><span class="box-light-gray">SWIPE DOWN</span> - HYPERSPACE</p>
`)

pages.set('ABOUT', `
    <p class="box-title">ABOUT</p>
    <p class="box-title-small">ASTEROIDS JS</p>
    <p>THE GAME IS INSPIRED BY THE ARCADE GAME <span class="box-light-gray">ASTEROIDS</span>, RELEASED IN 1979 BY ATARI INC</p>
    <p class="box-title-small">WHY JS?</p>
    <p>BECAUSE EVERY PIECE OF THE GAME WAS DEVELOPED IN <span class="box-light-gray">J</span>AVA<span class="box-light-gray">S</span>CRIPT PROGRAMMING LANGUAGE</p>
    <p class="box-title-small">CONTACT</p>
    <p><a href="mailto:asteroids@doitjs.eu">ASTEROIDS@DOITJS.EU</a></p>
`)