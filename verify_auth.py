from playwright.sync_api import Page, expect, sync_playwright
import os

def test_auth_flow(page: Page):
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:3000")

    # 2. Act: Click "Architect My First Letter"
    # Wait for the button to be visible first
    get_started_btn = page.get_by_role("button", name="Architect My First Letter")
    get_started_btn.wait_for()
    get_started_btn.click()

    # 3. Assert: Verify Auth component is visible
    # We check for the text "Sign in to access your applications" or "Sign In" button
    expect(page.get_by_text("Sign in to access your applications")).to_be_visible()

    # 4. Screenshot
    if not os.path.exists("/home/jules/verification"):
        os.makedirs("/home/jules/verification")
    page.screenshot(path="/home/jules/verification/auth_screen.png")
    print("Screenshot saved to /home/jules/verification/auth_screen.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_auth_flow(page)
        except Exception as e:
            print(f"Test failed: {e}")
        finally:
            browser.close()
