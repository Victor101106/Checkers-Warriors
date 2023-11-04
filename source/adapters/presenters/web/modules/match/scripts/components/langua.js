import { EventEmitter } from "../../../../shared/scripts/components/event-emitter.js"

let currentLanguage = (navigator.language || navigator.userLanguage).toLowerCase()

export const languages = {
    'en-us': [
        'English',
        'Watching Match • Checkers Warriors',
        'Playing Match • Checkers Warriors',
        'Accept Invite',
        'Just Watch',
        'Options',
        'Enable Animations',
        'Enable Rotation',
        'Enable Effects',
        'Enable Sounds',
        'Exit To Home',
        'Give Up',
        'Close',
        'Click Here To Return Home'
    ],
    'pt-br': [
        'Portugues',
        'Assistindo Partida • Checkers Warriors',
        'Jogando Partida • Checkers Warriors',
        'Aceitar Convite',
        'Somente Assistir',
        'Opcoes',
        'Ativar Animacoes',
        'Ativar Rotacao',
        'Ativar Efeitos',
        'Ativar Sons',
        'Ir Para Inicio',
        'Desistir',
        'Fechar',
        'Clique Aqui Para Voltar Para O Inicio'
    ],
    'es': [
        'Espanol',
        'Viendo El Partido • Checkers Warriors',
        'Jugando Partido • Checkers Warriors',
        'Aceptar Invitacion',
        'Solo Mira',
        'Opciones',
        'Activar Animaciones',
        'Activar Rotacion',
        'Activar Efectos',
        'Activar Sonidos',
        'Ir A Casa',
        'Rendirse',
        'Cerrar',
        'Haga Clic Aqui Para Regresar Al Inicio'
    ]
}

const events = new EventEmitter()

function switchLanguage() {
    
    const keys = Object.keys(languages)
    const index = Math.max(keys.findIndex(key => key == currentLanguage), 0)

    setLanguage(keys[(index + 1) % keys.length])

}

function setLanguage(language = undefined) {
    
    currentLanguage = language || (navigator.language || navigator.userLanguage).toLowerCase()
    
    events.emit('update-language')

}

function getCaption(position) {
    return (languages[currentLanguage] || languages['en-us']).at(position)
}

function getLanguage() {
    return currentLanguage
}

export default { switchLanguage, setLanguage, getLanguage, getCaption, events }