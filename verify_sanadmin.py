from playwright.sync_api import sync_playwright
import time

def verify(page):
    print("Navigating to Dashboard...")
    page.goto("http://localhost:5174/dashboard")
    page.wait_for_load_state("networkidle")
    time.sleep(2)
    page.screenshot(path="verification_dashboard.png")
    print("Dashboard screenshot taken.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
