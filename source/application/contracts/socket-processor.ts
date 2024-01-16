import { Either } from "../../shared/either"

export interface SocketProcessor {
    execute(data: any): Promise<Either<Error, any>>
}