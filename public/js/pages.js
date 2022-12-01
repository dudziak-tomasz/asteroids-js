export const pages = new Map()

pages.set('LOGIN', `
    <p class="box-title">LOGIN</p>
    <form id="box-login-form">
        <p>USERNAME<br>
            <input type="text" name="username" maxlength="20" autocomplete="off"></p>
        <p>PASSWORD<br>
            <input type="password" name="password"></p>
        <p><button name="submit">LOGIN</button></p>
        <p id="box-error-message"></p>
    </form>
`)

pages.set('CHANGE PASSWORD', `
    <p class="box-title">CHANGE PASSWORD</p>
    <form id="box-change-password-form">
        <p>CURRENT PASSWORD<br>
            <input type="password" name="currentPassword"></p>
        <p>NEW PASSWORD<br>
            <input type="password" name="newPassword"></p>
        <p>RETYPE NEW PASSWORD<br>
            <input type="password" name="retypeNewPassword"></p>
        <p><button name="submit">CHANGE PASSWORD</button></p>
        <p id="box-error-message"></p>
    </form>
`)

pages.set('PROFILE', `
    <p class="box-title">PROFILE</p>
    <p id="box-profile-error-message"></p>
    <div id="box-profile-div" style="display: none">
        <form id="box-profile-form">
            <p><span class="profile-label">USERNAME</span><span><input type="text" name="username" maxlength="20" autocomplete="off"></span></p>
            <p><span class="profile-label">EMAIL</span><span><input type="text" name="email" autocomplete="off"></span></p>
            <p><span class="profile-label">HIGSCORE</span><span><input type="text" name="highscore" disabled></span></p>
            <p><button type="submit" name="submit">SAVE</button> <button id="box-logout-button">LOGOUT</button></p>
            <p id="box-error-message"></p>
        </form>
        <p class="box-title-small">SECURITY</p>
        <p>IF YOU SUSPECT YOUR ACCOUNT HAS BEEN COMPROMISED, CHANGE YOUR PASSWORD AND LOGOUT ALL DEVICES.</p>
        <p><a id="box-change-password-button">CHANGE PASSWORD</a> <a id="box-logoutall-button">LOGOUT ALL DEVICES</a></p>
        <p id="box-logoutall-error-message"></p>
        <p class="box-title-small">MANAGE ACCOUT</p>
        <p><a id="box-close-account-button">CLOSE MY ACCOUNT</a></p>
        <p id="box-close-message" style="display: none">ARE YOU SURE? <a id="box-close-yes">YES</a> <a id="box-close-no">NO</a></p>
        <p id="box-close-error-message"></p>
    </div>
`)

pages.set('PREFERENCES', `
    <p class="box-title">PREFERENCES</p>
    <p class="box-title-small">SOUND VOLUME</p>
    <p><input type="range" min="0" max="1" step="0.01" id="box-slider-sound" class="slider"></p>
    <p class="box-title-small">BACKGROUND MUSIC VOLUME</p>
    <p><input type="range" min="0" max="1" step="0.01" id="box-slider-music" class="slider"></p>
    <p class="box-title-small">BACKGROUND MUSIC TRACK</p>
    <p>
        <label class="radio-label">
            <input type="radio" id="box-radio-background1" name="box-radio-background" value="background1.mp3" class="radio">
            BACKGROUND1
        </label>
    <p>
    </p>
        <label class="radio-label">
            <input type="radio" id="box-radio-background2" name="box-radio-background" value="background2.mp3" class="radio">
            BACKGROUND2
        </label>
        <p>
        </p>
            <label class="radio-label">
            <input type="radio" id="box-radio-background3" name="box-radio-background" value="background3.mp3" class="radio">
            BACKGROUND3
        </label>
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
    <p><span class="box-light-gray">P</span> - PAUSE / UNPAUSE</p>
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