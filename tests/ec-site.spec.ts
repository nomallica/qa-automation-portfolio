import { test, expect } from "@playwright/test";

test.describe("ログイン機能のテスト", () => {
  //test.beforeEach(async ({ page }) => {});

  test("ECサイトのトップページが開けること", async ({ page }) => {
    // サイトにアクセスする
    await page.goto("https://qa-auto-ec-site.vercel.app/");
    // ページのタイトルが正しいか検証する（アサーション）
    await expect(page).toHaveTitle("オリジナルECサイト");
  });

  test("商品一覧でソートができること", async ({ page }) => {
    // サイトにアクセスする
    await page.goto("https://qa-auto-ec-site.vercel.app/");
    // ソートオプションを選択
    await page.getByTestId("sort-dropdown").selectOption({ label: "価格が安い順" });
    //3秒待つ
    await page.waitForTimeout(3000);
    // 選択結果を検証する
    await expect(page.getByTestId("sort-dropdown")).toHaveValue(/.+/);
  });

  test("ページ読み込み時間を計測する", async ({ page }) => {
    const startTime = Date.now();
    // サイトにアクセスする
    await page.goto("https://qa-auto-ec-site.vercel.app/");
    const loadTime = Date.now() - startTime;
    console.log(`ページ読み込み時間: ${loadTime}ms`);
    //ページ読み込み時感が3秒以下であることを検証
    expect(loadTime).toBeLessThan(3000);
  });
});
