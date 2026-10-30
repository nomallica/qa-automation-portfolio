import { test, expect } from "@playwright/test";

const BASE_URL = "https://qa-auto-ec-site.vercel.app/";

test.describe("商品検索（正常系）", () => {
  test("商品を検索できること", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder("商品を検索").fill("トップス");
    await page.getByTestId("search-button").click();

    const startTime = Date.now(); //検索処理時間計測スタート

    //await page.waitForLoadState("networkidle"); // 待機コード（2秒待つ）
    await page.getByText("検索結果").waitFor({ state: "visible" });

    await expect(page.getByText("検索結果")).toBeVisible();

    const searchTime = Date.now() - startTime;
    console.log(`検索処理時間: ${searchTime}ms`);
  });

  test("キーワード「Tシャツ」で検索すると検索結果が表示されること", async ({ page }) => {
    const keyword = "Tシャツ";

    // 1. トップページにアクセスする
    await page.goto(BASE_URL);

    // 2. 検索窓に "Tシャツ" と入力する
    const searchInput = page.getByPlaceholder("商品を検索");
    await expect(searchInput).toBeVisible();
    await searchInput.fill(keyword);

    // 3. 検索ボタンをクリックする
    await page.getByTestId("search-button").click();

    // 4. URLに "?q=" が含まれていることを確認する
    await expect(page).toHaveURL(/\?q=/);

    // 5. 「Tシャツ」の検索結果 というテキストが表示されていることを検証する
    await expect(page.getByText(`「${keyword}」の検索結果`)).toBeVisible();
  });
});
