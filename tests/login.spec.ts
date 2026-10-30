import { test, expect } from "@playwright/test";

test.describe("ログイン機能のテスト", () => {
  // このグループ内のすべての test() が実行される直前に、以下が実行される！
  test.beforeEach(async ({ page }) => {
    // ログインページにアクセスする
    await page.goto("https://qa-auto-ec-site.vercel.app/login");
  });

  test("正しい情報でログインできること", async ({ page }) => {
    // 正常系
    // メールアドレスを入力
    await page.getByPlaceholder("メールアドレス").fill("user@example.com");
    // パスワードを入力
    await page.getByPlaceholder("パスワード").fill("password123");
    // ログインボタンをクリック
    await page.getByRole("button", { name: "ログイン" }).click();
    // ログイン後のURLが正しいか検証
    await expect(page).toHaveURL(/\/mypage/); //文字列で書くと完全一致になるため、パラメータなどが付いた際の失敗を防ぐ目的
  });

  test("間違ったパスワードでエラーになること", async ({ page }) => {
    // 異常系
    // 正しいメールアドレスと間違ったパスワードを入力
    await page.getByPlaceholder("メールアドレス").fill("user@example.com");
    await page.getByPlaceholder("パスワード").fill("wrong_password");
    // ログインボタンをクリック
    await page.getByRole("button", { name: "ログイン" }).click();

    // ディレクトリを指定してスクリーンショットを撮る
    await page.screenshot({ path: "evidence/error-message.png", fullPage: true });
    // エラーメッセージが表示されることを検証
    const errorMsg = page.getByTestId("error-message");
    await expect(errorMsg).toContainText("メールアドレスまたはパスワードが違います");
  });
});
