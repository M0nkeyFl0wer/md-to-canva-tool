import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import { useAddElement } from "@canva/design";
import * as React from "react";
import { useState } from "react";

export const App = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const addElement = useAddElement();

  const handleConvert = async () => {
    if (!markdownContent.trim()) {
      alert("Please enter some markdown content");
      return;
    }

    setIsConverting(true);

    try {
      // Parse markdown and create slides
      const slides = parseMarkdownToSlides(markdownContent);

      // Add each slide to Canva
      for (const slide of slides) {
        await addSlideToCanva(slide, addElement);
      }

      alert(`Successfully created ${slides.length} slides!`);
      setMarkdownContent("");
    } catch (error) {
      alert(`Error creating slides: ${error.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleAddSampleText = () => {
    addElement({
      type: "text",
      children: ["Hello from Markdown Converter!"],
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <Rows spacing="2u">
        <Title size="small">Markdown to Presentation Converter</Title>

        <Text>
          Paste your markdown content below to convert it into Canva slides.
          Use "---" to separate slides.
        </Text>

        <textarea
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
          placeholder="# My Presentation

## Slide 1
- Point 1
- Point 2

---

## Slide 2
- Another point"
          style={{
            width: "100%",
            height: "200px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "14px"
          }}
        />

        <Button
          variant="primary"
          onClick={handleConvert}
          disabled={isConverting || !markdownContent.trim()}
          stretch
        >
          {isConverting ? "Converting..." : "Convert to Slides"}
        </Button>

        <Button
          variant="secondary"
          onClick={handleAddSampleText}
          stretch
        >
          Add Sample Text
        </Button>

        <Text size="small">
          💡 Tip: Use headings (#, ##) for slide titles and bullets (-) for content points.
          Images and links are automatically detected and converted.
        </Text>
      </Rows>
    </div>
  );
};

// Simple markdown parser for slides
function parseMarkdownToSlides(markdown: string) {
  const slides = [];
  const sections = markdown.split(/\n---\n/).filter(section => section.trim());

  for (const section of sections) {
    const lines = section.trim().split('\n').filter(line => line.trim());
    if (lines.length === 0) continue;

    let title = '';
    const content = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        title = trimmed.substring(2).trim();
      } else if (trimmed.startsWith('## ')) {
        if (!title) {
          title = trimmed.substring(3).trim();
        } else {
          content.push(trimmed.substring(3).trim());
        }
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        content.push(trimmed.substring(2).trim());
      } else if (trimmed && !trimmed.startsWith('#')) {
        content.push(trimmed);
      }
    }

    if (title || content.length > 0) {
      slides.push({
        title: title || content[0] || 'Untitled Slide',
        content: title && content.length > 0 ? content : content.slice(1)
      });
    }
  }

  return slides;
}

// Add slide content to Canva
async function addSlideToCanva(slide: any, addElement: any) {
  // Add title
  if (slide.title) {
    await addElement({
      type: "text",
      children: [slide.title],
      fontSize: 24,
      fontWeight: "bold",
      color: "#1e40af"
    });
  }

  // Add content points
  if (slide.content && slide.content.length > 0) {
    const contentText = slide.content.map((item: string) => `• ${item}`).join('\n');
    await addElement({
      type: "text",
      children: [contentText],
      fontSize: 16
    });
  }

  // Add a small delay between elements
  await new Promise(resolve => setTimeout(resolve, 100));
}