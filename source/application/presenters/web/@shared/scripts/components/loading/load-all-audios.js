import { loadAudio } from './load-audio.js'

export async function loadAllAudios() {
    
    const AUDIO_PATH = '../static/modules/match/assets/sounds'

    const audioURLArray = [ 
        `${AUDIO_PATH}/mouse-click-sound.mp3`,
        `${AUDIO_PATH}/background-sound.mp3`,
        `${AUDIO_PATH}/move-piece-sound.mp3`,
        `${AUDIO_PATH}/promotion-sound.mp3`,
        `${AUDIO_PATH}/victory-sound.mp3`,
        `${AUDIO_PATH}/defeat-sound.mp3`
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
    return url.split('/').at(-1).split('.').at(0)
}