import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate from homepage to game', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Verify we're on the homepage
    await expect(page.getByText('Tic Tac Toe Four')).toBeVisible();
    await expect(page.getByText("It's your regular Tic Tac Toe, but with a twist")).toBeVisible();
    
    // Click "Play game" link
    await page.getByTestId('play-game-link').click();
    
    // Verify we navigated to the game page
    await expect(page).toHaveURL('/game');
    
    // Verify the game board is visible
    await expect(page.locator('[data-testid^="cell-"]')).toHaveCount(9);
    
    // Verify player indicators are visible
    await expect(page.getByTestId('active-player-x')).toBeVisible();
    await expect(page.getByTestId('active-player-o')).toBeVisible();
  });
});