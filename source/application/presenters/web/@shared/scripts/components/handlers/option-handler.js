export class OptionHandler {

    constructor() {
        
        this.options = this.loadOptionsFromCookies()

        if (this.get('first-use') != 'true') {
            this.default()
        }

    }

    loadOptionsFromCookies() {
        
        const cookies = document.cookie.split(';').map(item => item.trim().split('='))
        const options = {}

        for (let [key, value] of cookies) {
            if (key.startsWith('option-')) {
                options[key] = value
            }
        }

        return options

    }

    default() {

        const defaultOptions = {
            'language': (navigator.language || navigator.userLanguage).toLowerCase(),
            'animations': true,
            'first-use': true,
            'rotation': true,
            'effects': true,
            'audios': true
        }

        for (const [option, value] of Object.entries(defaultOptions)) {
            this.set(option, value)
        }

    }

    set(option, value) {

        const expirationDate = new Date()
              expirationDate.setFullYear(expirationDate.getFullYear() + 10)

        document.cookie = `option-${String(option)}=${String(value)}; expires=${expirationDate.toUTCString()}; path=/; SameSite=None; Secure`
        this.options[`option-${option}`] = String(value)

    }

    get(option) {
        return this.options[`option-${option}`]
    }

}