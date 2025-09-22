import { OCEAN_PASTEL_TEMPLATE } from './ocean-template.js';
export const DEFAULT_BRANDING = {
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    accentColor: '#0ea5e9',
    fontFamily: 'Inter'
};
export const TEXT_STYLES = {
    professional: [
        {
            element: 'title',
            fontSize: 48,
            fontFamily: 'Inter',
            color: '#1e40af',
            alignment: 'center',
            bold: true
        },
        {
            element: 'subtitle',
            fontSize: 24,
            fontFamily: 'Inter',
            color: '#64748b',
            alignment: 'center'
        },
        {
            element: 'body',
            fontSize: 18,
            fontFamily: 'Inter',
            color: '#374151',
            alignment: 'left'
        },
        {
            element: 'bullet',
            fontSize: 16,
            fontFamily: 'Inter',
            color: '#374151',
            alignment: 'left'
        }
    ],
    modern: [
        {
            element: 'title',
            fontSize: 52,
            fontFamily: 'Poppins',
            color: '#000000',
            alignment: 'left',
            bold: true
        },
        {
            element: 'subtitle',
            fontSize: 28,
            fontFamily: 'Poppins',
            color: '#6b7280',
            alignment: 'left'
        },
        {
            element: 'body',
            fontSize: 20,
            fontFamily: 'Open Sans',
            color: '#374151',
            alignment: 'left'
        },
        {
            element: 'bullet',
            fontSize: 18,
            fontFamily: 'Open Sans',
            color: '#374151',
            alignment: 'left'
        }
    ],
    minimal: [
        {
            element: 'title',
            fontSize: 44,
            fontFamily: 'Helvetica',
            color: '#000000',
            alignment: 'center',
            bold: true
        },
        {
            element: 'subtitle',
            fontSize: 22,
            fontFamily: 'Helvetica',
            color: '#666666',
            alignment: 'center'
        },
        {
            element: 'body',
            fontSize: 16,
            fontFamily: 'Helvetica',
            color: '#333333',
            alignment: 'left'
        },
        {
            element: 'bullet',
            fontSize: 14,
            fontFamily: 'Helvetica',
            color: '#333333',
            alignment: 'left'
        }
    ]
};
export const SLIDE_TEMPLATES = {
    professional: [
        {
            type: 'title',
            layout: 'title-center',
            textStyles: TEXT_STYLES.professional,
            backgroundStyle: {
                type: 'gradient',
                value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        },
        {
            type: 'content',
            layout: 'title-bullets',
            textStyles: TEXT_STYLES.professional,
            backgroundStyle: {
                type: 'color',
                value: '#ffffff'
            }
        },
        {
            type: 'image',
            layout: 'image-caption',
            textStyles: TEXT_STYLES.professional
        },
        {
            type: 'quote',
            layout: 'quote-center',
            textStyles: TEXT_STYLES.professional,
            backgroundStyle: {
                type: 'color',
                value: '#f8fafc'
            }
        }
    ],
    modern: [
        {
            type: 'title',
            layout: 'title-left',
            textStyles: TEXT_STYLES.modern,
            backgroundStyle: {
                type: 'gradient',
                value: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
            }
        },
        {
            type: 'content',
            layout: 'title-bullets-split',
            textStyles: TEXT_STYLES.modern
        }
    ],
    minimal: [
        {
            type: 'title',
            layout: 'title-center',
            textStyles: TEXT_STYLES.minimal,
            backgroundStyle: {
                type: 'color',
                value: '#ffffff'
            }
        },
        {
            type: 'content',
            layout: 'title-bullets',
            textStyles: TEXT_STYLES.minimal
        }
    ]
};
export const PRESENTATION_TEMPLATES = {
    'professional-blue': {
        id: 'professional-blue',
        name: 'Professional Blue',
        description: 'Clean, corporate-style presentation with blue accent colors',
        slides: SLIDE_TEMPLATES.professional,
        branding: {
            primaryColor: '#1e40af',
            secondaryColor: '#64748b',
            accentColor: '#0ea5e9',
            fontFamily: 'Inter'
        }
    },
    'modern-gradient': {
        id: 'modern-gradient',
        name: 'Modern Gradient',
        description: 'Contemporary design with gradient backgrounds and bold typography',
        slides: SLIDE_TEMPLATES.modern,
        branding: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            accentColor: '#f093fb',
            fontFamily: 'Poppins'
        }
    },
    'minimal-clean': {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        description: 'Simple, distraction-free design focusing on content',
        slides: SLIDE_TEMPLATES.minimal,
        branding: {
            primaryColor: '#000000',
            secondaryColor: '#666666',
            accentColor: '#999999',
            fontFamily: 'Helvetica'
        }
    },
    'research-report': {
        id: 'research-report',
        name: 'Research Report',
        description: 'Academic/research presentation with data visualization support',
        slides: SLIDE_TEMPLATES.professional,
        branding: {
            primaryColor: '#1f2937',
            secondaryColor: '#6b7280',
            accentColor: '#3b82f6',
            fontFamily: 'Inter'
        }
    },
    'ocean-pastel': OCEAN_PASTEL_TEMPLATE
};
export function getTemplate(templateId) {
    return PRESENTATION_TEMPLATES[templateId] || PRESENTATION_TEMPLATES['professional-blue'];
}
export function listTemplates() {
    return Object.values(PRESENTATION_TEMPLATES).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description
    }));
}
