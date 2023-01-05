import assert from 'assert'
import { getRandomID, getRandomPlusMinus, getRandomInteger, getScreenSize, getHDRatio, isPointInside } from '../public/js/utils.js'

export const publicUtilsTest = () => {

    // Should get random ID
    {
        const id1 = getRandomID()
        const id2 = getRandomID()
        assert.notDeepEqual(id1, id2, 'Should be different ids')
    }


    // Should not generate duplicates
    {
        const ids = new Set()
        for (let i = 0; i < 1000; i++) {
            const id = getRandomID()
            assert.ok(!ids.has(id), 'Should not generate duplicates')
            ids.add(id)
        }
    }


    // Should starts with prefix
    {
        const id = getRandomID('test')
        assert.ok(id.startsWith('test'), 'Should starts with prefix test')
    }


    // Should get random positive or negative number from a given range
    {
        const x1 = 1.2
        const x2 = 3.8
        const x = getRandomPlusMinus(x1, x2)
        const xTest = (-x2 <= x && x <= -x1) || (x1 <= x && x <= x2)
        assert.ok(xTest, 'Should be positive or negative number from a given range')
    }


    // Should get random natural number less than given one
    {
        const iMax = 20
        const i = getRandomInteger(iMax)
        assert.deepEqual(typeof i, 'number', 'Should be a number')
        assert.deepEqual(i, Math.trunc(i), 'Should be integer')
        assert.ok(0 <= i && i < iMax, 'Should be less than 20')
    }


    // Should get smaller value of screen size
    {
        // Prepare mocks
        global.screen = {
            availWidth: 1920,
            availHeight: 1080    
        }

        const size1 = getScreenSize()
        assert.deepEqual(size1, 1080, 'Should be smaller value of screen.availWidth and screen.availHeight')

        global.screen = {
            availWidth: 400,
            availHeight: 1000    
        }
        const size2 = getScreenSize()
        assert.deepEqual(size2, 400, 'Should be smaller value of screen.availWidth and screen.availHeight')

        // Delete mocks
        delete global.screen
    }


    // Should get ratio between 0.7 and 1.3
    {
        // Prepare mocks
        global.screen = {
            availWidth: 1920,
            availHeight: 1080    
        }

        const ratio1 = getHDRatio()
        assert.ok(0.7 <= ratio1 && ratio1 <= 1.3, 'Should get ratio between 0.7 and 1.3')

        global.screen = {
            availWidth: 10000,
            availHeight: 10000    
        }

        const ratio2 = getHDRatio()
        assert.ok(0.7 <= ratio2  && ratio2 <= 1.3, 'Should get ratio between 0.7 and 1.3')

        global.screen = {
            availWidth: 400,
            availHeight: 400    
        }

        const ratio3 = getHDRatio()
        assert.ok(0.7 <= ratio3  && ratio3 <= 1.3, 'Should get ratio between 0.7 and 1.3')

        // Delete mocks
        delete global.screen
    }

    // Should be point inside rectangle
    {
        const point = {
            x: 50,
            y: 60
        }
        const rect = {
            left: 20,
            top: 30,
            width: 100,
            height: 100
        }

        let isInside = isPointInside(point.x, point.y, rect.left, rect.top, rect.width, rect.height)
        assert.ok(isInside, 'Should be inside rectangle')

        rect.width = 31
        isInside = isPointInside(point.x, point.y, rect.left, rect.top, rect.width, rect.height)
        assert.ok(isInside, 'Should be inside rectangle')

        rect.height = 31
        isInside = isPointInside(point.x, point.y, rect.left, rect.top, rect.width, rect.height)
        assert.ok(isInside, 'Should be inside rectangle')

        rect.width = 30
        isInside = isPointInside(point.x, point.y, rect.left, rect.top, rect.width, rect.height)
        assert.ok(!isInside, 'Should not be inside rectangle')
    }

}