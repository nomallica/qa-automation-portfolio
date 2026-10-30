# QA自動化ポートフォリオ

## 説明動画

[説明動画を見る](https://youtu.be/6Ri9pPEq2zo)

## テストコード

```ts
import { test, expect, type Dialog } from "@playwright/test";

/**
 * 正常系E2E: ログイン → 商品検索 → カート追加 → カート確認 → 購入手続き → 注文確定
 * 対象: https://qa-auto-ec-site.vercel.app/
 */

const BASE_URL = "https://qa-auto-ec-site.vercel.app";

// テスト用アカウント（ログイン画面に記載のもの）
const TEST_USER = {
  email: "user@example.com",
  password: "password123",
};

// テスト対象となる任意の商品
const PRODUCT = {
  id: "p-005",
  name: "秋色カーディガン",
  searchKeyword: "トップス",
};

test.describe("ECサイト 購入フロー（正常系）", () => {
  test("ログインして任意の商品を購入できる", async ({ page }) => {
    await test.step("1. サイトにアクセスする", async () => {
      await page.goto(`${BASE_URL}/`);
      await expect(page).toHaveTitle("オリジナルECサイト");
    });

    await test.step("2. ログインする", async () => {
      await page.goto(`${BASE_URL}/login`);
      await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();

      await page.getByPlaceholder("メールアドレス").fill(TEST_USER.email);
      await page.getByPlaceholder("パスワード").fill(TEST_USER.password);
      await page.getByRole("button", { name: "ログイン" }).click();

      // ログイン成功でログイン画面から遷移していることを確認
      await expect(page).not.toHaveURL(/\/login/);
    });

    await test.step(`3. 任意の商品をカートに入れる`, async () => {
      await page.getByPlaceholder("商品を検索").fill(PRODUCT.searchKeyword);
      await page.getByTestId("search-button").click();

      // waitFor ではなく expect で「表示されること」を検証する
      await expect(page.getByText(`「${PRODUCT.searchKeyword}」の検索結果`)).toBeVisible();

      // ダイアログ（alert）はクリック「前」にハンドラを登録しておく
      let dialogType = "";
      let dialogMessage = "";
      page.once("dialog", async (dialog: Dialog) => {
        dialogType = dialog.type();
        dialogMessage = dialog.message();
        await dialog.accept(); // 「OK」を押す
      });

      await page.getByTestId(`add-to-cart-${PRODUCT.id}`).click();

      // ダイアログが表示され、文言が正しいことを検証
      await expect.poll(() => dialogMessage).toBe("カートに追加しました");
      expect(dialogType).toBe("alert");
    });

    await test.step("4. カート画面で商品が入っていることを確認する", async () => {
      await page.getByTestId("nav-cart").click();
      await expect(page).toHaveURL(/\/cart/);
      await expect(page.getByAltText(PRODUCT.name)).toBeVisible();
    });

    await test.step("5. 「レジへ進む」をクリックする", async () => {
      const checkoutButton = page.getByTestId("proceed-to-checkout");
      await expect(checkoutButton).toHaveText(/レジへ進む/);
      await checkoutButton.click();
      await expect(page).toHaveURL(/\/checkout/);
    });

    await test.step("6. 「注文を確定する」をクリックする", async () => {
      await page.getByRole("button", { name: "注文を確定する" }).click();
    });

    await test.step("7. 「決済が完了しました」が表示されることを検証する", async () => {
      await expect(page.getByText("決済が完了しました")).toBeVisible();
    });
  });
});
```
