import { promises as fs } from 'fs';
import { resolve, join, extname } from 'path';
import { CanvaVisualFeedback } from './visual-feedback.js';

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg' | 'pptx' | 'mp4';
  quality: 'standard' | 'high' | 'print';
  includeMetadata: boolean;
}

export interface ExportResult {
  success: boolean;
  outputPath: string;
  files: string[];
  metadata?: {
    title: string;
    slideCount: number;
    exportDate: string;
    format: string;
    quality: string;
  };
}

export class CanvaExporter {
  private visualFeedback: CanvaVisualFeedback;

  constructor(visualFeedback: CanvaVisualFeedback) {
    this.visualFeedback = visualFeedback;
  }

  async exportDesign(
    designUrl: string,
    outputDir: string,
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });

      // Get design information
      await this.visualFeedback.openDesign(designUrl);
      const designInfo = await this.visualFeedback.getDesignInfo();

      const files: string[] = [];
      let mainFilePath = '';

      switch (options.format) {
        case 'png':
        case 'jpg':
          // Export each slide as individual images
          const imageFiles = await this.exportAsImages(outputDir, options.format, designInfo.title);
          files.push(...imageFiles);
          mainFilePath = imageFiles[0] || '';
          break;

        case 'pdf':
          // Export as single PDF
          mainFilePath = await this.exportAsPDF(outputDir, designInfo.title, options.quality);
          files.push(mainFilePath);
          break;

        case 'pptx':
          // Export as PowerPoint
          mainFilePath = await this.exportAsPowerPoint(outputDir, designInfo.title);
          files.push(mainFilePath);
          break;

        case 'mp4':
          // Export as video (for animated presentations)
          mainFilePath = await this.exportAsVideo(outputDir, designInfo.title);
          files.push(mainFilePath);
          break;

        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Create metadata file if requested
      if (options.includeMetadata) {
        const metadataFile = await this.createMetadataFile(outputDir, designInfo, options);
        files.push(metadataFile);
      }

      // Create VS Code workspace integration file
      const workspaceFile = await this.createVSCodeIntegration(outputDir, designInfo, files);
      files.push(workspaceFile);

      return {
        success: true,
        outputPath: outputDir,
        files,
        metadata: {
          title: designInfo.title,
          slideCount: designInfo.slideCount,
          exportDate: new Date().toISOString(),
          format: options.format,
          quality: options.quality
        }
      };

    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        outputPath: outputDir,
        files: [],
        metadata: undefined
      };
    }
  }

  private async exportAsImages(outputDir: string, format: 'png' | 'jpg', title: string): Promise<string[]> {
    const screenshots = await this.visualFeedback.getAllSlideScreenshots();
    const imageFiles: string[] = [];

    for (let i = 0; i < screenshots.length; i++) {
      const sanitizedTitle = this.sanitizeFilename(title);
      const filename = `${sanitizedTitle}_slide_${i + 1}.${format}`;
      const outputPath = join(outputDir, filename);

      // Copy screenshot to output directory
      await fs.copyFile(screenshots[i], outputPath);
      imageFiles.push(outputPath);
    }

    return imageFiles;
  }

  private async exportAsPDF(outputDir: string, title: string, quality: string): Promise<string> {
    // This would integrate with Canva's PDF export functionality
    // For now, we'll create a PDF from screenshots using a PDF library
    const sanitizedTitle = this.sanitizeFilename(title);
    const filename = `${sanitizedTitle}.pdf`;
    const outputPath = join(outputDir, filename);

    // Placeholder implementation - would need actual PDF creation
    // You could use libraries like 'pdf-lib' or 'puppeteer' to create PDFs from images
    await this.createPDFFromScreenshots(outputPath, await this.visualFeedback.getAllSlideScreenshots());

    return outputPath;
  }

  private async exportAsPowerPoint(outputDir: string, title: string): Promise<string> {
    // This would integrate with Canva's PowerPoint export
    const sanitizedTitle = this.sanitizeFilename(title);
    const filename = `${sanitizedTitle}.pptx`;
    const outputPath = join(outputDir, filename);

    // Placeholder - would need actual PowerPoint export implementation
    // Could use libraries like 'officegen' to create PPTX files
    await fs.writeFile(outputPath, 'PowerPoint export placeholder');

    return outputPath;
  }

  private async exportAsVideo(outputDir: string, title: string): Promise<string> {
    // For animated presentations or video exports
    const sanitizedTitle = this.sanitizeFilename(title);
    const filename = `${sanitizedTitle}.mp4`;
    const outputPath = join(outputDir, filename);

    // Placeholder - would need video export implementation
    await fs.writeFile(outputPath, 'Video export placeholder');

    return outputPath;
  }

  private async createPDFFromScreenshots(outputPath: string, screenshots: string[]): Promise<void> {
    // Placeholder for PDF creation
    // In a real implementation, you'd use a library like:
    // - pdf-lib: to create PDFs programmatically
    // - puppeteer: to generate PDFs from HTML
    // - jsPDF: for client-side PDF generation

    const pdfContent = `PDF created from ${screenshots.length} slides\\nExported from Canva via Claude Code`;
    await fs.writeFile(outputPath, pdfContent);
  }

  private async createMetadataFile(
    outputDir: string,
    designInfo: { title: string; slideCount: number; url: string },
    options: ExportOptions
  ): Promise<string> {
    const metadata = {
      title: designInfo.title,
      slideCount: designInfo.slideCount,
      sourceUrl: designInfo.url,
      exportDate: new Date().toISOString(),
      format: options.format,
      quality: options.quality,
      exportedBy: 'Claude Code Canva MCP Server',
      version: '1.0.0'
    };

    const metadataPath = join(outputDir, 'canva-export-metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    return metadataPath;
  }

  private async createVSCodeIntegration(
    outputDir: string,
    designInfo: { title: string; slideCount: number; url: string },
    exportedFiles: string[]
  ): Promise<string> {
    // Create a VS Code workspace file for easy integration
    const workspaceConfig = {
      folders: [
        {
          name: `Canva Export: ${designInfo.title}`,
          path: outputDir
        }
      ],
      settings: {
        "files.associations": {
          "canva-export-metadata.json": "json"
        }
      },
      extensions: {
        recommendations: [
          "ms-vscode.vscode-json",
          "tomoki1207.pdf"
        ]
      }
    };

    // Create README for the exported project
    const readmeContent = `# ${designInfo.title}

Exported from Canva via Claude Code MCP Server

## Files
${exportedFiles.map(file => `- \\`${file}\\``).join('\\n')}

## Original Design
- **Canva URL**: ${designInfo.url}
- **Slides**: ${designInfo.slideCount}
- **Exported**: ${new Date().toLocaleDateString()}

## VS Code Integration
Open this folder in VS Code to work with the exported files:
\\`\\`\\`bash
code "${outputDir}"
\\`\\`\\`

## Usage in Projects
You can now incorporate these files into your projects:
- Use images in documentation
- Include PDF in reports
- Reference in markdown files
- Add to project assets
`;

    const readmePath = join(outputDir, 'README.md');
    await fs.writeFile(readmePath, readmeContent);

    const workspacePath = join(outputDir, `${this.sanitizeFilename(designInfo.title)}.code-workspace`);
    await fs.writeFile(workspacePath, JSON.stringify(workspaceConfig, null, 2));

    return workspacePath;
  }

  private sanitizeFilename(filename: string): string {
    // Remove or replace invalid filename characters
    return filename
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\\s+/g, '_')
      .toLowerCase();
  }

  // Utility method to open exported files in VS Code
  async openInVSCode(workspacePath: string): Promise<boolean> {
    try {
      const { spawn } = await import('child_process');

      return new Promise((resolve) => {
        const process = spawn('code', [workspacePath], {
          stdio: 'inherit',
          shell: true
        });

        process.on('close', (code) => {
          resolve(code === 0);
        });

        process.on('error', (error) => {
          console.error('Failed to open VS Code:', error);
          resolve(false);
        });
      });
    } catch (error) {
      console.error('VS Code not available:', error);
      return false;
    }
  }
}