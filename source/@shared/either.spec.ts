import { Either, Left, Right, left, right } from "./either"
import { it, expect } from 'vitest'

function functionTest(expression: boolean): Either<number, string> {
    if (expression)
        return right('Hello, World!')
    return left(404)
}

it('should be able to return correct answer', () => {
    const  answer = functionTest(true)
    expect(answer).toBeInstanceOf(Right)
    expect(answer.value).toBe("Hello, World!")
})

it('should be able to return incorrect answer', () => {
    const  answer = functionTest(false)
    expect(answer).toBeInstanceOf(Left)
    expect(answer.value).toBe(404)
})