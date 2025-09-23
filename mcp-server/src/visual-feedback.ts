import { chromium, Browser, Page } from 'playwright';
import { promises as fs } from 'fs';
import { resolve } from 'path';

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  fullPage?: boolean;
  quality?: number;
}

export interface DesignUpdateCommand {
  slideNumber?: number;
  action: 'background' | 'text' | 'image' | 'layout' | 'color' | 'font';
  target?: string; // CSS selector or element description
  value: string;   // New value to apply
  position?: { x: number; y: number };
}

export class CanvaVisualFeedback {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private currentDesignUrl: string | null = null;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false, // Show browser for debugging
      args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
    });

    this.page = await this.browser.newPage();

    // Set viewport for consistent screenshots
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async loginToCanva(email: string, password: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');

    await this.page.goto('https://www.canva.com/login');

    // Wait for login form and fill credentials
    await this.page.waitForSelector('input[type="email"]');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');

    // Wait for successful login
    await this.page.waitForURL('**/home', { timeout: 30000 });
  }

  async openDesign(designUrl: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');

    this.currentDesignUrl = designUrl;
    await this.page.goto(designUrl);

    // Wait for Canva editor to fully load
    await this.page.waitForSelector('[data-testid="design-canvas"]', { timeout: 30000 });

    // Wait for additional loading indicators to disappear
    await this.page.waitForFunction(() => {
      const loadingElements = document.querySelectorAll('[data-testid="loading"]');
      return loadingElements.length === 0;
    }, { timeout: 15000 });
  }

  async screenshotCurrentDesign(options: ScreenshotOptions = {}): Promise<string> {
    if (!this.page) throw new Error('Browser not initialized');

    const timestamp = Date.now();
    const filename = `canva-screenshot-${timestamp}.png`;
    const filepath = resolve(process.cwd(), 'screenshots', filename);

    // Ensure screenshots directory exists
    await fs.mkdir(resolve(process.cwd(), 'screenshots'), { recursive: true });

    // Focus on the design canvas
    const canvas = await this.page.locator('[data-testid="design-canvas"]');

    await canvas.screenshot({
      path: filepath,
      quality: options.quality || 90,
      ...options
    });

    return filepath;
  }

  async screenshotSlide(slideNumber: number, options: ScreenshotOptions = {}): Promise<string> {
    if (!this.page) throw new Error('Browser not initialized');

    // Navigate to specific slide in thumbnail view
    const slideSelector = `[data-testid="page-thumbnail-${slideNumber}"]`;
    await this.page.click(slideSelector);

    // Wait for slide to be selected and visible
    await this.page.waitForTimeout(1000);

    return await this.screenshotCurrentDesign(options);
  }

  async executeDesignUpdate(command: DesignUpdateCommand): Promise<boolean> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      // Navigate to specific slide if specified
      if (command.slideNumber) {
        const slideSelector = `[data-testid="page-thumbnail-${command.slideNumber}"]`;
        await this.page.click(slideSelector);
        await this.page.waitForTimeout(1000);
      }

      switch (command.action) {
        case 'background':
          return await this.updateBackground(command.value);

        case 'text':
          return await this.updateText(command.target || '', command.value);

        case 'color':
          return await this.updateColor(command.target || '', command.value);

        case 'font':
          return await this.updateFont(command.target || '', command.value);

        case 'image':
          return await this.addImage(command.value, command.position);

        case 'layout':
          return await this.changeLayout(command.value);

        default:
          console.warn(`Unsupported action: ${command.action}`);
          return false;
      }
    } catch (error) {
      console.error(`Failed to execute design update:`, error);
      return false;
    }
  }

  private async updateBackground(color: string): Promise<boolean> {
    try {
      // Click on background to select it
      await this.page.click('[data-testid="design-canvas"] > div:first-child');

      // Look for background color options in the toolbar
      const backgroundButton = await this.page.locator('button[data-testid="background-color"]');
      if (await backgroundButton.isVisible()) {
        await backgroundButton.click();

        // Try to find color input or color picker
        const colorInput = await this.page.locator('input[type="color"]');
        if (await colorInput.isVisible()) {
          await colorInput.fill(color);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to update background:', error);
      return false;
    }
  }

  private async updateText(selector: string, newText: string): Promise<boolean> {
    try {
      // If selector provided, use it; otherwise find text elements
      const textElement = selector
        ? await this.page.locator(selector)
        : await this.page.locator('[data-testid="text-element"]').first();

      // Double-click to edit text
      await textElement.dblclick();

      // Clear existing text and type new text
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.type(newText);

      // Click outside to finish editing
      await this.page.click('[data-testid="design-canvas"]');

      return true;
    } catch (error) {
      console.error('Failed to update text:', error);
      return false;
    }
  }

  private async updateColor(selector: string, color: string): Promise<boolean> {
    try {
      // Select the target element
      await this.page.click(selector);

      // Look for color options in toolbar
      const colorButton = await this.page.locator('button[data-testid="text-color"]');
      if (await colorButton.isVisible()) {
        await colorButton.click();

        const colorInput = await this.page.locator('input[type="color"]');
        if (await colorInput.isVisible()) {
          await colorInput.fill(color);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to update color:', error);
      return false;
    }
  }

  private async updateFont(selector: string, fontFamily: string): Promise<boolean> {
    try {
      // Select text element
      await this.page.click(selector);

      // Look for font options
      const fontButton = await this.page.locator('button[data-testid="font-family"]');
      if (await fontButton.isVisible()) {
        await fontButton.click();

        // Search for specific font
        const fontSearch = await this.page.locator('input[placeholder*="Search fonts"]');
        if (await fontSearch.isVisible()) {
          await fontSearch.fill(fontFamily);
          await this.page.keyboard.press('Enter');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to update font:', error);
      return false;
    }
  }

  private async addImage(imageUrl: string, position?: { x: number; y: number }): Promise<boolean> {
    try {
      // Click the uploads/media button
      const uploadsButton = await this.page.locator('button[data-testid="uploads"]');
      if (await uploadsButton.isVisible()) {
        await uploadsButton.click();

        // Handle image upload (would need actual implementation based on Canva's UI)
        // This is a simplified version
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to add image:', error);
      return false;
    }
  }

  private async changeLayout(layoutName: string): Promise<boolean> {
    try {
      // Click layouts in sidebar
      const layoutsButton = await this.page.locator('button[data-testid="layouts"]');
      if (await layoutsButton.isVisible()) {
        await layoutsButton.click();

        // Search for specific layout
        const layoutElement = await this.page.locator(`[data-testid="layout-${layoutName}"]`);
        if (await layoutElement.isVisible()) {
          await layoutElement.click();
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Failed to change layout:', error);
      return false;
    }
  }

  async getAllSlideScreenshots(): Promise<string[]> {
    if (!this.page) throw new Error('Browser not initialized');

    const screenshots: string[] = [];

    // Get all slide thumbnails
    const slides = await this.page.locator('[data-testid^="page-thumbnail-"]').all();

    for (let i = 0; i < slides.length; i++) {
      const screenshot = await this.screenshotSlide(i + 1);
      screenshots.push(screenshot);
    }

    return screenshots;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  // Utility method to get current design metadata
  async getDesignInfo(): Promise<{ title: string; slideCount: number; url: string }> {
    if (!this.page) throw new Error('Browser not initialized');

    const title = await this.page.title();
    const slides = await this.page.locator('[data-testid^="page-thumbnail-"]').count();

    return {
      title,
      slideCount: slides,
      url: this.currentDesignUrl || ''
    };
  }
}