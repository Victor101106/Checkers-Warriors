export async function statusHandler(promise, handlers) {

    const response = await promise
    const status = response.status

    if (handlers[status]) {
        await handlers[status](response)
    }

}