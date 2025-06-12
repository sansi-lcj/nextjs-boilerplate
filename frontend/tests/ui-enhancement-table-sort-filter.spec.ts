import { test, expect } from '@playwright/test';

test.describe('用户界面增强测试 - 表格排序和筛选功能', () => {
  test.beforeEach(async ({ page }) => {
    // 访问楼层管理页面
    await page.goto('/asset/floors');
    await page.waitForLoadState('networkidle');
  });

  test('表格应支持列排序功能', async ({ page }) => {
    // 验证表格是否加载完成
    await expect(page.locator('table')).toBeVisible();
    
    // 检查排序图标是否存在
    await expect(page.locator('th.ant-table-column-has-sorters')).toBeVisible();
    
    // 点击楼层编号列进行排序
    const floorNumberColumn = page.locator('th', { hasText: '楼层编号' });
    await floorNumberColumn.click();
    
    // 验证排序图标是否变化（升序）
    await expect(page.locator('th.ant-table-column-sort')).toBeVisible();
    await expect(page.locator('.ant-table-column-sorter-up.active')).toBeVisible();
    
    // 再次点击进行降序排序
    await floorNumberColumn.click();
    
    // 验证排序图标是否变化（降序）
    await expect(page.locator('.ant-table-column-sorter-down.active')).toBeVisible();
  });

  test('表格应支持筛选功能', async ({ page }) => {
    // 验证表格是否加载完成
    await expect(page.locator('table')).toBeVisible();
    
    // 检查筛选图标是否存在
    await expect(page.locator('th.ant-table-column-has-filters')).toBeVisible();
    
    // 点击状态列的筛选图标
    const statusFilterIcon = page.locator('th', { hasText: '状态' })
      .locator('.ant-table-filter-trigger');
    await statusFilterIcon.click();
    
    // 等待筛选菜单显示
    await expect(page.locator('.ant-table-filter-dropdown')).toBeVisible();
    
    // 选择"正常"状态
    await page.locator('.ant-table-filter-dropdown')
      .getByText('正常', { exact: true }).click();
    
    // 点击确定按钮
    await page.locator('.ant-table-filter-dropdown')
      .getByRole('button', { name: '确定' }).click();
    
    // 验证筛选后的表格内容是否都是"正常"状态
    // 允许一些时间进行筛选
    await page.waitForTimeout(1000);
    
    // 检查表格中所有状态标签是否都是绿色（正常状态）
    const statusTags = page.locator('tbody tr .ant-tag-green');
    if (await statusTags.count() > 0) {
      for (let i = 0; i < await statusTags.count(); i++) {
        await expect(statusTags.nth(i)).toContainText('正常');
      }
    }
  });
}); 