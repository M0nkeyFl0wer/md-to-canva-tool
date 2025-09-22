import type { CanvaConfig } from "@canva/cli";

const config: CanvaConfig = {
  appId: "markdown-converter-app",
  name: "Markdown to Presentation Converter",
  developerPortalUrl: "http://localhost:8080",
  entrypoints: [
    {
      id: "markdown_converter",
      name: "Convert Markdown",
      description: "Convert markdown files to Canva presentations with team collaboration features",
      thumbnailUrl: "thumbnail.png",
      intents: [
        {
          type: "design_editor",
        },
      ],
    },
  ],
  requiredPermissions: [
    "DESIGN_CONTENT_WRITE",
    "DESIGN_CONTENT_READ",
    "DESIGN_EXPORT_READ",
    "TEAM_READ"
  ],
  optionalPermissions: [
    "TEAM_WRITE",
    "BRAND_READ"
  ]
};

export default config;