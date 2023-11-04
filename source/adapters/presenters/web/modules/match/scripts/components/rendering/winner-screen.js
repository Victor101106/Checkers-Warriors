export class WinnerScreen {

    // --> Constructor Function

    constructor(canvas, context, parent) {
        this.context = context
        this.parent = parent
        this.canvas = canvas
    }

    // --> Configure Functions

    configureElements() {

        const returnToHomeButtonCaption = "Click anywhere to return to home"
        const returnToHomeButtonLeft = Math.floor(this.parent.container.width / 2 - (returnToHomeButtonCaption.length * 4 - 1) / 2)
        const returnToHomeButtonWidth = returnToHomeButtonCaption.length * 4 -1
        const returnToHomeButtonOnClick = () => window.location.assign('/')
        const returnToHomeButtonTop = this.parent.container.height - 7
        const returnToHomeButtonHeight = 5

        this.parent.createElement('return-to-home-button-winner', returnToHomeButtonLeft, returnToHomeButtonTop, returnToHomeButtonWidth, returnToHomeButtonHeight, returnToHomeButtonCaption, returnToHomeButtonOnClick, this)

    }

    // --> Rendering Function

    render(deltatime) {

        const returnToHomeButton = this.parent.getElement('return-to-home-button-winner')

        if (this.parent.state.indexOf == -1 || this.parent.state.winner == this.parent.state.indexOf)
            this._renderTransparentGreenFilter()
        else
            this._renderTransparentRedFilter()
                
        const image = this.parent.images[(this.parent.state.indexOf == -1 || this.parent.state.winner == this.parent.state.indexOf ? 'wonText' : 'lossText') + (this.parent.state.winner == 0 ? "White" : "Black") ]
        this.context.drawImage(image, this.parent.container.width / 2 - image.width / 2 | 0, this.parent.container.height / 2 - image.height / 2 | 0)

        this.context.globalAlpha = returnToHomeButton.hovering ? 1.00 : 0.75
        this.parent._renderString(returnToHomeButton.caption, returnToHomeButton.left, returnToHomeButton.top, this.parent.state.indexOf == -1 || this.parent.state.winner == this.parent.state.indexOf ? this.parent.images.charactersGreen : this.parent.images.charactersRed)

    }

    // --> Render Functions

    _renderTransparentGreenFilter() {
        this.context.fillStyle = '#0d302a'
        this.context.globalAlpha = 0.95
        this.context.fillRect(0 - this.parent.container?.left, 0 - this.parent.container?.top, this.parent.canvas.width, this.parent.canvas.height)
        this.context.globalAlpha = 1.00
    }

    _renderTransparentRedFilter() {
        this.context.fillStyle = '#570303'
        this.context.globalAlpha = 0.95
        this.context.fillRect(0 - this.parent.container?.left, 0 - this.parent.container?.top, this.parent.canvas.width, this.parent.canvas.height)
        this.context.globalAlpha = 1.00
    }
    
    // --> Final Class
}