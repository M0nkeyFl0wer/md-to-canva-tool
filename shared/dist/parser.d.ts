import { MarkdownContent } from './types.js';
export declare class MarkdownParser {
    private md;
    constructor();
    parse(markdownContent: string): MarkdownContent;
    private parseSlides;
    private parseSlide;
    extractImages(content: string): Array<{
        url: string;
        alt: string;
    }>;
    extractLinks(content: string): Array<{
        text: string;
        url: string;
    }>;
    validateMarkdown(content: string): {
        isValid: boolean;
        errors: string[];
    };
}
