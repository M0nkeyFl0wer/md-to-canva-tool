#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { MarkdownParser } from '../../shared/src/parser.js';
import { getTemplate, listTemplates } from '../../shared/src/templates.js';
import { ConversionOptions, CanvaDesign, ConversionResult } from '../../shared/src/types.js';
import { CanvaVisualFeedback, DesignUpdateCommand } from './visual-feedback.js';
import { CanvaExporter, ExportOptions } from './export-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CanvaMarkdownServer {
  private server: Server;
  private parser: MarkdownParser;
  private visualFeedback: CanvaVisualFeedback;
  private exporter: CanvaExporter;

  constructor() {
    this.server = new Server(
      {
        name: 'canva-md-converter',
        version: '0.1.0',
      }
    );

    this.parser = new MarkdownParser();
    this.visualFeedback = new CanvaVisualFeedback();
    this.exporter = new CanvaExporter(this.visualFeedback);
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'convert_markdown_to_canva',
            description: 'Convert a markdown file to a Canva presentation with collaboration features',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the markdown file to convert'
                },
                template: {
                  type: 'string',
                  description: 'Template to use for styling (professional-blue, modern-gradient, minimal-clean, research-report)',
                  default: 'professional-blue'
                },
                teamShare: {
                  type: 'boolean',
                  description: 'Share with team workspace',
                  default: true
                },
                permissions: {
                  type: 'string',
                  enum: ['edit', 'comment', 'view'],
                  description: 'Default permissions for team members',
                  default: 'edit'
                },
                folder: {
                  type: 'string',
                  description: 'Canva folder to save in'
                },
                notifyTeam: {
                  type: 'boolean',
                  description: 'Send notification to team members',
                  default: false
                }
              },
              required: ['filePath']
            }
          },
          {
            name: 'list_templates',
            description: 'List available presentation templates',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'preview_markdown_slides',
            description: 'Preview how markdown will be converted to slides without creating in Canva',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the markdown file to preview'
                },
                template: {
                  type: 'string',
                  description: 'Template to use for preview',
                  default: 'professional-blue'
                }
              },
              required: ['filePath']
            }
          },
          {
            name: 'validate_markdown',
            description: 'Validate markdown file for presentation conversion',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the markdown file to validate'
                }
              },
              required: ['filePath']
            }
          },
          {
            name: 'screenshot_canva_design',
            description: 'Take a screenshot of the current Canva design for visual feedback',
            inputSchema: {
              type: 'object',
              properties: {
                designUrl: {
                  type: 'string',
                  description: 'URL of the Canva design to screenshot'
                },
                slideNumber: {
                  type: 'number',
                  description: 'Specific slide number to screenshot (optional, screenshots all if not provided)'
                },
                width: {
                  type: 'number',
                  description: 'Screenshot width in pixels',
                  default: 1920
                },
                height: {
                  type: 'number',
                  description: 'Screenshot height in pixels',
                  default: 1080
                }
              },
              required: ['designUrl']
            }
          },
          {
            name: 'update_canva_design',
            description: 'Make visual updates to a Canva design (change colors, text, backgrounds, etc.)',
            inputSchema: {
              type: 'object',
              properties: {
                designUrl: {
                  type: 'string',
                  description: 'URL of the Canva design to update'
                },
                slideNumber: {
                  type: 'number',
                  description: 'Slide number to update (optional)'
                },
                action: {
                  type: 'string',
                  enum: ['background', 'text', 'color', 'font', 'image', 'layout'],
                  description: 'Type of update to make'
                },
                value: {
                  type: 'string',
                  description: 'New value to apply (color hex, text content, font name, etc.)'
                },
                target: {
                  type: 'string',
                  description: 'Specific element to target (CSS selector or description)'
                }
              },
              required: ['designUrl', 'action', 'value']
            }
          },
          {
            name: 'export_canva_design',
            description: 'Export finalized Canva design to local directory for VS Code/IDE integration',
            inputSchema: {
              type: 'object',
              properties: {
                designUrl: {
                  type: 'string',
                  description: 'URL of the Canva design to export'
                },
                outputDir: {
                  type: 'string',
                  description: 'Local directory path to save exported files'
                },
                format: {
                  type: 'string',
                  enum: ['pdf', 'png', 'jpg', 'pptx', 'mp4'],
                  description: 'Export format',
                  default: 'pdf'
                },
                quality: {
                  type: 'string',
                  enum: ['standard', 'high', 'print'],
                  description: 'Export quality',
                  default: 'high'
                },
                includeMetadata: {
                  type: 'boolean',
                  description: 'Include design metadata and source info',
                  default: true
                }
              },
              required: ['designUrl', 'outputDir']
            }
          },
          {
            name: 'login_to_canva',
            description: 'Login to Canva for visual feedback and design manipulation',
            inputSchema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  description: 'Canva account email'
                },
                password: {
                  type: 'string',
                  description: 'Canva account password'
                }
              },
              required: ['email', 'password']
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'convert_markdown_to_canva':
            return await this.convertMarkdownToCanva(args);

          case 'list_templates':
            return await this.listTemplates();

          case 'preview_markdown_slides':
            return await this.previewMarkdownSlides(args);

          case 'validate_markdown':
            return await this.validateMarkdown(args);

          case 'login_to_canva':
            return await this.loginToCanva(args);

          case 'screenshot_canva_design':
            return await this.screenshotCanvaDesign(args);

          case 'update_canva_design':
            return await this.updateCanvaDesign(args);

          case 'export_canva_design':
            return await this.exportCanvaDesign(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async convertMarkdownToCanva(args: any) {
    const { filePath, template = 'professional-blue', teamShare = true, permissions = 'edit', folder, notifyTeam = false } = args;

    // Read and parse markdown file
    const markdownContent = await this.readMarkdownFile(filePath);
    const parsed = this.parser.parse(markdownContent);

    // Validate markdown
    const validation = this.parser.validateMarkdown(markdownContent);
    if (!validation.isValid) {
      return {
        content: [
          {
            type: 'text',
            text: `Markdown validation failed:\\n${validation.errors.join('\\n')}`
          }
        ]
      };
    }

    // Get template configuration
    const templateConfig = getTemplate(template);

    // Prepare conversion options
    const options: ConversionOptions = {
      template,
      collaboration: {
        defaultPermissions: permissions,
        autoShare: teamShare,
        notifyTeam,
        projectFolder: folder
      }
    };

    // TODO: Integrate with actual Canva API
    // For now, return a mock result with preview information
    const mockResult: ConversionResult = {
      success: true,
      design: {
        id: 'mock-design-id',
        title: parsed.frontmatter.title || 'Untitled Presentation',
        url: 'https://canva.com/design/mock-design-id',
        editUrl: 'https://canva.com/design/mock-design-id/edit',
        shareUrl: 'https://canva.com/design/mock-design-id/view',
        createdAt: new Date(),
        modifiedAt: new Date()
      }
    };

    return {
      content: [
        {
          type: 'text',
          text: `✅ Successfully converted "${filePath}" to Canva presentation!

**Presentation Details:**
- Title: ${parsed.frontmatter.title || 'Untitled Presentation'}
- Slides: ${parsed.slides.length}
- Template: ${templateConfig.name}
- Team Access: ${teamShare ? 'Enabled' : 'Disabled'}
- Permissions: ${permissions}
${folder ? `- Folder: ${folder}` : ''}

**Slides Preview:**
${parsed.slides.map((slide, i) => `${i + 1}. ${slide.title} (${slide.type})`).join('\\n')}

**Next Steps:**
- Open in Canva: ${mockResult.design?.editUrl}
- Share with team: ${mockResult.design?.shareUrl}
- Team members can now collaborate with ${permissions} permissions

**Note:** This is currently a preview. Actual Canva integration is in development.`
        }
      ]
    };
  }

  private async listTemplates() {
    const templates = listTemplates();

    return {
      content: [
        {
          type: 'text',
          text: `Available Presentation Templates:

${templates.map(template =>
  `**${template.name}** (${template.id})
  ${template.description}`
).join('\\n\\n')}

Use template ID in the convert_markdown_to_canva command.`
        }
      ]
    };
  }

  private async previewMarkdownSlides(args: any) {
    const { filePath, template = 'professional-blue' } = args;

    const markdownContent = await this.readMarkdownFile(filePath);
    const parsed = this.parser.parse(markdownContent);
    const templateConfig = getTemplate(template);

    return {
      content: [
        {
          type: 'text',
          text: `Preview of "${filePath}" conversion:

**Template:** ${templateConfig.name}
**Total Slides:** ${parsed.slides.length}

${parsed.slides.map((slide, i) =>
  `**Slide ${i + 1}: ${slide.title}**
  Type: ${slide.type}
  Content: ${slide.content.length} items
  ${slide.content.slice(0, 3).map(item => `  • ${item}`).join('\\n')}${slide.content.length > 3 ? '\\n  ...' : ''}`
).join('\\n\\n')}

**Frontmatter:**
${Object.entries(parsed.frontmatter).map(([key, value]) => `${key}: ${value}`).join('\\n')}

Ready to convert to Canva presentation!`
        }
      ]
    };
  }

  private async validateMarkdown(args: any) {
    const { filePath } = args;

    const markdownContent = await this.readMarkdownFile(filePath);
    const validation = this.parser.validateMarkdown(markdownContent);

    if (validation.isValid) {
      const parsed = this.parser.parse(markdownContent);
      return {
        content: [
          {
            type: 'text',
            text: `✅ Markdown file is valid for conversion!

**Summary:**
- Total slides: ${parsed.slides.length}
- Slide types: ${[...new Set(parsed.slides.map(s => s.type))].join(', ')}
- Images found: ${this.parser.extractImages(markdownContent).length}
- Links found: ${this.parser.extractLinks(markdownContent).length}

Ready to convert to Canva presentation.`
          }
        ]
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Markdown validation failed:

${validation.errors.map(error => `• ${error}`).join('\\n')}

Please fix these issues before converting to Canva.`
          }
        ]
      };
    }
  }

  private async readMarkdownFile(filePath: string): Promise<string> {
    try {
      const absolutePath = resolve(filePath);
      return await fs.readFile(absolutePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file "${filePath}": ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async loginToCanva(args: any) {
    const { email, password } = args;

    try {
      await this.visualFeedback.initialize();
      await this.visualFeedback.loginToCanva(email, password);

      return {
        content: [
          {
            type: 'text',
            text: `✅ Successfully logged into Canva with ${email}\\n\\nYou can now:\\n- Take screenshots of designs\\n- Make visual updates to presentations\\n- Export designs to local directories`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to login to Canva: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }

  private async screenshotCanvaDesign(args: any) {
    const { designUrl, slideNumber, width = 1920, height = 1080 } = args;

    try {
      await this.visualFeedback.openDesign(designUrl);

      let screenshotPath: string;
      if (slideNumber) {
        screenshotPath = await this.visualFeedback.screenshotSlide(slideNumber, { width, height });
      } else {
        screenshotPath = await this.visualFeedback.screenshotCurrentDesign({ width, height });
      }

      const designInfo = await this.visualFeedback.getDesignInfo();

      return {
        content: [
          {
            type: 'text',
            text: `📸 Screenshot captured: ${screenshotPath}\\n\\n**Design**: ${designInfo.title}\\n**Slides**: ${designInfo.slideCount}\\n**Screenshot**: ${slideNumber ? `Slide ${slideNumber}` : 'Current view'}`
          },
          {
            type: 'image',
            data: await fs.readFile(screenshotPath, 'base64'),
            mimeType: 'image/png'
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to screenshot design: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }

  private async updateCanvaDesign(args: any) {
    const { designUrl, slideNumber, action, value, target } = args;

    try {
      await this.visualFeedback.openDesign(designUrl);

      const updateCommand: DesignUpdateCommand = {
        slideNumber,
        action,
        value,
        target
      };

      const success = await this.visualFeedback.executeDesignUpdate(updateCommand);

      if (success) {
        // Take a screenshot to show the result
        const screenshotPath = await this.visualFeedback.screenshotCurrentDesign();

        return {
          content: [
            {
              type: 'text',
              text: `✅ Successfully updated design\\n\\n**Action**: ${action}\\n**Value**: ${value}\\n**Target**: ${target || 'Default'}\\n**Slide**: ${slideNumber || 'Current'}`
            },
            {
              type: 'image',
              data: await fs.readFile(screenshotPath, 'base64'),
              mimeType: 'image/png'
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `⚠️ Update may not have completed successfully. Action: ${action}, Value: ${value}`
            }
          ]
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to update design: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }

  private async exportCanvaDesign(args: any) {
    const { designUrl, outputDir, format = 'pdf', quality = 'high', includeMetadata = true } = args;

    try {
      const exportOptions: ExportOptions = {
        format,
        quality,
        includeMetadata
      };

      const result = await this.exporter.exportDesign(designUrl, outputDir, exportOptions);

      if (result.success) {
        // Try to open in VS Code if available
        const workspaceFile = result.files.find(f => f.endsWith('.code-workspace'));
        let vsCodeOpened = false;

        if (workspaceFile) {
          vsCodeOpened = await this.exporter.openInVSCode(workspaceFile);
        }

        return {
          content: [
            {
              type: 'text',
              text: `🎉 Successfully exported to: ${result.outputPath}\\n\\n**Files created:**\\n${result.files.map(f => `- ${f}`).join('\\n')}\\n\\n**Format**: ${format.toUpperCase()}\\n**Quality**: ${quality}\\n**VS Code**: ${vsCodeOpened ? '✅ Opened workspace' : '⚠️ Not opened (install VS Code)'}\\n\\n**Usage**: You can now incorporate these files into your VS Code projects, documentation, or presentations.`
            }
          ]
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `❌ Export failed. Check that:\\n- Design URL is accessible\\n- Output directory is writable\\n- You're logged into Canva`
            }
          ]
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ Failed to export design: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Canva Markdown Converter MCP server running on stdio');
  }
}

const server = new CanvaMarkdownServer();
server.run().catch(console.error);