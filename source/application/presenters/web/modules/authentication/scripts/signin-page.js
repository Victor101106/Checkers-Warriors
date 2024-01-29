import { statusHandler } from '../../../@shared/scripts/components/handlers/status-handler.js'
import { signinRequest } from './components/request/signin-request.js'
import InputValidation from './components/form/input-validation.js'

const [ passwordInput, emailInput, submitButton, formError ] = [
    document.querySelector('#form-password-input'),
    document.querySelector('#form-email-input'),
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

submitButton.onclick = async (event) => {
    
    event.preventDefault()

    if (alreadySentRequest)
        return

    formError.classList.remove('form-error-visible')

    const [ passwordValidation, emailValidation ] = [ 
        InputValidation.password(passwordInput),
        InputValidation.email(emailInput)
    ]

    if (!passwordValidation || !emailValidation)
        return

    alreadySentRequest = true

    const signinPromise = signinRequest({
        password: passwordInput.value,
        email: emailInput.value
    })

    await statusHandler(signinPromise, {
        
        200: async function (response) {
            window.location.assign('/')
        },

        400: async function (response) {
            formError.classList.add('form-error-visible')
            formError.querySelector('#form-error-text').innerHTML = (await response.json())?.message || 'Unexpected error.'
        },

        401: async function (response) {
            formError.classList.add('form-error-visible')
            formError.querySelector('#form-error-text').innerHTML = (await response.json())?.message || 'Unexpected error.'
        },

        500: async function (response) {
            window.location.assign('/internal-error')
        }

    })

    alreadySentRequest = false

}