import { PresentationTemplate, SlideTemplate, TextStyle, BrandingConfig } from './types.js';
export declare const DEFAULT_BRANDING: BrandingConfig;
export declare const TEXT_STYLES: Record<string, TextStyle[]>;
export declare const SLIDE_TEMPLATES: Record<string, SlideTemplate[]>;
export declare const PRESENTATION_TEMPLATES: Record<string, PresentationTemplate>;
export declare function getTemplate(templateId: string): PresentationTemplate;
export declare function listTemplates(): Array<{
    id: string;
    name: string;
    description: string;
}>;
