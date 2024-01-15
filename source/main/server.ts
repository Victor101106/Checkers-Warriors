import instance from "./configs/instance"

import { env } from './configs/env'

import './factories/main/adapters/socket-match-adapter-factory'
import './configs/socket'

instance.ready((error) => {

    if (error) {
        console.error(error)
        process.exit(1)
    }
    
    instance.server.listen(env.port, () => {
        console.log(`⚡ Listening at PORT ${env.port}!`)
    })

})