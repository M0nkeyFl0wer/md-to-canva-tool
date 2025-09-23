import { PresentationTemplate, CanvasDimensions } from './types.js';

// Standard Canva dimensions
export const CANVA_DIMENSIONS = {
  // Presentations
  PRESENTATION_16_9: {
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    format: 'landscape',
    description: 'Standard presentation slides'
  } as CanvasDimensions,

  PRESENTATION_4_3: {
    width: 1024,
    height: 768,
    aspectRatio: '4:3',
    format: 'landscape',
    description: 'Classic presentation format'
  } as CanvasDimensions,

  // Documents
  DOCUMENT_A4: {
    width: 595,
    height: 842,
    aspectRatio: '1:1.41',
    format: 'portrait',
    description: 'A4 document (8.5" x 11.7")'
  } as CanvasDimensions,

  DOCUMENT_LETTER: {
    width: 612,
    height: 792,
    aspectRatio: '1:1.29',
    format: 'portrait',
    description: 'US Letter (8.5" x 11")'
  } as CanvasDimensions,

  DOCUMENT_TABLOID: {
    width: 792,
    height: 1224,
    aspectRatio: '1:1.55',
    format: 'portrait',
    description: 'Tabloid (11" x 17")'
  } as CanvasDimensions,

  // Social Media
  INSTAGRAM_POST: {
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    format: 'square',
    description: 'Instagram feed post'
  } as CanvasDimensions,

  INSTAGRAM_STORY: {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    format: 'portrait',
    description: 'Instagram/Facebook story'
  } as CanvasDimensions,

  TWITTER_POST: {
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    format: 'landscape',
    description: 'Twitter/X post image'
  } as CanvasDimensions,

  LINKEDIN_POST: {
    width: 1200,
    height: 627,
    aspectRatio: '1.91:1',
    format: 'landscape',
    description: 'LinkedIn post image'
  } as CanvasDimensions,

  FACEBOOK_POST: {
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    format: 'landscape',
    description: 'Facebook post image'
  } as CanvasDimensions,

  // Infographics
  INFOGRAPHIC_PORTRAIT: {
    width: 800,
    height: 2000,
    aspectRatio: '2:5',
    format: 'portrait',
    description: 'Tall infographic format'
  } as CanvasDimensions,

  INFOGRAPHIC_SQUARE: {
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    format: 'square',
    description: 'Square infographic'
  } as CanvasDimensions,

  // Business Cards & Print
  BUSINESS_CARD: {
    width: 252,
    height: 144,
    aspectRatio: '1.75:1',
    format: 'landscape',
    description: 'Standard business card'
  } as CanvasDimensions,

  POSTER_A3: {
    width: 842,
    height: 1191,
    aspectRatio: '1:1.41',
    format: 'portrait',
    description: 'A3 poster (11.7" x 16.5")'
  } as CanvasDimensions
};

// Document templates
export const DOCUMENT_TEMPLATES = {
  RESEARCH_PAPER: {
    id: 'research-paper-a4',
    name: 'Research Paper',
    description: 'Academic research document with professional typography',
    contentType: 'document',
    dimensions: CANVA_DIMENSIONS.DOCUMENT_A4,
    branding: {
      primaryColor: '#1e293b',
      secondaryColor: '#64748b',
      accentColor: '#3b82f6',
      fontFamily: 'Times New Roman'
    },
    slides: [{
      type: 'content',
      layout: 'single-column',
      textStyles: [{
        element: 'title',
        fontSize: 24,
        fontFamily: 'Times New Roman',
        color: '#1e293b',
        alignment: 'center',
        bold: true
      }, {
        element: 'body',
        fontSize: 12,
        fontFamily: 'Times New Roman',
        color: '#374151',
        alignment: 'left'
      }],
      backgroundStyle: {
        type: 'color',
        value: '#ffffff'
      }
    }]
  } as PresentationTemplate,

  BUSINESS_REPORT: {
    id: 'business-report-letter',
    name: 'Business Report',
    description: 'Professional business document with corporate styling',
    contentType: 'document',
    dimensions: CANVA_DIMENSIONS.DOCUMENT_LETTER,
    branding: {
      primaryColor: '#1f2937',
      secondaryColor: '#6b7280',
      accentColor: '#059669',
      fontFamily: 'Arial'
    },
    slides: [{
      type: 'content',
      layout: 'business-format',
      textStyles: [{
        element: 'title',
        fontSize: 18,
        fontFamily: 'Arial',
        color: '#1f2937',
        alignment: 'left',
        bold: true
      }, {
        element: 'subtitle',
        fontSize: 14,
        fontFamily: 'Arial',
        color: '#6b7280',
        alignment: 'left',
        bold: true
      }, {
        element: 'body',
        fontSize: 11,
        fontFamily: 'Arial',
        color: '#374151',
        alignment: 'left'
      }],
      backgroundStyle: {
        type: 'color',
        value: '#ffffff'
      }
    }]
  } as PresentationTemplate
};

// Social media templates
export const SOCIAL_TEMPLATES = {
  INSTAGRAM_QUOTE: {
    id: 'instagram-quote-post',
    name: 'Instagram Quote',
    description: 'Inspirational quote for Instagram feed',
    contentType: 'social-post',
    dimensions: CANVA_DIMENSIONS.INSTAGRAM_POST,
    branding: {
      primaryColor: '#e11d48',
      secondaryColor: '#f472b6',
      accentColor: '#ffffff',
      fontFamily: 'Poppins'
    },
    slides: [{
      type: 'quote',
      layout: 'centered-quote',
      textStyles: [{
        element: 'title',
        fontSize: 36,
        fontFamily: 'Poppins',
        color: '#ffffff',
        alignment: 'center',
        bold: true
      }, {
        element: 'subtitle',
        fontSize: 18,
        fontFamily: 'Poppins',
        color: '#f1f5f9',
        alignment: 'center'
      }],
      backgroundStyle: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #e11d48, #f472b6)'
      }
    }]
  } as PresentationTemplate,

  LINKEDIN_INSIGHT: {
    id: 'linkedin-business-post',
    name: 'LinkedIn Business Post',
    description: 'Professional insight for LinkedIn sharing',
    contentType: 'social-post',
    dimensions: CANVA_DIMENSIONS.LINKEDIN_POST,
    branding: {
      primaryColor: '#0a66c2',
      secondaryColor: '#ffffff',
      accentColor: '#057642',
      fontFamily: 'Arial'
    },
    slides: [{
      type: 'content',
      layout: 'professional-card',
      textStyles: [{
        element: 'title',
        fontSize: 32,
        fontFamily: 'Arial',
        color: '#0a66c2',
        alignment: 'left',
        bold: true
      }, {
        element: 'body',
        fontSize: 18,
        fontFamily: 'Arial',
        color: '#1d2329',
        alignment: 'left'
      }],
      backgroundStyle: {
        type: 'color',
        value: '#ffffff'
      }
    }]
  } as PresentationTemplate,

  TWITTER_THREAD: {
    id: 'twitter-thread-card',
    name: 'Twitter Thread Card',
    description: 'Eye-catching card for Twitter threads',
    contentType: 'social-post',
    dimensions: CANVA_DIMENSIONS.TWITTER_POST,
    branding: {
      primaryColor: '#1d9bf0',
      secondaryColor: '#14171a',
      accentColor: '#ffffff',
      fontFamily: 'Helvetica'
    },
    slides: [{
      type: 'content',
      layout: 'twitter-card',
      textStyles: [{
        element: 'title',
        fontSize: 28,
        fontFamily: 'Helvetica',
        color: '#14171a',
        alignment: 'left',
        bold: true
      }, {
        element: 'body',
        fontSize: 16,
        fontFamily: 'Helvetica',
        color: '#536471',
        alignment: 'left'
      }],
      backgroundStyle: {
        type: 'color',
        value: '#ffffff'
      }
    }]
  } as PresentationTemplate
};

// Infographic templates
export const INFOGRAPHIC_TEMPLATES = {
  DATA_VISUALIZATION: {
    id: 'data-infographic-portrait',
    name: 'Data Infographic',
    description: 'Vertical infographic for data storytelling',
    contentType: 'infographic',
    dimensions: CANVA_DIMENSIONS.INFOGRAPHIC_PORTRAIT,
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
      accentColor: '#1e40af',
      fontFamily: 'Inter'
    },
    slides: [{
      type: 'content',
      layout: 'infographic-sections',
      textStyles: [{
        element: 'title',
        fontSize: 48,
        fontFamily: 'Inter',
        color: '#1e40af',
        alignment: 'center',
        bold: true
      }, {
        element: 'subtitle',
        fontSize: 24,
        fontFamily: 'Inter',
        color: '#3b82f6',
        alignment: 'center',
        bold: true
      }, {
        element: 'body',
        fontSize: 16,
        fontFamily: 'Inter',
        color: '#374151',
        alignment: 'left'
      }],
      backgroundStyle: {
        type: 'gradient',
        value: 'linear-gradient(180deg, #f8fafc, #e2e8f0)'
      }
    }]
  } as PresentationTemplate
};

// Helper function to get all templates by content type
export function getTemplatesByType(contentType: string): PresentationTemplate[] {
  const allTemplates = {
    ...DOCUMENT_TEMPLATES,
    ...SOCIAL_TEMPLATES,
    ...INFOGRAPHIC_TEMPLATES
  };

  return Object.values(allTemplates).filter(template =>
    template.contentType === contentType
  );
}

// Helper function to get template by ID
export function getTemplateById(id: string): PresentationTemplate | undefined {
  const allTemplates = {
    ...DOCUMENT_TEMPLATES,
    ...SOCIAL_TEMPLATES,
    ...INFOGRAPHIC_TEMPLATES
  };

  return Object.values(allTemplates).find(template => template.id === id);
}

// Content type detection from markdown frontmatter
export function detectContentType(frontmatter: Record<string, any>): string {
  // Check explicit content type
  if (frontmatter.contentType) {
    return frontmatter.contentType;
  }

  // Check template ID for hints
  if (frontmatter.template) {
    const template = getTemplateById(frontmatter.template);
    if (template) {
      return template.contentType;
    }
  }

  // Check for social media indicators
  if (frontmatter.social || frontmatter.platform) {
    return 'social-post';
  }

  // Check for document indicators
  if (frontmatter.documentType || frontmatter.format === 'document') {
    return 'document';
  }

  // Check for infographic indicators
  if (frontmatter.infographic || frontmatter.visualization) {
    return 'infographic';
  }

  // Default to presentation
  return 'presentation';
}