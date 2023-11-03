export function authenticateUserRequest({ password, email }) {
    return fetch('/signin', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ password, email }),
        method: 'POST'
    })
}