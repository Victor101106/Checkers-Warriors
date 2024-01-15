import { findAllMovementsSocketHelper } from "./helpers/find-all-movements-socket-helper-factory"
import { receiveMatchSocketHelper } from "./helpers/receive-match-socket-helper-factory"
import { joinMatchSocketHelper } from "./helpers/join-match-socket-helper-factory"
import { movePieceSocketHelper } from "./helpers/move-piece-socket-helper-factory"
import { giveUpSocketHelper } from "./helpers/give-up-socket-helper-factory"
import { SocketMatchAdapter } from "../../../adapters/socket-match-adapter"
import socket from "../../../configs/socket"

export const socketMatchAdapter = new SocketMatchAdapter(findAllMovementsSocketHelper, receiveMatchSocketHelper, movePieceSocketHelper, joinMatchSocketHelper, giveUpSocketHelper, socket)