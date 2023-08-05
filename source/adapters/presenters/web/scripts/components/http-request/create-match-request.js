export function createMatchRequest({ variation }) {
    return fetch('/create-match', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ variation }),
        method: 'POST'
    })
}