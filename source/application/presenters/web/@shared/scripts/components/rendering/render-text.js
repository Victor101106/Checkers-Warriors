export class TextRender {

    constructor(context, defaultCharacterImage) {
        this.defaultCharacterImage = defaultCharacterImage
        this.context = context
    }

    render(text, position, characterImage = this.defaultCharacterImage, maxLength = Infinity, positionIncrement = 1) {
        
        for (let character of text.toLowerCase()) {

            if (maxLength == 0)
                return

            const characterCode  = character.charCodeAt(0) - 97
            const characterIndex = characterCode < 0 || characterCode > 25 ? 26 : characterCode

            const parsedInteger = Number.parseInt(character)

            if (character != ' ')
                this.context.drawImage(characterImage, (isNaN(parsedInteger) ? characterIndex : 27 + parsedInteger) * 3, 0, 3, 5, position.left, position.top, 3, 5)
            
            position.left += 4 * positionIncrement
            maxLength -= 1

        }

    }

}