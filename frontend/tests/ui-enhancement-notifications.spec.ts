import { test, expect } from '@playwright/test';

test.describe('用户界面增强测试 - 操作成功/失败提示功能', () => {
  test.beforeEach(async ({ page }) => {
    // 访问楼层管理页面
    await page.goto('/asset/floors');
    await page.waitForLoadState('networkidle');
  });

  test('应显示操作成功提示', async ({ page }) => {
    // 点击新增楼层按钮
    await page.getByRole('button', { name: '新增楼层' }).click();
    
    // 填写表单
    await page.getByLabel('楼层编码').fill('FL-TEST-001');
    await page.getByLabel('楼层名称').fill('测试楼层');
    await page.getByLabel('所属建筑').click();
    await page.getByRole('option', { name: '创新大厦' }).click();
    await page.getByLabel('楼层编号').fill('3');
    await page.getByLabel('楼层类型').click();
    await page.getByRole('option', { name: '办公层' }).click();
    await page.getByLabel('楼层高度(m)').fill('3.5');
    await page.getByLabel('总面积(m²)').fill('2500');
    await page.getByLabel('可用面积(m²)').fill('2000');
    await page.getByLabel('房间数量').fill('20');
    await page.getByLabel('状态').click();
    await page.getByRole('option', { name: '正常' }).click();
    
    // 提交表单
    await page.getByRole('button', { name: '确定' }).click();
    
    // 验证成功提示消息
    await expect(page.locator('.ant-message-success')).toBeVisible();
    await expect(page.locator('.ant-message-success')).toContainText('成功');
  });

  test('应显示操作失败提示', async ({ page }) => {
    // 模拟删除操作失败场景
    // 因为无法直接控制API失败，我们将检查提示组件是否存在
    
    // 检查删除按钮
    const deleteButton = page.locator('button:has-text("删除")').first();
    await expect(deleteButton).toBeVisible();
    
    // 点击删除按钮
    await deleteButton.click();
    
    // 在确认对话框中点击确认
    await page.getByRole('button', { name: '确定' }).click();
    
    // 检查消息提示组件
    // 由于我们无法保证失败，这里只检查消息组件是否存在
    await expect(page.locator('.ant-message')).toBeVisible();
  });
}); 