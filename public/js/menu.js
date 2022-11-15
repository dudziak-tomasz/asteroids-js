import { Box} from './box.js'

export class Menu extends Box {
    constructor(parentElement) {

        super(parentElement)

        this.container.className = 'menu-container'
        
        this.menuStart.classList.toggle('menu-x')

        this.content.className = 'menu-content'

        this.items = [{
            text: 'LOGIN',
            enabled: true
        }, {
            text: 'PROFILE',
            enabled: false
        }, {
            text: 'PREFERENCES',
            enabled: true
        }, {
            text: 'HOW TO PLAY',
            enabled: true
        }, {
            text: 'ABOUT',
            enabled: true
        }]    

        this.box = undefined

        this.initializeMenuItems()
    }

    initializeMenuItems() {
        this.content.innerHTML = ''
        for (let i = 0; i < this.items.length; i++) {
            const item = document.createElement('div')
            item.className = 'menu-item'
            item.id = 'menu-item-' + i
            item.innerHTML = this.items[i].text
            if (!this.items[i].enabled) item.classList.toggle('menu-item-disabled')
            this.content.appendChild(item)
        }
    }

    menuStartClick() {
        this.menuStart.classList.toggle('menu-x')
        this.content.classList.toggle('menu-content-show')
    }

    menuItemClick(itemId) {
        this.menuStartClick()
        // console.log(this.items[itemId])

        if (itemId === 0 || itemId === 1) {
            this.items[0].enabled = !this.items[0].enabled
            this.items[1].enabled = !this.items[1].enabled
            this.initializeMenuItems()
        }

        if (this.box) this.box.close()
        this.box = new Box(this.parentElement, `<h1>${this.items[itemId].text}</h1><p><input type="range" min="0" max="100" value="50" id="menu-slider"></p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`)
    }

    initializeEvents() {
        this.menuStart.addEventListener('click', () => this.menuStartClick())

        this.content.addEventListener('click', (event) => {
            const target = event.target.id
            if (target.startsWith('menu-item-')) this.menuItemClick(parseInt(target.replace('menu-item-', '')))
        })
    }
}