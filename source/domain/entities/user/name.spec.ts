import { InvalidName } from './errors/invalid-name'
import { Left, Right } from '../../../@shared/either'
import { it, expect, describe } from 'vitest'
import { Name } from './name'

describe('Name domain', () => {
    
    it('should be able to create a valid name', () => {
        
        const object = Name.create('Victor')

        expect(object).instanceOf(Right)

        if (object.isRight()) {
            expect(object.value).instanceOf(Name)
            expect(object.value.value).toBe('Victor')
        }

    })

    it('should not be able to create a name with length less or equal than 2', () => {

        const object = Name.create('Vi')

        expect(object).instanceOf(Left)

        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidName)
        }
        
    })
    
    it('should not be able to create a name with spaces before and after', () => {
        
        const object = Name.create(' Victor ')
    
        expect(object).instanceOf(Left)
    
        if (object.isLeft()) {
            expect(object.value).instanceOf(InvalidName)
        }

    })

})