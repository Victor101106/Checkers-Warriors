import language from "../langua.js"

export class InviteScreen {

    // --> Constructor Function

    constructor(canvas, context, parent) {
        this.context = context
        this.parent = parent
        this.canvas = canvas
    }
    
    // --> Configure Functions

    configureElements() {

        const acceptInviteButtonOnClick = () => this.parent.events.emit('request-join-match')
        const acceptInviteButtonCaption = language.getCaption(3)
        const acceptInviteButtonWidth  = acceptInviteButtonCaption.length * 4 - 1
        const acceptInviteButtonHeight = 5

        const justWatchButtonOnClick = () => this.parent.currentScreen = this.parent.screens.boardScreen
        const justWatchButtonCaption = language.getCaption(4)
        const justWatchButtonWidth  = justWatchButtonCaption.length * 4 - 1
        const justWatchButtonHeight = 5

        const translateX = this.parent.container.width / 2 - acceptInviteButtonWidth / 2 | 0
        const translateY = this.parent.container.height / 2 - (acceptInviteButtonHeight + justWatchButtonHeight + 7) / 2 | 0

        this.parent.createElement('accept-invite-button', translateX, translateY, acceptInviteButtonWidth, acceptInviteButtonHeight, acceptInviteButtonCaption, acceptInviteButtonOnClick, this)
        this.parent.createElement('just-watch-button', translateX + acceptInviteButtonWidth / 2 - justWatchButtonWidth / 2, translateY + acceptInviteButtonHeight + 7, justWatchButtonWidth, justWatchButtonHeight, justWatchButtonCaption, justWatchButtonOnClick, this)

    }

    // --> Rendering Function

    render(deltatime) {

        const acceptInviteButton = this.parent.getElement('accept-invite-button')
        const justWatchButton = this.parent.getElement('just-watch-button')
        const characters = this.parent.images.charactersGreen

        const translateX = this.parent.container.width / 2 - acceptInviteButton.width / 2 | 0
        const translateY = this.parent.container.height / 2 - (acceptInviteButton.height + justWatchButton.height + 7) / 2 | 0

        this.context.globalAlpha = 0.60
        this.context.drawImage(this.parent.images.sectionSeparator, translateX + acceptInviteButton.width / 2 - 17 / 2 | 0, translateY + acceptInviteButton.height + 2 | 0)
       
        this.context.globalAlpha = acceptInviteButton.hovering ? 1.00 : 0.60
        this.parent._renderString(acceptInviteButton.caption, acceptInviteButton.left, acceptInviteButton.top, characters)
       
        this.context.globalAlpha = justWatchButton.hovering ? 1.00 : 0.60
        this.parent._renderString(justWatchButton.caption, justWatchButton.left, justWatchButton.top, characters)

        this.context.globalAlpha = 1.00

    }
    // --> Final Class

}