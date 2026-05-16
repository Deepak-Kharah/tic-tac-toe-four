import { describe, it, expect, beforeEach } from 'vitest'
import { getDefaultBoard, resetGame, board, isXTurn, winnerSignal, history, disappearing } from '../signal'

describe('signal', () => {
  beforeEach(() => {
    resetGame()
  })

  describe('getDefaultBoard', () => {
    it('should generate a fresh, detached 3x3 grid where all cells are null', () => {
      const board1 = getDefaultBoard()
      
      // Check structure
      expect(board1).toHaveLength(3)
      expect(board1[0]).toHaveLength(3)
      expect(board1[1]).toHaveLength(3)
      expect(board1[2]).toHaveLength(3)
      
      // Check all cells are properly initialized
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(board1[row][col]).toEqual({
            value: null,
            willDisappear: false,
            winningCell: false
          })
        }
      }
    })

    it('should return structurally identical but referentially distinct boards', () => {
      const board1 = getDefaultBoard()
      const board2 = getDefaultBoard()
      
      // Should be structurally equal
      expect(board1).toEqual(board2)
      
      // Should be referentially different (preventing state bleed)
      expect(board1).not.toBe(board2)
      expect(board1[0]).not.toBe(board2[0])
      expect(board1[0][0]).not.toBe(board2[0][0])
      
      // Mutating one shouldn't affect the other
      board1[0][0].value = 'X'
      expect(board1[0][0].value).toBe('X')
      expect(board2[0][0].value).toBeNull()
    })
  })

  describe('resetGame', () => {
    it('should reset all signals to their initial state', () => {
      // Modify all signals
      board.value[0][0].value = 'X'
      board.value[1][1].value = 'O'
      isXTurn.value = false
      winnerSignal.value = 'X'
      history.value = [{ x: 0, y: 0 }, { x: 1, y: 1 }]
      disappearing.value = { x: 0, y: 0 }
      
      // Reset
      resetGame()
      
      // Verify everything is reset
      expect(board.value).toEqual(getDefaultBoard())
      expect(isXTurn.value).toBe(true)
      expect(winnerSignal.value).toBeNull()
      expect(history.value).toEqual([])
      expect(disappearing.value).toBeNull()
    })

    it('should create a fresh board reference on reset', () => {
      const originalBoard = board.value
      resetGame()
      expect(board.value).not.toBe(originalBoard)
    })
  })

  describe('signal initialization', () => {
    it('should initialize all signals with correct default values', () => {
      expect(board.value).toEqual(getDefaultBoard())
      expect(isXTurn.value).toBe(true)
      expect(winnerSignal.value).toBeNull()
      expect(history.value).toEqual([])
      expect(disappearing.value).toBeNull()
    })
  })
})