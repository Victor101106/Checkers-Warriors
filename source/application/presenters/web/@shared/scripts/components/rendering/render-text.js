export class RenderText {

    constructor(canvas, context) {
        this.context = context
        this.canvas = canvas
    }

    render(text, sprite, left, top, width, height, align, baseline) {
        RenderText.render(text, this.context, sprite, left, top, width, height, align, baseline)
    }

    static render(text, context, sprite, left, top, width, height, align, baseline) {

        text = text.toLowerCase()

        const characterPerLine = Math.floor((width + 1) / 4)

        const linesCount  = Math.min(Math.ceil(text.length / characterPerLine), Math.floor((height + 1) / 6))
        const linesHeight = Math.min(linesCount * 6 - 1, height)

        const translateLeft = align == 'center' ? 1 / 2 : (align == 'right') ? 1 : 0
        const translateTop  = baseline == 'center' ? 1 / 2 : (baseline == 'bottom') ? 1 : 0
        
        const startLeft = Math.floor(left + width * translateLeft)
        const startTop  = Math.floor(top  + height * translateTop)
        
        let characterIndex = 0

        for (let line = 0; line < linesCount; line++) {
            
            const lineWidth = (line == linesCount - 1 ? text.substring(line * characterPerLine, line * characterPerLine + characterPerLine).length : characterPerLine) * 4 - 1
            
            const lineLeft = Math.round(startLeft - lineWidth * translateLeft)
            const lineTop  = Math.round(startTop - linesHeight * translateTop + line * 6)
            
            for (let characterPosition = 0; characterPosition < characterPerLine && characterIndex < text.length; characterPosition++) {
                
                const characterCode = text.at(characterIndex).charCodeAt(0)
                const characterType = characterCode >= 48 && characterCode <= 57 ? 27 + characterCode - 48 : (characterCode >= 97 && characterCode <= 122 ? characterCode - 97 : 26)

                characterCode != 32 && context.drawImage(sprite, characterType * 3, 0, 3, 5, lineLeft + 4 * characterPosition, lineTop, 3, 5) 
                characterIndex += 1

            }

        }
        
    }

}