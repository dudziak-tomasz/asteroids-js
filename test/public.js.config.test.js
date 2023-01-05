import assert from 'assert'
import { config } from '../public/js/config.js'

export const publicConfigTest = () => {

    // Should get empty api prefix
    {
        // Prepare mocks
        global.dom.reconfigure({ url: 'https://testing' })

        const apiPrefix = config.getItem('apiPrefix')
        assert.deepEqual(apiPrefix, '', 'Should get empty api prefix')
    }

    // Should get api prefix for dev server
    {
        // Prepare mock
        global.dom.reconfigure({ url: 'http://localhost' })

        const apiPrefix = config.getItem('apiPrefix')
        assert.deepEqual(apiPrefix, 'http://127.0.0.1:3000', 'Should get api prefix')
    }


    // Should get api prefix for production server
    {
        // Prepare mocks
        global.dom.reconfigure({ url: 'https://asteroids.doitjs.eu' })

        const apiPrefix = config.getItem('apiPrefix')
        assert.deepEqual(apiPrefix, 'https://asteroids.doitjs.eu:8443', 'Should get api prefix')
    }


}