# Test info

- Name: 用户界面增强测试 - 批量操作功能 >> 应支持表格行多选功能
- Location: /Users/lichengjie/nextjs-boilerplate/frontend/tests/ui-enhancement-batch-actions.spec.ts:10:7

# Error details

```
Error: page.goto: Test ended.
Call log:
  - navigating to "http://localhost:3000/asset/floors", waiting until "load"

    at /Users/lichengjie/nextjs-boilerplate/frontend/tests/ui-enhancement-batch-actions.spec.ts:6:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('用户界面增强测试 - 批量操作功能', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // 访问楼层管理页面
>  6 |     await page.goto('/asset/floors');
     |                ^ Error: page.goto: Test ended.
   7 |     await page.waitForLoadState('networkidle');
   8 |   });
   9 |
  10 |   test('应支持表格行多选功能', async ({ page }) => {
  11 |     // 验证表格是否加载完成
  12 |     await expect(page.locator('table')).toBeVisible();
  13 |     
  14 |     // 验证表格是否有选择框列
  15 |     await expect(page.locator('th.ant-table-selection-column')).toBeVisible();
  16 |     
  17 |     // 选择第一行
  18 |     await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
  19 |     
  20 |     // 验证行是否被选中
  21 |     await expect(page.locator('tbody tr').first().locator('input[type="checkbox"]')).toBeChecked();
  22 |   });
  23 |
  24 |   test('选中行后应显示批量操作按钮', async ({ page }) => {
  25 |     // 验证表格是否加载完成
  26 |     await expect(page.locator('table')).toBeVisible();
  27 |     
  28 |     // 批量操作组件初始应该不可见
  29 |     await expect(page.locator('.batch-actions-bar')).not.toBeVisible();
  30 |     
  31 |     // 选择多行
  32 |     await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
  33 |     await page.locator('tbody tr').nth(1).locator('input[type="checkbox"]').click();
  34 |     
  35 |     // 验证批量操作组件是否显示
  36 |     await expect(page.locator('.batch-actions-bar')).toBeVisible();
  37 |     
  38 |     // 验证是否显示已选择数量
  39 |     await expect(page.locator('.batch-actions-bar')).toContainText('已选择 2 项');
  40 |     
  41 |     // 验证是否有批量操作按钮
  42 |     await expect(page.locator('button:has-text("批量操作")')).toBeVisible();
  43 |   });
  44 |
  45 |   test('应能执行批量删除操作', async ({ page }) => {
  46 |     // 验证表格是否加载完成
  47 |     await expect(page.locator('table')).toBeVisible();
  48 |     
  49 |     // 选择多行
  50 |     await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
  51 |     await page.locator('tbody tr').nth(1).locator('input[type="checkbox"]').click();
  52 |     
  53 |     // 验证批量操作组件是否显示
  54 |     await expect(page.locator('.batch-actions-bar')).toBeVisible();
  55 |     
  56 |     // 点击批量操作按钮
  57 |     await page.locator('button:has-text("批量操作")').click();
  58 |     
  59 |     // 等待下拉菜单显示
  60 |     await expect(page.locator('.ant-dropdown-menu')).toBeVisible();
  61 |     
  62 |     // 点击批量删除选项
  63 |     await page.locator('.ant-dropdown-menu-item:has-text("批量删除")').click();
  64 |     
  65 |     // 等待确认对话框显示
  66 |     await expect(page.locator('.ant-modal-confirm')).toBeVisible();
  67 |     
  68 |     // 确认删除
  69 |     await page.locator('.ant-modal-confirm-btns').getByRole('button', { name: '确定删除' }).click();
  70 |     
  71 |     // 验证成功提示消息
  72 |     await expect(page.locator('.ant-message-success')).toBeVisible();
  73 |     await expect(page.locator('.ant-message-success')).toContainText('删除成功');
  74 |   });
  75 |
  76 |   test('应能取消选择', async ({ page }) => {
  77 |     // 验证表格是否加载完成
  78 |     await expect(page.locator('table')).toBeVisible();
  79 |     
  80 |     // 选择多行
  81 |     await page.locator('tbody tr').first().locator('input[type="checkbox"]').click();
  82 |     await page.locator('tbody tr').nth(1).locator('input[type="checkbox"]').click();
  83 |     
  84 |     // 验证批量操作组件是否显示
  85 |     await expect(page.locator('.batch-actions-bar')).toBeVisible();
  86 |     
  87 |     // 点击取消选择按钮
  88 |     await page.locator('button:has-text("取消选择")').click();
  89 |     
  90 |     // 验证批量操作组件是否隐藏
  91 |     await expect(page.locator('.batch-actions-bar')).not.toBeVisible();
  92 |     
  93 |     // 验证复选框是否取消选中
  94 |     await expect(page.locator('tbody tr').first().locator('input[type="checkbox"]')).not.toBeChecked();
  95 |     await expect(page.locator('tbody tr').nth(1).locator('input[type="checkbox"]')).not.toBeChecked();
  96 |   });
  97 | }); 
```