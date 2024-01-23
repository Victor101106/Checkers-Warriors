import { GetUserByAccessTokenUseCase } from "../../domain/usecases/get-user-by-access-token-usecase"
import { CreateRelationUseCase } from "../../domain/usecases/create-relation-usecase"
import { GetMatchUseCase } from "../../domain/usecases/get-match-usecase"
import { MatchPresenter } from "../presenters/api/match-presenter"
import { SocketProcessor } from "../contracts/socket-processor"
import { ValidationBuilder } from "../validation/builder"
import { Either, left, right } from "../../@shared/either"
import { Validator } from "../validation/validator"

export interface ReceiveMatchSocketProcessorResponse extends ReturnType<typeof MatchPresenter.toJSON> {
    indexOf: number
}

export class ReceiveMatchSocketProcessor extends SocketProcessor {

    private readonly getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase
    private readonly createRelationUseCase: CreateRelationUseCase
    private readonly getMatchUseCase: GetMatchUseCase

    constructor(getUserByAccessTokenUseCase: GetUserByAccessTokenUseCase, createRelationUseCase: CreateRelationUseCase, getMatchUseCase: GetMatchUseCase) {
        super()
        this.getUserByAccessTokenUseCase = getUserByAccessTokenUseCase
        this.createRelationUseCase = createRelationUseCase
        this.getMatchUseCase = getMatchUseCase
    }

    protected buildValidators(data: any): Validator[] {
        return [
            ...ValidationBuilder.of('accessToken', data.accessToken).required().string().build(),
            ...ValidationBuilder.of('socketId', data.socketId).required().string().build(),
            ...ValidationBuilder.of('matchId', data.matchId).required().string().build()
        ]
    }

    async perform(data: any): Promise<Either<Error, ReceiveMatchSocketProcessorResponse>> {
        
        const { accessToken, socketId, matchId } = data

        const userOrError = await this.getUserByAccessTokenUseCase.execute({ accessToken })

        if (userOrError.isLeft())
            return left(userOrError.value)

        const matchOrError = await this.getMatchUseCase.execute({ matchId })

        if (matchOrError.isLeft())
            return left(matchOrError.value)

        const match = matchOrError.value
        const user  = userOrError.value

        const relationOrError = await this.createRelationUseCase.execute({
            matchId: match.id.value,
            userId: user.id.value,
            relationId: socketId
        })

        if (relationOrError.isLeft())
            return left(relationOrError.value)

        const indexOf = match.players.findIndex(player => player?.id.value == user.id.value)

        return right(Object.assign({ indexOf }, MatchPresenter.toJSON(match)))

    }

}