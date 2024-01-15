import instance from "./configs/instance"

import './factories/main/adapters/socket-match-adapter-factory'
import './configs/socket'

const PORT = Number(process.env.PORT)

instance.ready((error) => {

    if (error) {
        console.error(error)
        process.exit(1)
    }
    
    instance.server.listen(PORT, () => {
        console.log(`⚡ Listening at PORT ${PORT}!`)
    })

})