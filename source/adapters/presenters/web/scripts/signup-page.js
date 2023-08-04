import { createUserRequest } from './components/http-request/create-user-request.js'
import { statusHandler } from './components/http-request/status-handler.js'
import InputValidation from './components/validate-input.js'

const [ passwordInput, emailInput, nameInput, formButton, formError ] = [
    document.querySelector('#main-password-input'),
    document.querySelector('#main-email-input'),
    document.querySelector('#main-name-input'),
    document.querySelector('#main-form-button'),
    document.querySelector('#main-error')
]

InputValidation.password(passwordInput)
InputValidation.email(emailInput)
InputValidation.name(nameInput)

let hasWaitingResponse = false

async function makeCreateUserRequest() {

    if (hasWaitingResponse)
        return

    formError.classList.remove('main-error-visible')
    hasWaitingResponse = true

    const createUserPromise = createUserRequest({
        password: passwordInput.value,
        email: emailInput.value,
        name: nameInput.value,
    })

    await statusHandler(createUserPromise, {
        
        201: async function (response) {
            window.location.assign('/')
        },

        400: async function (response) {
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
    makeCreateUserRequest()
    event.preventDefault()
}