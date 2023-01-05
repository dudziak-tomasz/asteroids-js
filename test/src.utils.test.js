import assert from 'assert'
import { argv } from 'process'
import { getFullPath, sendMail } from '../src/utils.js'

export const utilsTest = () => {

    // Should get full path to file
    {
        const fullPath = getFullPath('../test/test.js')
        assert.deepEqual(fullPath, argv[1], 'Should get full path to file test.js')
    }

    // Should send email
    {
        const isSend = sendMail('test@doitjs.eu', 'Test subject', 'Test body')
        assert.ok(isSend, 'Should send email')
    }

}