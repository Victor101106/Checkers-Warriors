export async function loadAudio (src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(src)
        audio.oncanplaythrough = () => resolve(audio)
        audio.onerror = () => reject()
    })
}