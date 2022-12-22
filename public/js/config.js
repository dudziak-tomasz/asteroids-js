export const config = {

    getItem(item) {
        if (item === 'apiPrefix') {
            const url = new URL(window.location.href)

            let prefix = url.protocol + '//'
            // if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') prefix += 'localhost:' + (url.protocol === 'http:' ? 3000 : 3443)
            if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') prefix += '127.0.0.1:' + (url.protocol === 'http:' ? 3000 : 3443)
            else if (url.hostname.includes('asteroids')) prefix += 'asteroids.doitjs.eu:' + (url.protocol === 'http:' ? 8080 : 8443)
            else prefix = ''

            return prefix
        }

        return undefined
    }

}