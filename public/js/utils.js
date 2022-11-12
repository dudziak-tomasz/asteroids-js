export const getRandomID = (prefix, length = 1000000) => {
    return prefix + Math.round(length * Math.random() + length)
}

export const getRandomPlusMinus = (min = 0, max = 1) => {
    if (min > max || min < 0 || max < 0) {
        return 0
    }
    let rand = (max - min) * Math.random() + min
    rand *= (Math.random() < 0.5 ? - 1 : 1)
    return rand 
}

export const getRandomInteger = (max = 10) => {
    return Math.trunc(Math.random() * max)
}

export const isMobileDevice = () => {
    return window.navigator.userAgent.toLowerCase().includes('mobi')
}

export const getScreenSize = () => {
    return screen.availWidth < screen.availHeight ? screen.availWidth : screen.availHeight
}

export const getHDRatio = () => {
    let ratio = getScreenSize() / 1080
    if (ratio < 0.7) ratio = 0.7
    if (ratio > 1.3) ratio = 1.3
    return ratio
}

export const isPointInside = (pointX, pointY, rectangleLeft, rectangleTop, rectangleWidth, rectangleHeight) => {
    return pointX > rectangleLeft && pointX < rectangleLeft + rectangleWidth &&
           pointY > rectangleTop && pointY < rectangleTop + rectangleHeight
}
