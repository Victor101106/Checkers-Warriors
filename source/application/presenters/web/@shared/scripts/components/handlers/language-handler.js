import { OptionHandler } from "./option-handler.js"
import { EventEmitter } from "../event-emitter.js"

export const PORTUGUESE = 'pt-br'
export const ENGLISH = 'en-us'
export const SPANISH = 'es'

export const languageCaptions = {
    [ENGLISH]: {
        'language': 'English',
        'watching-match': 'Watching Match • Checkers Warriors',
        'playing-match': 'Playing Match • Checkers Warriors',
        'accept-invite': 'Accept Invite',
        'just-watch': 'Just Watch',
        'options': 'Options',
        'enable-animations': 'Enable Animations',
        'enable-rotation': 'Enable Rotation',
        'enable-effects': 'Enable Effects',
        'enable-audios': 'Enable Sounds',
        'exit-to-home': 'Exit To Home',
        'give-up': 'Give Up',
        'close': 'Close',
        'click-here-to-return-home': 'Click Here To Return Home',
    },
    [PORTUGUESE]: {
        'language': 'Portugues',
        'watching-match': 'Assistindo Partida • Checkers Warriors',
        'playing-match': 'Jogando Partida • Checkers Warriors',
        'accept-invite': 'Aceitar Convite',
        'just-watch': 'Somente Assistir',
        'options': 'Opcoes',
        'enable-animations': 'Ativar Animacoes',
        'enable-rotation': 'Ativar Rotacao',
        'enable-effects': 'Ativar Efeitos',
        'enable-audios': 'Ativar Sons',
        'exit-to-home': 'Ir Para Inicio',
        'give-up': 'Desistir',
        'close': 'Fechar',
        'click-here-to-return-home': 'Clique Aqui Para Voltar Para O Inicio'
    },
    [SPANISH]: {
        'language': 'Espanol',
        'watching-match': 'Viendo El Partido • Checkers Warriors',
        'playing-match': 'Jugando Partido • Checkers Warriors',
        'accept-invite': 'Aceptar Invitacion',
        'just-watch': 'Solo Mira',
        'options': 'Opciones',
        'enable-animations': 'Activar Animaciones',
        'enable-rotation': 'Activar Rotacion',
        'enable-effects': 'Activar Efectos',
        'enable-audios': 'Activar Sonidos',
        'exit-to-home': 'Ir A Casa',
        'give-up': 'Rendirse',
        'close': 'Cerrar',
        'click-here-to-return-home': 'Haga Clic Aqui Para Regresar Al Inicio',
    }
}

export class LanguageHandler {

    constructor(options) {
        this.options = options || new OptionHandler() 
        this.events  = new EventEmitter()
    }

    switchLanguage() {
        const keys = Object.keys(languageCaptions)
        const index = Math.max(keys.findIndex(key => key === this.options.get('language')), 0)
        this.setLanguage(keys[(index + 1) % keys.length])
    }
    
    setLanguage(language = undefined) {
        this.options.set('language', language || navigator.language.toLowerCase() || navigator.userLanguage.toLowerCase())
        this.events.emit('update-language')
    }
    
    getCaption(index) {
        return (languageCaptions[this.options.get('language')] || languageCaptions[ENGLISH])[index]
    }
    
    getLanguage() {
        return this.options.get('language') || ENGLISH
    }

}