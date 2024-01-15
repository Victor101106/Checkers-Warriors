import { InMemoryUserRepository } from "./in-memory-user-repository"
import { Right } from "../../../shared/either"
import { User } from "../../../domain/entities/user/user"
import { describe, expect, it } from "vitest"

describe('In-memory user repository', () => {

    const inMemoryUserRepository = new InMemoryUserRepository()

    const userOrError = User.create({
        password: { value: 'Password123.' },
        email: 'email@gmail.com',
        name: 'Name',
    })

    expect(userOrError).instanceOf(Right)

    const user = userOrError.value as User
    
    it('should be able to save and find by id a user in repository', async () => {

        await inMemoryUserRepository.save(user)

        const userOrUndefined = await inMemoryUserRepository.findById(user.id.value)
    
        expect(userOrUndefined).toBe(user)

    })

    it('should be able to get a user by email in repository', async () => {

        const userOrUndefined = await inMemoryUserRepository.findByEmail('email@gmail.com')

        expect(userOrUndefined).toBe(user)

    })

    it('should be able to update a user in repository', async () => {

        const updatedUserOrError = User.create({
            password: { value: 'NewPassword123.' },
            createdAt: user.createdAt,
            email: user.email.value,
            name: user.name.value,
            id: user.id.value
        })

        expect(updatedUserOrError).instanceOf(Right)

        const updateUser = updatedUserOrError.value as User

        await inMemoryUserRepository.update(updateUser)

        const userOrUndefined = await inMemoryUserRepository.findById(updateUser.id.value)

        expect(userOrUndefined).toBe(updateUser)

    })
    
    it('should not be able to get a user after be deleted in repository', async () => {
        
        await inMemoryUserRepository.delete(user.id.value)

        const userOrUndefined = await inMemoryUserRepository.findById(user.id.value)

        expect(userOrUndefined).toBeFalsy()

    })

})