export function createUserRequest({ password, email, name }) {
    return fetch('/signup', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ password, email, name }),
        method: 'POST'
    })
}