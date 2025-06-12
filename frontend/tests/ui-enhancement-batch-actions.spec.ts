import { test, expect } from '@playwright/test';

test.describe('用户界面增强测试 - 批量操作功能', () => {
  test.beforeEach(async ({ page }) => {
    // 访问楼层管理页面
    await page.goto('/asset/floors');
    await page.waitForLoadState('networkidle');
  });

  test('应支持表格行多选功能', async ({ page }) => {
    // 验证表格是否加载完成
    await expect(page.locator('table')).toBeVisible();
    
    // 验证表格是否有选择框列
    await expect(page.locator('th.ant-table-selection-column')).toBeVisible();
    
    // 选择第一行
    await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
    
    // 验证行是否被选中
    await expect(page.locator('tbody tr').first().locator('input[type="checkbox"]')).toBeChecked();
  });

  test('选中行后应显示批量操作按钮', async ({ page }) => {
    // 验证表格是否加载完成
    await expect(page.locator('table')).toBeVisible();
    
    // 批量操作组件初始应该不可见
    await expect(page.locator('.batch-actions-bar')).not.toBeVisible();
    
    // 选择多行
    await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
    await page.locator('tbody tr').nth(1).locator('input[type="checkbox"]').click();
    
    // 验证批量操作组件是否显示
    await expect(page.locator('.batch-actions-bar')).toBeVisible();
    
    // 验证是否显示已选择数量
    await expect(page.locator('.batch-actions-bar')).toContainText('已选择 2 项');
    
    // 验证是否有批量操作按钮
    await expect(page.locator('button:has-text("批量操作")')).toBeVisible();
  });

  test('应能执行批量删除操作', async ({ page }) => {
    // 验证表格是否加载完成
    await expect(page.locator('table')).toBeVisible();
    
    // 选择多行
    await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
    await page.locator('tbody tr').nth(1).locator('input[type="checkbox"]').click();
    
    // 验证批量操作组件是否显示
    await expect(page.locator('.batch-actions-bar')).toBeVisible();
    
    // 点击批量操作按钮
    await page.locator('button:has-text("批量操作")').click();
    
    // 等待下拉菜单显示
    await expect(page.locator('.ant-dropdown-menu')).toBeVisible();
    
    // 点击批量删除选项
    await page.locator('.ant-dropdown-menu-item:has-text("批量删除")').click();
    
    // 等待确认对话框显示
    await expect(page.locator('.ant-modal-confirm')).toBeVisible();
    
    // 确认删除
    await page.locator('.ant-modal-confirm-btns').getByRole('button', { name: '确定删除' }).click();
    
    // 验证成功提示消息
    await expect(page.locator('.ant-message-success')).toBeVisible();
    await expect(page.locator('.ant-message-success')).toContainText('删除成功');
  });

  test('应能取消选择', async ({ page }) => {
    // 验证表格是否加载完成
    await expect(page.locator('table')).toBeVisible();
    
    // 选择多行
    await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
    await page.locator('tbody tr').nth(1).locator('input[type="checkbox"]').click();
    
    // 验证批量操作组件是否显示
    await expect(page.locator('.batch-actions-bar')).toBeVisible();
    
    // 点击取消选择按钮
    await page.locator('button:has-text("取消选择")').click();
    
    // 验证批量操作组件是否隐藏
    await expect(page.locator('.batch-actions-bar')).not.toBeVisible();
    
    // 验证复选框是否取消选中
    await expect(page.locator('tbody tr').first().locator('input[type="checkbox"]')).not.toBeChecked();
    await expect(page.locator('tbody tr').nth(1).locator('input[type="checkbox"]')).not.toBeChecked();
  });
}); 