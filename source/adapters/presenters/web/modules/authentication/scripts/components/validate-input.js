const passwordExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
const emailExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function password(element) {
    element.onchange = () => {
        if (passwordExpression.test(element.value || ''))
            return element.parentNode.classList.remove('field-error')
        return element.parentNode.classList.add('field-error')
    }
}

function email(element) {
    element.onchange = () => {
        if (emailExpression.test(element.value || ''))
            return element.parentNode.classList.remove('field-error')
        return element.parentNode.classList.add('field-error')
    }
}

function name(element) {
    element.onchange = () => {
        if (element.value && element.value.trim().length > 2)
            return element.parentNode.classList.remove('field-error')
        return element.parentNode.classList.add('field-error')
    }
}

export default { password, email, name }