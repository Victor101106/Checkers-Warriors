export class PieceJumpAnimation {

    // --> Class Statements <-- //
    
    particles = new Array()

    numberOfShakes = 10
    shakeCounter = 0
    magnitude = 2

    stopQueue = false
    finished = false
    started = false

    // --> Constructor Function <-- //

    constructor (canvas, context, parent) {
        this.context = context
        this.canvas = canvas
        this.parent = parent
    }

    // --> Receive Function <-- //

    receive(jump) {
        this.jump = jump    
    }

    // --> Skip Function <-- //

    skip() {
        
        this.parent.state.board.spots[this.jump.position.row][this.jump.position.column] = undefined
        
        this.parent.state.score[this.jump.piece.player ? 0 : 1]++
        
        this.parent.indicators.jumps.push(this.jump.position)

    }

    // --> Start Function <-- //

    start() {
        
        const piece = this.parent.state.board.spots[this.jump.position.row][this.jump.position.column]
        const rotatedPosition = this.parent.rotatePosition(this.jump.position)

        this.parent.state.board.spots[this.jump.position.row][this.jump.position.column] = undefined
        this.parent.state.score[this.jump.piece.player ? 0 : 1]++

        const startLeft = rotatedPosition.column * 16 + 1
        const startTop  = rotatedPosition.row * 16 + 1

        const positions = [
            { left: startLeft + 1, top: startTop + 1 },
            { left: startLeft + 8, top: startTop + 1 },
            { left: startLeft + 5, top: startTop + 6 },
            { left: startLeft + 1, top: startTop + 8 },
            { left: startLeft + 7, top: startTop + 9 }
        ]

        const angles = [
            1 * Math.PI     + Math.random() * (Math.PI / 2),
            3 * Math.PI / 2 + Math.random() * (Math.PI / 2),
            5 * Math.PI / 4 + Math.random() * (Math.PI / 2),
            5 * Math.PI / 4 + Math.random() * (Math.PI / 2),
            5 * Math.PI / 4 + Math.random() * (Math.PI / 2),
        ]

        for (let index = 0; index < positions.length; index++) {

            const randomSpeed = 80 + Math.random() * 60

            this.particles.push({
                position: positions[index],
                player: piece.player,
                angle: angles[index],
                speed: randomSpeed,
                sprite: index + 1,
                gravity: 0
            })

        }

        for (let index = 0; index < (4 + Math.random() * 10); index++) {

            const randomAngle = 5 * Math.PI / 4 + Math.random() * (Math.PI / 2)
            const randomSize  = 1 + Math.round(Math.random())
            const randomSpeed = 100 + Math.random() * 80

            this.particles.push({
                position: {
                    left: startLeft + 9,
                    top:  startTop  + 9,
                },
                gravity: 0,
                angle: randomAngle,
                speed: randomSpeed,
                size: randomSize,
            })

        }

        this.parent.indicators.jumps.push(this.jump.position)

        this.started = true

    }

    // --> Update Function <-- //

    update(deltatime = this.parent.deltatime) {

        if (this.shakeCounter < this.numberOfShakes) {

            this.magnitude -= this.magnitude / this.numberOfShakes
            this.shakeCounter++
    
            this.parent.element.left -= this.offsetX || 0
            this.parent.element.top  -= this.offsetY || 0
            
            if (this.shakeCounter < this.numberOfShakes) {

                this.offsetX = Math.round(Math.floor(Math.random() * (-this.magnitude - this.magnitude + 1)) + this.magnitude)
                this.offsetY = Math.round(Math.floor(Math.random() * (-this.magnitude - this.magnitude + 1)) + this.magnitude)

                this.parent.element.left += this.offsetX
                this.parent.element.top  += this.offsetY

            }

        }

        const slowdown = 40 * this.parent.deltatime
        const gravity = 200 * this.parent.deltatime

        for (let index = 0; index < this.particles.length; index++) {

            const particle = this.particles.at(index)

            particle.speed    = Math.max(particle.speed - slowdown, 0)
            particle.gravity += gravity

            const speedY = particle.speed * Math.sin(particle.angle) + particle.gravity
            const speedX = particle.speed * Math.cos(particle.angle)

            particle.position.left += speedX * deltatime
            particle.position.top  += speedY * deltatime

            if (particle.position.top >= this.canvas.height) {
                
                this.particles.splice(index, 1)
                
                index -= 1

            }

        }

        if (!this.particles.length && this.shakeCounter >= this.numberOfShakes)
             this.finished = true

    }

    // --> Render Function <-- //

    render(deltatime = this.parent.deltatime) {
        
        this.context.fillStyle = '#000000'

        for (let particle of this.particles) {

            const sprite   = this.parent.sprites[`particle-0${particle.sprite}`]

            if (sprite) {
                this.context.drawImage(sprite, sprite.width / 2 * particle.player, 0, sprite.width / 2, sprite.height, Math.round(this.parent.element.left + particle.position.left), Math.round(this.parent.element.top + particle.position.top), sprite.width / 2, sprite.height)
                continue
            }

            this.context.fillRect(Math.round(this.parent.element.left + particle.position.left - particle.size / 2), Math.round(this.parent.element.top + particle.position.top - particle.size / 2) - 1, particle.size, particle.size)

        }

    }

    // --> Final Class <-- //

}