import { Either } from "../../@shared/either"

export interface Validator {
    validate(): Either<Error, void>
}