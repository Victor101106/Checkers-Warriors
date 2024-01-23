import { statusHandler } from '../../../@shared/scripts/components/status-handler.js'
import { signupRequest } from './components/request/signup-request.js'
import InputValidation from './components/form/input-validation.js'

const [ passwordInput, emailInput, nameInput, submitButton, formError ] = [
    document.querySelector('#form-password-input'),
    document.querySelector('#form-email-input'),
    document.querySelector('#form-name-input'),
    document.querySelector('#form-button'),
    document.querySelector('#form-error')
]

let alreadySentRequest = false

passwordInput.onchange = function () {
    InputValidation.password(passwordInput)
}

emailInput.onchange = function () {
    InputValidation.email(emailInput)
}

nameInput.onchange = function () {
    InputValidation.name(nameInput)
}

submitButton.onclick = async (event) => {
    
    event.preventDefault()
    
    if (alreadySentRequest)
        return

    formError.classList.remove('form-error-visible')

    const [ passwordValidation, emailValidation, nameValidation ] = [ 
        InputValidation.password(passwordInput),
        InputValidation.email(emailInput),
        InputValidation.name(nameInput)
    ]

    if (!passwordValidation || !emailValidation || !nameValidation)
        return

    alreadySentRequest = true

    const signupPromise = signupRequest({
        password: passwordInput.value,
        email: emailInput.value,
        name: nameInput.value,
    })

    await statusHandler(signupPromise, {
        
        201: async function (response) {
            window.location.assign('/')
        },

        400: async function (response) {
            formError.classList.add('form-error-visible')
            formError.querySelector('#form-error-text').innerHTML = (await response.json())?.message || 'Unexpected error.'
        },

        500: async function (response) {
            window.location.assign('/internal-error')
        }

    })

    alreadySentRequest = false

}