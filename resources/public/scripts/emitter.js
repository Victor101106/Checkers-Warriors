export function Emitter() {

    const listeners = new Map()

    function listen(event, callback) {
        if (listeners.has(event)) {
            return listeners.set(event, [...listeners.get(event), callback])
        }
        listeners.set(event, [callback])
    }

    function emit(event, data) {
        if (listeners.has(event)) {
            listeners.get(event).forEach(callback => callback(data))
        }
    }

    return {
        listen,
        emit
    }

}