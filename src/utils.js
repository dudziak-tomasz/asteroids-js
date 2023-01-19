import path from 'path'
import url from 'url'
import nodemailer from 'nodemailer'
import { config } from './config.js'

export const getFullPath = (fromPath) => {
    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    return path.join(__dirname, fromPath)
}

export const sendMail = async (email) => {
    // arg email = { to, subject, body }
    try {
        if (!config.getItem('emailHost')) return true
        
        let transporter = nodemailer.createTransport({
            host: config.getItem('emailHost'),
            port: config.getItem('emailPort'),
            secure: config.getItem('emailSSL'), 
            auth: {
              user: config.getItem('emailUser'), 
              pass: config.getItem('emailPassword'),
            },
          })
        
        await transporter.sendMail({
            from: config.getItem('emailSender'),
            to: email.to, 
            subject: email.subject,
            html: email.body,
        })

        return true
        
    } catch {
        return false
    }
}