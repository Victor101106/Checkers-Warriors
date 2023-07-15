import { FastifyInstance } from 'fastify'
import { readdirSync } from 'fs'

export default (instance: FastifyInstance): void => {
    readdirSync(`${__dirname}/../routes`).forEach(file => {
        require(`../routes/${file}`)(instance)
    })
}