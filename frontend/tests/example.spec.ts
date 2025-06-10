import { test, expect } from '@playwright/test';

test('主页加载正常', async ({ page }) => {
  await page.goto('/');

  // 等待页面加载
  await page.waitForLoadState('networkidle');

  // 检查页面标题
  await expect(page).toHaveTitle(/楼宇资产管理平台/);

  // 检查主要元素存在
  const rootElement = page.locator('#root');
  await expect(rootElement).toBeVisible();
});

test('登录页面功能测试', async ({ page }) => {
  await page.goto('/');

  // 如果有登录表单，测试登录功能
  const loginButton = page.locator('button:has-text("登录")');
  
  if (await loginButton.isVisible()) {
    // 检查用户名输入框
    const usernameInput = page.locator('input[placeholder*="用户名"], input[id*="username"]');
    await expect(usernameInput).toBeVisible();

    // 检查密码输入框
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // 测试输入功能
    await usernameInput.fill('admin');
    await passwordInput.fill('admin123');

    // 检查登录按钮可点击
    await expect(loginButton).toBeEnabled();
  }
});

test('响应式设计测试', async ({ page }) => {
  await page.goto('/');
  
  // 测试移动端视口
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForLoadState('networkidle');
  
  // 检查页面在移动端正常显示
  const rootElement = page.locator('#root');
  await expect(rootElement).toBeVisible();
  
  // 测试桌面端视口
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForLoadState('networkidle');
  
  // 检查页面在桌面端正常显示
  await expect(rootElement).toBeVisible();
}); 