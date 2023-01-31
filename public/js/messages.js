export const messages = {

    CapsLock: 'CAPS LOCK IS ON!',
    ConnectionProblem: 'CONNECTION PROBLEM... PLEASE TRY AGAIN LATER',
    NotLogged: `YOU'RE NOT LOGGED IN... PLEASE LOG IN`,

    ForPasswordResetOnly: 'FOR PASSWORD RESET ONLY',
    IncorrectCurrentPassword: 'INCORRECT CURRENT PASSWORD...',
    PasswordInvalid: 'MINIMUM 8 CHARACTERS, 1 CAPITAL LETTER, 1 SMALL LETTER, 1 NUMBER',
    PasswordResetFail: 'PASSWORD RESET FAILED. PLEASE TRY AGAIN LATER.',
    NewPasswordNotMatchRetyped: 'NEW PASSWORD DOES NOT MATCH RETYPED PASSWORD',
    NewPasswordShouldBeDifferent: 'NEW PASSWORD SHOULD BE DIFFERENT FROM CURRENT PASSWORD',

    UsernameInvalid: 'MINIMUM 3 CHARACTERS, ONLY LETTERS, NUMBERS AND UNDERSCORES',
    UsernameOrPasswordIncorect: 'USERNAME OR PASSWORD IS INCORECT. PLEASE TRY AGAIN.',

    getCapsLockError(event) {
        return event.getModifierState("CapsLock") ? this.CapsLock : ''
    }
}