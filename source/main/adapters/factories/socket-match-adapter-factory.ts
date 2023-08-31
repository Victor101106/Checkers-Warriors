import { findAllMovementsSocketHelper } from "../helpers/factories/find-all-movements-socket-helper-factory"
import { receiveMatchSocketHelper } from "../helpers/factories/receive-match-socket-helper-factory"
import { joinMatchSocketHelper } from "../helpers/factories/join-match-socket-helper-factory"
import { SocketMatchAdapter } from "../socket-match-adapter"
import socket from "../../configs/socket"

export const socketMatchAdapter = new SocketMatchAdapter(findAllMovementsSocketHelper, receiveMatchSocketHelper, joinMatchSocketHelper, socket)