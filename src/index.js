import express from 'express'
import path from 'path'
import url from 'url'

const app = express()
const port = process.env.PORT || 3000

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})