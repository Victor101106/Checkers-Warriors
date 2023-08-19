export async function loadImage (src) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload  = () => resolve(image)
        image.onerror = () => reject()
        image.src = src
    })
}