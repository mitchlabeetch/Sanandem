from playwright.sync_api import sync_playwright

def verify_visualizations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Trends
            print("Verifying Trends...")
            page.goto("http://localhost:5173/visualizations/trends")
            page.wait_for_selector("canvas") # ECharts canvas
            page.screenshot(path="/home/jules/verification/trends_viz.png")
            print("✅ Trends screenshot saved")

            # Heatmap
            print("Verifying Heatmap...")
            page.goto("http://localhost:5173/visualizations/heatmap")
            page.wait_for_selector("canvas")
            page.screenshot(path="/home/jules/verification/heatmap_viz.png")
            print("✅ Heatmap screenshot saved")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_visualizations()
