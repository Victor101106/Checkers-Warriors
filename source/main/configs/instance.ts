import setRoutest from './routest'
import setEngine from './engine'
import Fastify from 'fastify'

const instance = Fastify()

setRoutest(instance)
setEngine(instance)

export default instance