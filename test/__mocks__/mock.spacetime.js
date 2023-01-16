import { Spacetime } from '../../public/js/spacetime.js'

Spacetime.startMock = Spacetime.start
Spacetime.start = () => {}
Spacetime.getWidth = () => 1920
Spacetime.getHeight = () => 1080