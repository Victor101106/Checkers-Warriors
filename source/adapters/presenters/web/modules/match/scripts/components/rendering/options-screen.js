import language from "../langua.js"

export class OptionsScreen {

    // --> Constructor Function

    constructor(canvas, context, parent) {
        this.context = context
        this.parent = parent
        this.canvas = canvas
        this.options = {
            enableAnimations: true,
            enableRotation: true,
            enableEffects: true,
            enableSounds: true
        }
    }
    
    // --> Configure Functions

    configureElements() {

        const enableAnimationsToggleCaption = language.getCaption(6)
        const middleX = (enableAnimationsToggleCaption.length * 4 + 6) / 2
        
        const translateX = this.parent.container.width / 2 - middleX | 0
        const translateY = this.parent.container.height / 2 - 51 / 2 | 0

        const enableAnimationsToggleOnClick = () => { this.options.enableAnimations = !this.options.enableAnimations }
        const enableAnimationsToggleWidth = enableAnimationsToggleCaption.length * 4 + 6
        const enableAnimationsToggleLeft = translateX
        const enableAnimationsToggleTop = translateY
        const enableAnimationsToggleHeigth = 5
        
        const enableRotationToggleCaption = language.getCaption(7)
        const enableRotationToggleOnClick = () => { this.options.enableRotation = !this.options.enableRotation }
        const enableRotationToggleWidth = enableRotationToggleCaption.length * 4 + 6
        const enableRotationToggleLeft = translateX + middleX - enableRotationToggleWidth / 2 | 0
        const enableRotationToggleTop = translateY  + 1 * 7
        const enableRotationToggleHeigth = 5 

        const enableEffectsToggleCaption = language.getCaption(8)
        const enableEffectsToggleOnClick = () => { this.options.enableEffects = !this.options.enableEffects }
        const enableEffectsToggleWidth = enableEffectsToggleCaption.length * 4 + 6
        const enableEffectsToggleLeft = translateX + middleX - enableEffectsToggleWidth / 2 | 0
        const enableEffectsToggleTop = translateY  + 2 * 7
        const enableEffectsToggleHeigth = 5 
        
        const enableSoundsToggleCaption = language.getCaption(9)
        const enableSoundsToggleOnClick = () => { this.options.enableSounds = !this.options.enableSounds; return !this.options.enableSounds }
        const enableSoundsToggleWidth = enableSoundsToggleCaption.length * 4 + 6
        const enableSoundsToggleLeft = translateX + middleX - enableSoundsToggleWidth / 2 | 0
        const enableSoundsToggleTop = translateY  + 3 * 7
        const enableSoundsToggleHeigth = 5 

        const languageSwitchCaption = language.getCaption(0)
        const languageSwitchOnClick = () => { language.switchLanguage() }
        const languageSwitchWidth = languageSwitchCaption.length * 4 + 8
        const languageSwitchLeft = translateX + middleX - languageSwitchWidth / 2 | 0
        const languageSwitchTop = translateY + 4 * 7
        const languageSwitchHeigth = 7
        
        const exitToHomeButtonCaption = language.getCaption(10)
        const exitToHomeButtonOnClick = () => window.location.assign('/')
        const exitToHomeButtonWidth = exitToHomeButtonCaption.length * 4 - 1
        const exitToHomeButtonLeft = translateX + middleX - exitToHomeButtonWidth / 2 | 0
        const exitToHomeButtonTop = translateY + 5 + 5 * 7 + 2
        const exitToHomeButtonHeigth = 5 
        
        const giveUpButtonCaption = language.getCaption(11)
        const giveUpButtonOnClick = () => this.parent.events.emit('request-give-up')
        const giveUpButtonWidth = giveUpButtonCaption.length * 4 - 1
        const giveUpButtonLeft = translateX + middleX - giveUpButtonWidth / 2 | 0
        const giveUpButtonTop = translateY + 5 + 6 * 7 + 2
        const giveUpButtonHeigth = 5 
        
        const closeButtonCaption = language.getCaption(12)
        const closeButtonOnClick = () => this.parent.currentScreen = this.parent.screens.boardScreen
        const closeButtonWidth = closeButtonCaption.length * 4 - 1
        const closeButtonLeft = translateX + middleX - closeButtonWidth / 2 | 0
        const closeButtonTop = translateY + 5 + 7 * 7 + 2
        const closeButtonHeigth = 5

        this.parent.createElement('enable-animations-toggle', enableAnimationsToggleLeft, enableAnimationsToggleTop, enableAnimationsToggleWidth, enableAnimationsToggleHeigth, enableAnimationsToggleCaption, enableAnimationsToggleOnClick, this)
        this.parent.createElement('enable-rotation-toggle', enableRotationToggleLeft, enableRotationToggleTop, enableRotationToggleWidth, enableRotationToggleHeigth, enableRotationToggleCaption, enableRotationToggleOnClick, this)
        this.parent.createElement('enable-effects-toggle', enableEffectsToggleLeft, enableEffectsToggleTop, enableEffectsToggleWidth, enableEffectsToggleHeigth, enableEffectsToggleCaption, enableEffectsToggleOnClick, this)
        this.parent.createElement('enable-sounds-toggle', enableSoundsToggleLeft, enableSoundsToggleTop, enableSoundsToggleWidth, enableSoundsToggleHeigth, enableSoundsToggleCaption, enableSoundsToggleOnClick, this)
        this.parent.createElement('language-switch', languageSwitchLeft, languageSwitchTop, languageSwitchWidth, languageSwitchHeigth, languageSwitchCaption, languageSwitchOnClick, this)
        this.parent.createElement('exit-to-home-button', exitToHomeButtonLeft, exitToHomeButtonTop, exitToHomeButtonWidth, exitToHomeButtonHeigth, exitToHomeButtonCaption, exitToHomeButtonOnClick, this)
        this.parent.createElement('give-up-button', giveUpButtonLeft, giveUpButtonTop, giveUpButtonWidth, giveUpButtonHeigth, giveUpButtonCaption, giveUpButtonOnClick, this)
        this.parent.createElement('close-button', closeButtonLeft, closeButtonTop, closeButtonWidth, closeButtonHeigth, closeButtonCaption, closeButtonOnClick, this)

    }

    // --> Rendering Function

    render(deltatime) {

        const enableAnimationsToggle = this.parent.getElement('enable-animations-toggle')
        const enableRotationToggle = this.parent.getElement('enable-rotation-toggle')
        const enableEffectsToggle = this.parent.getElement('enable-effects-toggle')
        const enableSoundsToggle = this.parent.getElement('enable-sounds-toggle')
        const languageSwitch = this.parent.getElement('language-switch')
        const exitToHomeButton = this.parent.getElement('exit-to-home-button')
        const giveUpButton = this.parent.getElement('give-up-button')
        const closeButton = this.parent.getElement('close-button')

        const characters = this.parent.images.charactersGreen

        this.context.globalAlpha = enableAnimationsToggle.hovering ? 1.00 : 0.60
        this.context.drawImage(this.parent.images[this.options.enableAnimations ? "checkBoxOn" : "checkBoxOff"], enableAnimationsToggle.left, enableAnimationsToggle.top)
        this.parent._renderString(enableAnimationsToggle.caption, 7 + enableAnimationsToggle.left, enableAnimationsToggle.top, characters)

        this.context.globalAlpha = enableRotationToggle.hovering ? 1.00 : 0.60
        this.context.drawImage(this.parent.images[this.options.enableRotation ? "checkBoxOn" : "checkBoxOff"], enableRotationToggle.left, enableRotationToggle.top)
        this.parent._renderString(enableRotationToggle.caption, 7 + enableRotationToggle.left, enableRotationToggle.top, characters)

        this.context.globalAlpha = enableEffectsToggle.hovering ? 1.00 : 0.60
        this.context.drawImage(this.parent.images[this.options.enableEffects ? "checkBoxOn" : "checkBoxOff"], enableEffectsToggle.left, enableEffectsToggle.top)
        this.parent._renderString(enableEffectsToggle.caption, 7 + enableEffectsToggle.left, enableEffectsToggle.top, characters)

        this.context.globalAlpha = enableSoundsToggle.hovering ? 1.00 : 0.60
        this.context.drawImage(this.parent.images[this.options.enableSounds ? "checkBoxOn" : "checkBoxOff"], enableSoundsToggle.left, enableSoundsToggle.top)
        this.parent._renderString(enableSoundsToggle.caption, 7 + enableSoundsToggle.left, enableSoundsToggle.top, characters)

        this.context.globalAlpha = languageSwitch.hovering ? 1.00 : 0.60
        this.context.drawImage(this.parent.images.languageSwitch, languageSwitch.left, languageSwitch.top)
        this.parent._renderString(languageSwitch.caption, 9 + languageSwitch.left, languageSwitch.top + 1, characters)

        this.context.globalAlpha = 0.60
        this.context.drawImage(this.parent.images.sectionSeparator, enableAnimationsToggle.left + enableAnimationsToggle.width / 2 - 17 / 2 | 0, languageSwitch.top + languageSwitch.height + 2 | 0)
        
        this.context.globalAlpha = exitToHomeButton.hovering ? 1.00 : 0.60
        this.parent._renderString(exitToHomeButton.caption, exitToHomeButton.left, exitToHomeButton.top, characters)

        this.context.globalAlpha = giveUpButton.hovering ? 1.00 : 0.60
        this.parent._renderString(giveUpButton.caption, giveUpButton.left, giveUpButton.top, characters)

        this.context.globalAlpha = closeButton.hovering ? 1.00 : 0.60
        this.parent._renderString(closeButton.caption, closeButton.left, closeButton.top, characters)

    }

    // --> Final Class

}