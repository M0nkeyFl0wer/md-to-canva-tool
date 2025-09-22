// Shared types for Canva MD Converter

export interface MarkdownContent {
  frontmatter: Record<string, any>;
  content: string;
  slides: Slide[];
}

export interface Slide {
  title: string;
  content: string[];
  type: 'title' | 'content' | 'image' | 'quote';
  metadata?: Record<string, any>;
}

export interface PresentationTemplate {
  id: string;
  name: string;
  description: string;
  canvaTemplateId?: string;
  slides: SlideTemplate[];
  branding: BrandingConfig;
}

export interface SlideTemplate {
  type: 'title' | 'content' | 'image' | 'quote';
  layout: string;
  textStyles: TextStyle[];
  backgroundStyle?: BackgroundStyle;
}

export interface TextStyle {
  element: 'title' | 'subtitle' | 'body' | 'bullet';
  fontSize: number;
  fontFamily: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
}

export interface BackgroundStyle {
  type: 'color' | 'gradient' | 'image';
  value: string;
}

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
}

export interface CollaborationConfig {
  teamWorkspace?: string;
  defaultPermissions: 'edit' | 'comment' | 'view';
  autoShare: boolean;
  notifyTeam: boolean;
  projectFolder?: string;
}

export interface ConversionOptions {
  template: string;
  collaboration: CollaborationConfig;
  customStyles?: Partial<TextStyle>[];
  outputFormat?: 'canva' | 'pdf' | 'pptx';
}

export interface CanvaDesign {
  id: string;
  title: string;
  url: string;
  editUrl: string;
  shareUrl: string;
  thumbnailUrl?: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ConversionResult {
  success: boolean;
  design?: CanvaDesign;
  errors?: string[];
  warnings?: string[];
}

// MCP Tool Types
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

export interface ConvertMarkdownTool extends MCPTool {
  name: 'convert_markdown_to_canva';
  description: 'Convert a markdown file to a Canva presentation';
  inputSchema: {
    type: 'object';
    properties: {
      filePath: { type: 'string'; description: 'Path to markdown file' };
      template?: { type: 'string'; description: 'Template to use' };
      teamShare?: { type: 'boolean'; description: 'Share with team' };
      permissions?: { type: 'string'; enum: ['edit', 'comment', 'view'] };
      folder?: { type: 'string'; description: 'Canva folder name' };
    };
    required: ['filePath'];
  };
}