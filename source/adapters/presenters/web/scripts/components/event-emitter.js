export class EventEmitter {

    constructor() {
        this.listeners = new Map()
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event).push(callback)
    }

    off(event, callback) {
        const listeners = this.listeners.get(event)
        if (listeners) {
            const index = listeners.indexOf(callback)
            index >= 0 && listeners.splice(index, 1)
        }
    }

    emit(event, ...params) {
        const listeners = this.listeners.get(event)
        if (listeners) {
            listeners.forEach(callback => callback(...params))
        }
    }

}