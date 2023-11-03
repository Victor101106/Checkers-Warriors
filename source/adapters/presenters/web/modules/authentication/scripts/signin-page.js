import { authenticateUserRequest } from './components/request/authenticate-user-request.js'
import { statusHandler } from '../../../shared/scripts/components/status-handler.js'
import InputValidation from './components/validate-input.js'

const [ passwordInput, emailInput, formButton, formError ] = [
    document.querySelector('#main-password-input'),
    document.querySelector('#main-email-input'),
    document.querySelector('#main-form-button'),
    document.querySelector('#main-error')
]

InputValidation.password(passwordInput)
InputValidation.email(emailInput)

let hasWaitingResponse = false

async function makeAuthenticateUserRequest() {

    if (hasWaitingResponse)
        return

    formError.classList.remove('main-error-visible')
    hasWaitingResponse = true

    const createUserPromise = authenticateUserRequest({
        password: passwordInput.value,
        email: emailInput.value
    })

    await statusHandler(createUserPromise, {
        
        200: async function (response) {
            window.location.assign('/')
        },

        400: async function (response) {
            formError.classList.add('main-error-visible')
            formError.querySelector('#main-error-text').innerHTML = (await response.json())?.message || 'Unexpected error.'
        },

        401: async function (response) {
            formError.classList.add('main-error-visible')
            formError.querySelector('#main-error-text').innerHTML = (await response.json())?.message || 'Unexpected error.'
        },

        500: async function (response) {
            window.location.assign('/internal-error')
        }

    })

    hasWaitingResponse = false

}

formButton.onclick = (event) => {
    makeAuthenticateUserRequest()
    event.preventDefault()
}