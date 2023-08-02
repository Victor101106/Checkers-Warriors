import { FastifyInstance } from 'fastify'
import FastifyStatic from '@fastify/static'
import path from 'path'

export default (instance: FastifyInstance) => {
    instance.register(FastifyStatic, { 
        root: path.join(__dirname, '../../adapters/presenters/web/'),
        prefix: '/static/'
    })
}