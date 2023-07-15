import setRoutest from './routest'
import Fastify from 'fastify'

const instance = Fastify()

setRoutest(instance)

export default instance