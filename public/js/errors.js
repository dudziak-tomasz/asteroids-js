export const errors = {
    
    NotLogged: `YOU'RE NOT LOGGED IN... PLEASE LOG IN`,
    ConnectionProblem: 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER',
    UsernameInvalid: 'MINIMUM 3 CHARACTERS, ONLY LETTERS, NUMBERS AND UNDERSCORES',
    PasswordInvalid: 'MINIMUM 8 CHARACTERS, 1 CAPITAL LETTER, 1 SMALL LETTER, 1 NUMBER',
    UsernameOrPasswordIncorect: 'USERNAME OR PASSWORD IS INCORECT. PLEASE TRY AGAIN.',
    PasswordResetFail: 'PASSWORD RESET FAILED. PLEASE TRY AGAIN LATER.',
    CapsLock: 'CAPS LOCK IS ON!',

    getCapsLockError(event) {
        return event.getModifierState("CapsLock") ? this.CapsLock : ''
    }
}