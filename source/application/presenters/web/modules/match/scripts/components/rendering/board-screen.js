export class BoardScreen {

    // --> Constructor Function

    constructor(canvas, context, parent) {
        this.moveIndicators = new Array()
        this.jumpIndicators = new Array()
        this.particles = new Array()
        this.context = context
        this.parent = parent
        this.canvas = canvas
    }

    // --> Configure Functions

    configureElements() {

        const optionsButtonCaption = this.parent.screens.optionsScreen.language.getCaption('options')

        this.parent.createElement("options-button", this.parent.board.left, this.parent.board.top + this.parent.board.height + 4, optionsButtonCaption.length * 4 + 5, 5, optionsButtonCaption, (event) => { return this._optionsButtonClickEvent(event) }, this)
        this.parent.createElement("board", this.parent.board.left, this.parent.board.top, this.parent.board.width, this.parent.board.height, undefined, (event) => { return this._boardClickEvent(event) }, this)

    }

    // --> Event Functions

    _boardClickEvent(coordinate) {

        const position = this.coordinateToBoardPosition(coordinate.x, coordinate.y)
        const rotatedPosition = this.parent.rotatePosition(position)

        const positionAlreadySelected = this.selection && this.selection.column == rotatedPosition.column && this.selection.row == rotatedPosition.row
        const positionOutsideBoard = position.column < 0 || position.row < 0 || position.column >= this.parent.state.board.columns || position.row >= this.parent.state.board.rows

        if (positionOutsideBoard || positionAlreadySelected)
            return this.selection = undefined

        if (this.selection && this.movements.find(({ startsAt, endsAt }) => startsAt.column == this.selection.column && startsAt.row == this.selection.row && endsAt.column == rotatedPosition.column && endsAt.row == rotatedPosition.row))
            return this.parent.events.emit('request-move-piece', { startsAt: this.selection, endsAt: rotatedPosition }) || true

        if (!this.movements || !this.movements.find(({ startsAt }) => startsAt.column == rotatedPosition.column && startsAt.row == rotatedPosition.row))
            return this.selection = undefined

        this.selection = rotatedPosition

    }

    _movePieceEvent({ positions, startsAt, endsAt, jumps, promoted, winner }) {

        this.jumpIndicators = new Array()
        this.moveIndicators = new Array()
        this.slotIndicator  = undefined
        this.selection = undefined
        this.movements = undefined

        for (let index = 0; index < positions.length; index++) {

            this.parent.enqueueAnimation({
                previous: { ...positions[index - 2] || startsAt },
                startsAt: { ...positions[index - 1] || startsAt },
                isLast: index == positions.length - 1,
                endsAt: positions[index],
                jump: jumps.at(0),
            }, (data) => this._calculateMoveAnimation(data))

            if (jumps.length) this.parent.enqueueAnimation({
                interval: index != positions.length,
                jump: jumps.shift(),
            }, (data) => this._calculateJumpAnimation(data))
            
        }

        if (promoted) this.parent.enqueueAnimation({
            position: endsAt
        }, (data) => this._calculatePromotionAnimation(data))

        if (winner) this.parent.enqueueAnimation({
            position: endsAt
        }, (data) => this._calculateWinnerAnimation(data))

        this.parent.enqueueAnimation(undefined, () => this._calculateReverseTurnAnimation())

    }

    _optionsButtonClickEvent(coordinate) {
        this.parent.currentScreen = this.parent.screens.optionsScreen
    }

    // --> Auxiliary Functions

    coordinateToBoardPosition(x, y) {
        return {
            column: Math.floor((x - this.parent.container.left - this.parent.board.left) / 16),
            row: Math.floor((y - this.parent.container.top - this.parent.board.top) / 16)
        }
    }

    // --> Calculate Function

    _calculateDirection(startsAt, endsAt) {
        return {
            column: Math.min(1, Math.max(-1, endsAt.column - startsAt.column)),
            row: Math.min(1, Math.max(-1, endsAt.row - startsAt.row)),
        }
    }

    _compareCoordinate(coordinate1, coordinate2) {
        return coordinate1.column == coordinate2.column && coordinate1.row == coordinate2.row
    }

    _calculateMoveAnimation(animation) {

        if (!animation.started) {

            animation.piece    = this.parent.state.board.spots[animation.startsAt.row][animation.startsAt.column]
            animation.position = { ...animation.startsAt }
            animation.started  = true

            animation.distance = {
                column: Math.abs(animation.endsAt.column - animation.startsAt.column),
                row: Math.abs(animation.endsAt.row - animation.startsAt.row)
            }

            animation.direction = this._calculateDirection(animation.startsAt, animation.endsAt)

            this.parent.state.board.spots[animation.startsAt.row][animation.startsAt.column] = undefined
            this.moveAnimation = { piece: animation.piece, position: animation.position }

            const previousDirection = animation.previous ? this._calculateDirection(animation.previous, animation.startsAt) : undefined
            const noStraightPath = previousDirection && !this._compareCoordinate(previousDirection, animation.direction)

            this.moveIndicators.push({
                direction: this.parent.rotateDirection({ ...animation.direction }),
                position: { ...animation.startsAt },
                image: this.moveIndicators.length && !noStraightPath ? 1 : 2
            })

            noStraightPath && this.moveIndicators.push({
                position:  { ...animation.startsAt },
                direction: this.parent.rotateDirection({
                    column: previousDirection.column * -1,
                    row: previousDirection.row * -1,
                }),
                image: 3
            })

        }

        const distanceX = 10 * this.parent.deltatime * animation.direction.column
        const distanceY = 10 * this.parent.deltatime * animation.direction.row

        animation.distance.column -= Math.abs(distanceX)
        animation.distance.row -= Math.abs(distanceY)

        animation.position.column += distanceX
        animation.position.row += distanceY

        if (animation.distance.column <= 0 || animation.distance.row <= 0 || this.parent.screens.optionsScreen.options.get('animation') != 'true') {
            
            this.parent.state.board.spots[animation.endsAt.row][animation.endsAt.column] = animation.piece
            
            if (this.parent.screens.optionsScreen.options.enableSounds)
                this.parent.sounds.movePieceSound.play()

            animation.startsAt.column += animation.direction.column
            animation.startsAt.row    += animation.direction.row

            while (!this._compareCoordinate(animation.endsAt, animation.startsAt)) {
                
                if (!animation.jump || !this._compareCoordinate(animation.jump.position, animation.startsAt)) {
                    this.moveIndicators.push({
                        direction: this.parent.rotateDirection({ ...animation.direction }),
                        position: { ...animation.startsAt },
                        image: 1
                    })
                }

                animation.startsAt.column += animation.direction.column
                animation.startsAt.row    += animation.direction.row

            }

            if (animation.isLast)
                this.slotIndicator = { ...animation.endsAt }

            this.moveAnimation = undefined
            this.parent.dequeueAnimation()
            
        }

    }

    _calculateJumpAnimation(animation) {
        
        if (!animation.started) {
            
            this._calculateJumpParticles(animation.jump.position)

            this.parent.state.board.spots[animation.jump.position.row][animation.jump.position.column] = undefined
            this.parent.state.score[animation.jump.piece.player ? 0 : 1]++
            
            animation.numberOfShakes = 10
            animation.magnitude = 2
            animation.started = true
            animation.counter = 1

            animation.magnitudeUnit = animation.magnitude / animation.numberOfShakes

            this.jumpIndicators.push({
                position: { ...animation.jump.position }
            })

        }

        animation.magnitude -= animation.magnitudeUnit

        const randomX = Math.floor(Math.random() * (-animation.magnitude - animation.magnitude + 1)) + animation.magnitude
        const randomY = Math.floor(Math.random() * (-animation.magnitude - animation.magnitude + 1)) + animation.magnitude

        this.parent.board.offsetX = Math.round(randomX)
        this.parent.board.offsetY = Math.round(randomY)

        animation.counter++

        if (animation.counter >= animation.numberOfShakes || this.parent.screens.optionsScreen.options.get('animation') != 'true') {
            this.parent.board.offsetX = 0
            this.parent.board.offsetY = 0
            this.parent.dequeueAnimation()
        }

    }

    _calculateJumpParticles(position) {

        if (this.parent.screens.optionsScreen.options.get('animation') != 'true')
            return

        const piece = this.parent.state.board.spots[position.row][position.column]
        const rotatedPosition = this.parent.rotatePosition(position)

        const startX = Math.round(this.parent.board.left + rotatedPosition.column * 16)
        const startY = Math.round(this.parent.board.top  + rotatedPosition.row * 16)

        const middle = { x: startX + 8, y: startY + 8 }

        const angles = [
            1 * Math.PI     + Math.random() * (Math.PI / 2),
            3 * Math.PI / 2 + Math.random() * (Math.PI / 2),
            5 * Math.PI / 4 + Math.random() * (Math.PI / 2),
            5 * Math.PI / 4 + Math.random() * (Math.PI / 2),
            5 * Math.PI / 4 + Math.random() * (Math.PI / 2),
        ]
        
        const positions = [
            { x: startX + 1, y: startY + 1 },
            { x: startX + 8, y: startY + 1 },
            { x: startX + 5, y: startY + 6 },
            { x: startX + 1, y: startY + 8 },
            { x: startX + 7, y: startY + 9 }
        ]

        for (let index = 0; index < positions.length; index++) {

            const randomSpeed = 80 + Math.random() * 60

            this.particles.push({
                position: positions[index],
                player: piece.player,
                angle: angles[index],
                image: index + 1,
                speed: {
                    linear: randomSpeed,
                    gravity: 0,
                }
            })

        }

        for (let index = 0; index < (4 + Math.random() * 10); index++) {

            const randomAngle = 5 * Math.PI / 4 + Math.random() * (Math.PI / 2)
            const randomSize  = 1 + Math.round(Math.random())
            const randomSpeed = 100 + Math.random() * 80

            this.particles.push({
                position: { ...middle },
                angle: randomAngle,
                size: randomSize,
                speed: {
                    linear: randomSpeed,
                    gravity: 0,
                }
            })

        }

    }

    _calculateWinnerAnimation(animation) {

        const pieceOrUndefined = this.parent.state.board.spots[animation.position.row][animation.position.column]

        this.parent.configureWinner(pieceOrUndefined.player)
        this.parent.dequeueAnimation()

    }

    _calculatePromotionAnimation(animation) {

        if (!animation.started) {

            animation.piece = this.parent.state.board.spots[animation.position.row][animation.position.column]
            animation.transparency = 0
            animation.direction = 1
            animation.offsetY = -0.5
            animation.started = true

            if (this.parent.screens.optionsScreen.options.enableSounds)
                this.parent.sounds.promotionSound.play()
            
            this.promotionAnimation = animation

        }

        animation.transparency = Math.min(animation.transparency + 0.50 * this.parent.deltatime * animation.direction, 1.25)
        
        if (animation.transparency >= 1.25)
            animation.offsetY = Math.min(animation.offsetY + 0.50 * this.parent.deltatime, 0)

        if (animation.offsetY == 0)
            animation.direction = -1.5

        if (animation.transparency <= 0 || this.parent.screens.optionsScreen.options.get('animation') != 'true') {

            animation.piece.promoted = true

            this.promotionAnimation = undefined           
            this.parent.dequeueAnimation()

        }

    }

    _calculateReverseTurnAnimation() {

        this.parent.reverseTurn()

        if (this.parent.state.turn == this.parent.state.indexOf)
            this.parent.events.emit('request-find-all-movements')

        this.parent.dequeueAnimation()

    }

    // --> Rendering Function

    render(deltatime) {

        this._renderPlayerUp()
        this._renderTimer()
        this._renderScore()
        this._renderOptionsButton()
        this._renderPlayerDown()

        this.parent.board.left += this.parent.board.offsetX
        this.parent.board.top  += this.parent.board.offsetY
        
        this._renderOutline()
        this._renderSpots()
        this._renderIndicators()
        this._renderSelections()
        this._renderPieces()
        this._renderMoveAnimation()
        this._renderParticles()
        this._renderPromotionAnimation()

        this.parent.board.left -= this.parent.board.offsetX
        this.parent.board.top  -= this.parent.board.offsetY

    }

    // --> Board Render Functions

    _renderOutline() {
        this.context.fillStyle = '#071916'
        this.context.fillRect(this.parent.board.left - 1, this.parent.board.top - 1, this.parent.board.width + 2, this.parent.board.height + 2)
    }

    _renderSpots() {
        for (let row = 0; row < this.parent.state.board.rows + 1; row++) {
            for (let column = 0; column < this.parent.state.board.columns; column++) {
                this._renderSpot(column, row)
            }
        }
    }
    
    _renderSpot(column, row) {

        const isLastSpot = row == this.parent.state.board.rows
        const palettes = isLastSpot ? ['#dfeae2', '#207567'] : ['#f8fffa', '#8dc3a7']

        this.context.fillStyle = (column + row) % 2 == (isLastSpot ? 1 : 0) ? palettes[0] : palettes[1]
        this.context.fillRect(this.parent.board.left + 16 * column, this.parent.board.top + 16 * row, 16, isLastSpot ? 6 : 16)

    }

    _renderIndicators() {

        if (this.selection)
            return

        const directions = [
            { column:  1, row: -1 },
            { column:  1, row:  1 },
            { column: -1, row: -1 },
            { column: -1, row:  1 }
        ]
        
        for (let indicator of this.moveIndicators) {
            
            const rotatedPosition  = this.parent.rotatePosition(indicator.position)
            const moveImage = this.parent.images[`indicatorMove${indicator.image}`]

            const index = directions.findIndex((direction) => direction.column == indicator.direction.column && direction.row == indicator.direction.row)

            this.context.drawImage(moveImage, moveImage.width / 4 * index, 0, moveImage.width / 4, moveImage.height, Math.round(this.parent.board.left + rotatedPosition.column * 16), Math.round(this.parent.board.top + rotatedPosition.row * 16), moveImage.width / 4, moveImage.height)

        }

        for (let indicator of this.jumpIndicators) {

            const rotatedPosition  = this.parent.rotatePosition(indicator.position)

            this.context.drawImage(this.parent.images.indicatorJump, Math.round(this.parent.board.left + rotatedPosition.column * 16), Math.round(this.parent.board.top + rotatedPosition.row * 16))

        }

        if (this.slotIndicator) {

            const rotatedPosition = this.parent.rotatePosition(this.slotIndicator)
    
            this.context.drawImage(this.parent.images.indicatorSlot, Math.round(this.parent.board.left + rotatedPosition.column * 16), Math.round(this.parent.board.top + rotatedPosition.row * 16))

        }

    }

    _renderPieces() {
        for (let row = 0; row < this.parent.state.board.rows; row++) {
            for (let column = 0; column < this.parent.state.board.columns; column++) {
                const piece = this.parent.state.board.spots[row][column]
                if (piece) this._renderPiece(column, row, piece)
            }
        }
    }

    _renderPiece(column, row, piece) {

        const image = piece.player ? this.parent.images.pieceBlack : this.parent.images.pieceWhite
        const position = this.parent.rotatePosition({ column, row })

        this.context.drawImage(image, Math.round(this.parent.board.left + position.column * 16 + 2), Math.round(this.parent.board.top + position.row * 16 + 2))

        if (piece.promoted) this._renderCrown(position.column, position.row)

    }

    _renderCrown(column, row) {        
        this.context.drawImage(this.parent.images.pieceCrown, Math.round(this.parent.board.left + column * 16 + 3), Math.round(this.parent.board.top + row * 16 - 2))
    }

    _renderCrownSelection(column, row) {        
        this.context.drawImage(this.parent.images.selectionCrown, Math.round(this.parent.board.left + column * 16 + 2), Math.round(this.parent.board.top + row * 16 - 3))
    }

    _renderSelections() {
        
        if (!this.selection)
            return this.movements?.forEach(movement => this._renderSelection(movement.startsAt.column, movement.startsAt.row))    
        
        const movementFilter = (movement) => movement.startsAt.column == this.selection.column && movement.startsAt.row == this.selection.row
        const movements = this.movements.filter(movementFilter)

        movements.length && this._renderSelection(this.selection.column, this.selection.row)

        for (let movement of movements) {
            for (let position of movement.positions) {
                this._renderSelection(position.column, position.row)
            }
            for (let jump of movement.jumps) {
                this._renderSelection(jump.position.column, jump.position.row)
            }
        }

    }

    _renderSelection(column, row) {

        const position = this.parent.rotatePosition({ column, row })

        const pieceOrUndefined = this.parent.state.board.spots[row][column]
        const image = this.parent.images[this.promotionAnimation ? 'selectionQueen' : (pieceOrUndefined ? (pieceOrUndefined.player == this.parent.state.indexOf ? "selectionPiece" : "selectionJump") : "selectionSpot")]

        this.context.drawImage(image, this.parent.board.left + position.column * 16, this.parent.board.top + position.row * 16)

    }

    _renderMoveAnimation() {
        if (this.moveAnimation) {
            this._renderPiece(this.moveAnimation.position.column, this.moveAnimation.position.row, this.moveAnimation.piece)
        }
    }

    _renderParticles() {

        const slowdown = 40 * this.parent.deltatime
        const gravity = 200 * this.parent.deltatime

        this.context.fillStyle = '#000000'

        for (let index = 0; index < this.particles.length; index++) {

            const particle = this.particles.at(index)

            particle.speed.linear  = Math.max(particle.speed.linear - slowdown, 0)
            particle.speed.gravity = particle.speed.gravity + gravity

            const speedX = particle.speed.linear * Math.cos(particle.angle)
            const speedY = particle.speed.linear * Math.sin(particle.angle) + particle.speed.gravity

            particle.position.x += speedX * this.parent.deltatime
            particle.position.y += speedY * this.parent.deltatime

            const image = this.parent.images[`particle0${particle.image}`]

            if (image)
                this.context.drawImage(image, image.width / 2 * particle.player, 0, image.width / 2, image.height, Math.round(particle.position.x), Math.round(particle.position.y), image.width / 2, image.height)
            else
                this.context.fillRect(Math.round(particle.position.x - particle.size / 2), Math.round(particle.position.y - particle.size / 2) - 1, particle.size, particle.size)

            if (particle.position.y > this.parent.canvas.height) {
                this.particles.splice(index, 1)
                index = index - 1
            }

        }

    }

    _renderPromotionAnimation() {

        if (!this.promotionAnimation)
            return

        const position = this.parent.rotatePosition(this.promotionAnimation.position)
        const percentage = Math.min(this.promotionAnimation.transparency, 1)

        this.context.globalAlpha = 0.75 * percentage
        this.parent._renderBackground()

        this.context.globalAlpha = percentage
        this._renderCrownSelection(position.column, position.row + this.promotionAnimation.offsetY)
        this._renderSelection(this.promotionAnimation.position.column, this.promotionAnimation.position.row)
        
        this.context.globalAlpha = 1.00
        this._renderPiece(this.promotionAnimation.position.column, this.promotionAnimation.position.row, this.promotionAnimation.piece)
        
        if (this.promotionAnimation.direction >= 0)
            this.context.globalAlpha = percentage
    
        this._renderCrown(position.column, position.row + this.promotionAnimation.offsetY)

        this.context.globalAlpha = 1.00

    }

    // --> Extra-Board Render Functions

    _renderPlayerUp() {
        
        const players = this.parent.rotatePlayers().map(player => player || '???')
        const characters = this.parent.images.charactersGreen

        const [ left, top ] = [ this.parent.board.left, 2 ]
        
        if (this.parent.rotateTurn() == 0)
            this.context.drawImage(this.parent.images.indicatorLeft, left + 10 + Math.min(players[0].length, 14) * 4, top + 1)
        else
            this.context.globalAlpha = 0.60  

        this.context.drawImage(this.parent.images.profilePicture, left, top)

        this.parent._renderString(players[0], left + 9, top + 1, characters, 14)

        this.context.globalAlpha = 1.00
        
    }

    _renderTimer() {
        
        const difference = (new Date().getTime() - new Date(this.parent.state.createdAt).getTime()) / 1000
        const minutes = String(Math.floor(difference / 60))
        const seconds = String(Math.floor(difference - minutes * 60))
        
        const [ left, top ] = [ this.parent.board.left + this.parent.board.width, 3 ]

        const characters = this.parent.images.charactersGreen

        this.context.globalAlpha = 0.60

        this.parent._renderString(seconds.length == 1 ? '0'.concat(seconds) : seconds, left - 7, top, characters, 2)
        
        this.context.drawImage(this.parent.images.characterColon, left - 10, top)
        
        this.parent._renderString(minutes.length == 1 ? '0'.concat(minutes) : minutes, left - 17, top, characters, 2)

        this.context.globalAlpha = 1.00

    }

    _renderScore() {

        const top  = this.parent.board.top + Math.floor((this.parent.board.height - 6) / 2 - 7)
        const left = this.parent.board.left - 3
        
        const characters = this.parent.images.charactersGreen
        const score = this.parent.rotateScore()

        this.context.globalAlpha = 0.60

        this.parent._renderString(String(score[0]).split('').reverse().join(''), left - 3, top, characters, Infinity, -1)
        
        this.context.drawImage(this.parent.images.characterCross, left - 3, top + 6)
        
        this.parent._renderString(String(score[1]).split('').reverse().join(''), left - 3, top + 10, characters, Infinity, -1)

        this.context.globalAlpha = 1.00

    }

    _renderOptionsButton() {
        
        const optionsButton = this.parent.getElement('options-button')
        const characters = this.parent.images.charactersGreen
        
        if (!optionsButton.hovering)
            this.context.globalAlpha = 0.60
        
        this.context.drawImage(this.parent.images.characterLines, optionsButton.left, optionsButton.top)
        
        this.parent._renderString(optionsButton.caption, optionsButton.left + 6, optionsButton.top, characters)

        this.context.globalAlpha = 1.00

    }

    _renderPlayerDown() {

        const players = this.parent.rotatePlayers().map(player => player || '???')
        const characters = this.parent.images.charactersGreen

        const left = this.parent.board.left + this.parent.board.width - 7
        const top = this.parent.board.top + this.parent.board.height + 3

        if (this.parent.rotateTurn() == 1)
            this.context.drawImage(this.parent.images.indicatorRight, left - players[1].length * 4 - 11, top + 1)
        else
            this.context.globalAlpha = 0.60

        this.context.drawImage(this.parent.images.profilePicture, left, top)
        
        this.parent._renderString(players[1].split('').reverse().join(''), left - 5, top + 1, characters, 14, -1)

        this.context.globalAlpha = 1.00

    }

    // --> Final Class

}