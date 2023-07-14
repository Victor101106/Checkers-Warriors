export class IncorrectEmailOrPassword extends Error {
    constructor() {
        super("The password or email is incorrect.")
        this.name = "IncorrectEmailOrPassword"
    }
}