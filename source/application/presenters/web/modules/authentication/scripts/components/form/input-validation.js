const emailExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordExpression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/

function password(element) {
    
    const validation = passwordExpression.test(element.value || '')
    
    if (validation)
        element.parentNode.classList.remove('field-error')
    else
        element.parentNode.classList.add('field-error')
    
    return validation

}

function email(element) {

    const validation = emailExpression.test(element.value || '')

    if (validation) 
        element.parentNode.classList.remove('field-error')
    else 
        element.parentNode.classList.add('field-error')

    return validation

}

function name(element) {

    const validation = element.value && element.value.trim().length > 2

    if (validation)
        element.parentNode.classList.remove('field-error')
    else
        element.parentNode.classList.add('field-error')

    return validation

}

export default { password, email, name }