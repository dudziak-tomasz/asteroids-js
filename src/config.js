import fs from 'fs'
import { getFullPath } from './utils.js'

export const config = {

    configReady: false,
    values: {},

    getConfigFromFile() {
        try {
            const filePath = getFullPath('../config/config.json')
            const dataBuffer = fs.readFileSync(filePath)
            const dataJSON = dataBuffer.toString()
            const dataParsed = JSON.parse(dataJSON)

            if (process.argv[2] === '--dev') this.values = dataParsed.development
            else if (process.argv[2] === '--test') this.values = dataParsed.test
            else this.values = dataParsed.production

        } catch (e) {
            console.log('I cannot load the file config/config.json')
            console.log(e)
         }

        this.configReady = true
    },

    getItem(keyName) {
        if (!this.configReady) this.getConfigFromFile()

        return this.values[keyName]
    }
}