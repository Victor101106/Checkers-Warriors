import { createMatchRequest } from "./components/request/create-match-request.js"
import { statusHandler } from "../../../shared/scripts/components/status-handler.js"

const [ cardListItemButtonBrazilian ] = [ document.querySelector('#card-list-item-button-brazilian') ]

let hasWaitingResponse = false

async function makeCreateMatchRequest({ variation }) {

    if (hasWaitingResponse)
        return

    hasWaitingResponse = true

    const createMatchPromise = createMatchRequest({ variation })
    
    await statusHandler(createMatchPromise, {
    
        201: async function(response) {
    
            const { id: matchId } = await response.json()
    
            window.location.assign(`/match/${matchId}`)
    
        },
        
        400: async function(response) {
            console.error(await response.json())
        },
        
        401: async function(response) {
            window.location.assign('/signup')
        },
    
        500: function(response) {
            window.location.assign('/internal-error')
        }
    
    })

    hasWaitingResponse = false

}

cardListItemButtonBrazilian.onclick = function() {
    makeCreateMatchRequest({ variation: 'brazilian'})
}