import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

describe('math', () => {
    test('sum', () => {
        // Arrange
        const a = 2
        const b = 3

        // Act
        const result = a * b

        // Assert
        assert.strictEqual(result, 6)
    })
})
