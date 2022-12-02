import path from 'path'
import url from 'url'
import nodemailer from 'nodemailer'
import { config } from './config.js'

export const getFullPath = (fromPath) => {
    const __filename = url.fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    return path.join(__dirname, fromPath)
}

export const sendMail = async (emailTo, emailSubject, emailHTML) => {
    try {
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
            to: emailTo, 
            subject: emailSubject,
            html: emailHTML,
        })

        return true
        
    } catch {
        return false
    }
}