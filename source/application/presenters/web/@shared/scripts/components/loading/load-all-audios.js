import { loadAudio } from './load-audio.js'

export async function loadAllAudios() {
    
    const AUDIO_PATH = '../static/@shared/assets/audios'

    const audioURLArray = [ 
        `${AUDIO_PATH}/mouse-click-audio.mp3`,
        `${AUDIO_PATH}/move-piece-audio.mp3`,
        `${AUDIO_PATH}/promotion-audio.mp3`,
        `${AUDIO_PATH}/victory-audio.mp3`,
        `${AUDIO_PATH}/defeat-audio.mp3`
    ]

    try {

        const audioArray  = await Promise.all(audioURLArray.map(url => loadAudio(url)))
        const audioObject = Object.fromEntries(audioArray.map(audio => [extractFilenameFromUrl(audio.src), audio]))
    
        return audioObject

    } catch (error) {
        
        console.error('Error loading audios:', error.message, error.url)
        
        throw error

    }

}

function extractFilenameFromUrl(url) {
    
    const fullFilename = url.split('/').at(-1).split('.').at(0)

    return fullFilename.substring(0, fullFilename.length - '-audio'.length)

}