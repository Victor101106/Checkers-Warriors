import { loadImage } from './load-image.js'

export async function loadAllImages() {
    
    const IMAGE_PATH = '../static/modules/match/assets/images'

    const imageURLArray = [ 
        `${IMAGE_PATH}/section-separator.png`,
        `${IMAGE_PATH}/characters-green.png`,
        `${IMAGE_PATH}/indicator-move-1.png`,
        `${IMAGE_PATH}/indicator-move-2.png`,
        `${IMAGE_PATH}/indicator-move-3.png`,
        `${IMAGE_PATH}/language-switch.png`,
        `${IMAGE_PATH}/character-colon.png`,
        `${IMAGE_PATH}/character-cross.png`,
        `${IMAGE_PATH}/character-lines.png`,
        `${IMAGE_PATH}/indicator-right.png`,
        `${IMAGE_PATH}/profile-picture.png`,
        `${IMAGE_PATH}/selection-piece.png`,
        `${IMAGE_PATH}/selection-queen.png`,
        `${IMAGE_PATH}/selection-crown.png`,
        `${IMAGE_PATH}/loss-text-black.png`,
        `${IMAGE_PATH}/loss-text-white.png`,
        `${IMAGE_PATH}/indicator-jump.png`,
        `${IMAGE_PATH}/indicator-slot.png`,
        `${IMAGE_PATH}/characters-red.png`,
        `${IMAGE_PATH}/indicator-left.png`,
        `${IMAGE_PATH}/selection-jump.png`,
        `${IMAGE_PATH}/selection-spot.png`,
        `${IMAGE_PATH}/won-text-white.png`,
        `${IMAGE_PATH}/won-text-black.png`,
        `${IMAGE_PATH}/check-box-off.png`,
        `${IMAGE_PATH}/check-box-on.png`,
        `${IMAGE_PATH}/piece-crown.png`,
        `${IMAGE_PATH}/piece-black.png`,
        `${IMAGE_PATH}/piece-white.png`,
        `${IMAGE_PATH}/particle-01.png`,
        `${IMAGE_PATH}/particle-02.png`,
        `${IMAGE_PATH}/particle-03.png`,
        `${IMAGE_PATH}/particle-04.png`,
        `${IMAGE_PATH}/particle-05.png`
    ]

    try {

        const imageArray  = await Promise.all(imageURLArray.map(url => loadImage(url)))
        const imageObject = Object.fromEntries(imageArray.map(image => [extractFilenameFromUrl(image.src), image]))
    
        return imageObject

    } catch (error) {
        
        console.error('Error loading images:', error.message, error.url)
        
        throw error

    }

}

function extractFilenameFromUrl(url) {
    return url.split('/').at(-1).split('.').at(0)
}