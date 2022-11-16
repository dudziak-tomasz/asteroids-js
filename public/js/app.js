import { game } from './game.js'
import { Menu } from './menu.js'

const app = () => {

    // Start game
    game.createGame(document.body)

    new Menu(document.body)

    // Events
    document.body.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })

    document.body.addEventListener('mousedown', (event) => {
        const target = event.target.id
        if (target.startsWith('menu-') || target.startsWith('box-')) return
        game.eventMouseDown(event)
    })

    document.body.addEventListener('mouseup', (event) => {
        const target = event.target.id
        if (target.startsWith('menu-') || target.startsWith('box-')) return
        game.eventMouseUp(event)
    })

    document.body.addEventListener('keydown', (event) => game.eventKeyDown(event))

    document.body.addEventListener('keyup', (event) => game.eventKeyUp(event))

    document.body.addEventListener('touchstart', (event) => {
        if (event.target.id.startsWith('menu-')) return
        game.eventTouchStart(event)
    })
        
    document.body.addEventListener('touchmove', (event) => {
        if (event.target.id.startsWith('menu-')) return
        game.eventTouchMove(event)
    })
        
    document.body.addEventListener('touchend', (event) => {
        if (event.target.id.startsWith('menu-')) return
        game.eventTouchEnd(event)
    })
        
    window.addEventListener('orientationchange', (event) => game.eventOrientationChange(event))

}

window.onload = app
