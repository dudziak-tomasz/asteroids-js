import path from 'path'
import url from 'url'

export const getFullPath = (fromPath) => {
    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    return path.join(__dirname, fromPath)
}