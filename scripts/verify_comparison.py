from playwright.sync_api import sync_playwright

def verify_comparison_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to comparison page
            page.goto("http://localhost:5173/visualizations/compare")
            page.wait_for_selector("h1")

            # Take initial screenshot
            page.screenshot(path="/home/jules/verification/compare_empty.png")
            print("Initial screenshot saved.")

            # Fill inputs
            page.fill("input#med1", "Aspirin")
            page.fill("input#med2", "Ibuprofen")

            # Click compare
            # Note: Since there's no real data, this might show the "not found" state or just reload.
            # But we want to verify the UI interactions work.
            page.click("button:has-text('Compare Medications')")

            # Wait a bit for potential navigation/load
            page.wait_for_timeout(2000)

            # Take result screenshot
            page.screenshot(path="/home/jules/verification/compare_result.png")
            print("Result screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_comparison_page()
