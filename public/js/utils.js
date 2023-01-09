const id8 = () => Math.random().toString(36).substring(2, 10)

export const getRandomID = (prefix = 'id') => {
    return `${prefix}-${id8()}-${id8()}-${id8()}-${id8()}`
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

export const getScreenSize = () => {
    return screen.availWidth < screen.availHeight ? screen.availWidth : screen.availHeight
}

export const getHDRatio = () => {
    let ratio = getScreenSize() / 1080
 
    ratio = Math.max(ratio, 0.7)
    ratio = Math.min(ratio, 1.3)

    return ratio
}

export const isPointInsideRectangle = (point, rectangle) => {
    return rectangle.left < point.x && point.x < rectangle.left + rectangle.width &&
           rectangle.top < point.y  && point.y < rectangle.top + rectangle.height
}
