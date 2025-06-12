import { test, expect } from '@playwright/test';

test.describe('用户界面增强测试 - 移动端适配', () => {
  test.beforeEach(async ({ page }) => {
    // 访问楼层管理页面
    await page.goto('/asset/floors');
    await page.waitForLoadState('networkidle');
  });

  test('在手机视口下应正确显示', async ({ page }) => {
    // 设置为手机尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // 验证页面是否正常加载
    await expect(page.locator('table')).toBeVisible();
    
    // 检查响应式菜单按钮是否可见（汉堡菜单）
    await expect(page.locator('.ant-layout-sider-trigger, .ant-menu-fold-icon')).toBeVisible();
    
    // 表格应自适应屏幕宽度
    const tableWidth = await page.locator('table').evaluate((el: HTMLElement) => el.offsetWidth);
    expect(tableWidth).toBeLessThanOrEqual(375);
    
    // 表格应有水平滚动能力
    const hasScrollX = await page.locator('.ant-table-body').evaluate((el: HTMLElement) => {
      return el.scrollWidth > el.clientWidth;
    });
    expect(hasScrollX).toBeTruthy();
  });

  test('在平板视口下应正确显示', async ({ page }) => {
    // 设置为平板尺寸
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    // 验证页面是否正常加载
    await expect(page.locator('table')).toBeVisible();
    
    // 页面布局应适应平板宽度
    const contentWidth = await page.locator('.ant-layout-content').evaluate((el: HTMLElement) => el.offsetWidth);
    expect(contentWidth).toBeLessThanOrEqual(768);
    
    // 表格应有适当的列展示
    const tableWidth = await page.locator('table').evaluate((el: HTMLElement) => el.offsetWidth);
    expect(tableWidth).toBeLessThanOrEqual(768);
  });

  test('在手机视口下搜索框应响应式展示', async ({ page }) => {
    // 设置为手机尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // 验证搜索框存在
    const searchInput = page.locator('input[placeholder*="搜索"]');
    await expect(searchInput).toBeVisible();
    
    // 检查搜索框宽度是否适应屏幕
    const searchWidth = await searchInput.evaluate((el: HTMLElement) => el.offsetWidth);
    expect(searchWidth).toBeLessThanOrEqual(375);
    
    // 操作按钮应正确显示
    await expect(page.locator('button:has-text("新增楼层")')).toBeVisible();
  });

  test('在手机视口下表单应响应式布局', async ({ page }) => {
    // 设置为手机尺寸
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // 点击新增楼层按钮
    await page.getByRole('button', { name: '新增楼层' }).click();
    
    // 等待模态框显示
    await expect(page.locator('.ant-modal')).toBeVisible();
    
    // 验证模态框宽度是否适应屏幕
    const modalWidth = await page.locator('.ant-modal').evaluate((el: HTMLElement) => el.offsetWidth);
    expect(modalWidth).toBeLessThanOrEqual(375);
    
    // 表单项应正确显示
    await expect(page.locator('.ant-form-item')).toBeVisible();
    
    // 输入框应适应屏幕宽度
    const inputWidth = await page.locator('.ant-form-item').first().evaluate((el: HTMLElement) => el.offsetWidth);
    expect(inputWidth).toBeLessThanOrEqual(modalWidth);
  });
}); 