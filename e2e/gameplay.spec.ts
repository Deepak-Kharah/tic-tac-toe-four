import { test, expect } from '@playwright/test';

test.describe('Gameplay', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to game page before each test
    await page.goto('/game');
    
    // Wait for the game board to be ready
    await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(9);
  });

  test('should handle endless play without crashing (tie avoidance)', async ({ page }) => {
    const cells = page.locator('[data-testid^="cell-"]');
    
    // Make 10+ moves in a pattern that doesn't win but tests disappearing mechanic
    const movePattern = [0, 1, 3, 4, 6, 7, 2, 5, 8, 0, 1]; // More than 9 moves to test disappearing
    
    for (let i = 0; i < movePattern.length; i++) {
      const moveIndex = movePattern[i];
      const cell = cells.nth(moveIndex);
      
      // Only click if the cell is enabled
      if (await cell.isEnabled()) {
        await cell.click();
        
        // Wait for the click to take effect by checking the cell state
        await expect(cell).toBeDisabled();
      }
    }
    
    // Verify the game hasn't crashed - UI should still be responsive
    await expect(cells.first()).toBeVisible();
    
    // Verify at least some cells are enabled (due to disappearing mechanic)
    const enabledCells = await cells.locator(':enabled').count();
    expect(enabledCells).toBeGreaterThan(0);
  });

  test('should handle complete match flow with X winning', async ({ page }) => {
    const cells = page.locator('[data-testid^="cell-"]');
    
    // Play a winning sequence for X (top row: 0, 1, 2)
    await cells.nth(0).click(); // X at (0,0)
    await cells.nth(3).click(); // O at (1,0)
    await cells.nth(1).click(); // X at (0,1)  
    await cells.nth(4).click(); // O at (1,1)
    await cells.nth(2).click(); // X at (0,2) - X WINS!
    
    // Wait for win state by checking for "New game" button appearance
    const newGameButton = page.getByTestId('new-game-btn');
    await expect(newGameButton).toBeVisible();
    
    // Verify all cells are disabled after win
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toBeDisabled();
    }
    
    // Verify "New game" button is clickable
    await expect(newGameButton).toBeEnabled();
    
    // Click "New game" to reset
    await newGameButton.click();
    
    // Verify board is reset - cells should be enabled again
    await expect(cells.nth(0)).toBeEnabled();
    await expect(cells.nth(4)).toBeEnabled();
    await expect(cells.nth(8)).toBeEnabled();
  });

  test('should handle interrupt flow - new game during active play', async ({ page }) => {
    const cells = page.locator('[data-testid^="cell-"]');
    
    // Make a few moves but don't win
    await cells.nth(0).click(); // X
    await cells.nth(1).click(); // O  
    await cells.nth(2).click(); // X
    
    // Verify some cells are disabled
    await expect(cells.nth(0)).toBeDisabled();
    await expect(cells.nth(1)).toBeDisabled();
    await expect(cells.nth(2)).toBeDisabled();
    
    // Click "New game" during active play
    const newGameButton = page.getByTestId('new-game-btn');
    await expect(newGameButton).toBeVisible();
    await newGameButton.click();
    
    // Should open a confirmation dialog/drawer
    // Look for confirmation text
    const confirmText = page.getByText(/start over/i);
    await expect(confirmText).toBeVisible();
    
    // Click confirm
    const confirmButton = page.getByTestId('new-game-btn-confirm');
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();
    
    // Wait for reset to complete by checking first cell is enabled
    await expect(cells.nth(0)).toBeEnabled();
    
    // Verify board is completely reset - all cells should be enabled
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toBeEnabled();
    }
  });

  test('should display correct pieces (X and O)', async ({ page }) => {
    const cells = page.locator('[data-testid^="cell-"]');
    
    // Make first move (should be X)
    await cells.nth(0).click();
    
    // Verify X piece is displayed
    await expect(cells.nth(0).locator('[class*="cross"]')).toBeVisible();
    
    // Make second move (should be O)
    await cells.nth(1).click();
    
    // Verify O piece is displayed  
    await expect(cells.nth(1).locator('[class*="circle"]')).toBeVisible();
    
    // Verify pieces persist after additional moves
    await cells.nth(2).click(); // X
    await expect(cells.nth(0).locator('[class*="cross"]')).toBeVisible();
    await expect(cells.nth(1).locator('[class*="circle"]')).toBeVisible();
    await expect(cells.nth(2).locator('[class*="cross"]')).toBeVisible();
  });

  test('should handle disappearing pieces mechanic', async ({ page }) => {
    const cells = page.locator('[data-testid^="cell-"]');
    
    // Make 6 moves to trigger the disappearing mechanic
    await cells.nth(0).click(); // X - move 1 (will disappear after move 6)
    await cells.nth(1).click(); // O - move 2
    await cells.nth(2).click(); // X - move 3  
    await cells.nth(3).click(); // O - move 4
    await cells.nth(4).click(); // X - move 5
    await cells.nth(5).click(); // O - move 6 (should trigger disappearing on move 1)
    
    // Wait for disappearing indicator to appear on first cell
    await expect(cells.nth(0)).toHaveAttribute('data-disappearing', 'true');
    
    // Make 7th move
    await cells.nth(6).click(); // X - move 7 (should clear move 1)
    
    // First cell should be enabled again (cleared) - Playwright waits automatically
    await expect(cells.nth(0)).toBeEnabled();
  });
});