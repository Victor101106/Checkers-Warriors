import { FastifyInstance } from 'fastify'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (instance: FastifyInstance): void => {
    readdirSync(join(__dirname, '../routes/')).forEach(file => {
        require(join(__dirname, `../routes/${file}`))(instance)
    })
}