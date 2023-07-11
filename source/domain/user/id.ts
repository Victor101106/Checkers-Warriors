import { Either, left, right } from "../../shared/either"
import { InvalidId } from "./errors/invalid-id"

export class Id {

    public readonly value: string

    constructor(value: string) {
        this.value = value
        Object.freeze(this)
    }

    static create(id?: string): Either<InvalidId, Id> {

        const isInvalidId = id != undefined && !this.validateId(id)

        if (isInvalidId) 
            return left(new InvalidId())
        
        return right(new Id(id || this.generateId()))

    }

    static generateId() {
        let date = new Date().getTime()
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const result = (date + Math.random() * 16) % 16 | 0
            date = Math.floor(date / 16)
            return (c == 'x' ? result : (result&0x3|0x8)).toString(16)
        })
    }

    static validateId(id: string): boolean {
        return id.trim() === id && id.length > 0
    }

}