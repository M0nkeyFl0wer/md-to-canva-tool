import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
export class MarkdownParser {
    md;
    constructor() {
        this.md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true
        });
    }
    parse(markdownContent) {
        const { data: frontmatter, content } = matter(markdownContent);
        const slides = this.parseSlides(content);
        return {
            frontmatter,
            content,
            slides
        };
    }
    parseSlides(content) {
        const slides = [];
        const sections = content.split(/\n---\n/).filter(section => section.trim());
        for (const section of sections) {
            const slide = this.parseSlide(section.trim());
            if (slide) {
                slides.push(slide);
            }
        }
        return slides;
    }
    parseSlide(section) {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length === 0)
            return null;
        let title = '';
        const content = [];
        let slideType = 'content';
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('# ')) {
                title = line.substring(2).trim();
                slideType = i === 0 && lines.length <= 3 ? 'title' : 'content';
            }
            else if (line.startsWith('## ')) {
                if (!title) {
                    title = line.substring(3).trim();
                }
                else {
                    content.push(`**${line.substring(3).trim()}**`);
                }
            }
            else if (line.startsWith('### ')) {
                content.push(`**${line.substring(4).trim()}**`);
            }
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                content.push(line.substring(2).trim());
            }
            else if (line.startsWith('![')) {
                slideType = 'image';
                const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                if (match) {
                    content.push(`IMAGE: ${match[2]} (${match[1]})`);
                }
            }
            else if (line.startsWith('> ')) {
                slideType = 'quote';
                content.push(line.substring(2).trim());
            }
            else if (line && !line.startsWith('#')) {
                content.push(line);
            }
        }
        if (!title && content.length > 0) {
            title = content[0];
            content.shift();
        }
        return {
            title: title || 'Untitled Slide',
            content,
            type: slideType
        };
    }
    extractImages(content) {
        const images = [];
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = imageRegex.exec(content)) !== null) {
            images.push({
                alt: match[1] || '',
                url: match[2]
            });
        }
        return images;
    }
    extractLinks(content) {
        const links = [];
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        while ((match = linkRegex.exec(content)) !== null) {
            links.push({
                text: match[1],
                url: match[2]
            });
        }
        return links;
    }
    validateMarkdown(content) {
        const errors = [];
        try {
            const parsed = this.parse(content);
            if (parsed.slides.length === 0) {
                errors.push('No slides found. Use "---" to separate slides or ensure proper heading structure.');
            }
            if (parsed.slides.some(slide => !slide.title.trim())) {
                errors.push('Some slides are missing titles. Each slide should start with a heading.');
            }
            return {
                isValid: errors.length === 0,
                errors
            };
        }
        catch (error) {
            return {
                isValid: false,
                errors: [`Markdown parsing error: ${error instanceof Error ? error.message : String(error)}`]
            };
        }
    }
}
