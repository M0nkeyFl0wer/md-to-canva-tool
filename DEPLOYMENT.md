# 🚀 Deployment Instructions

Instructions for pushing to GitHub and setting up the repository.

## 📋 Repository Setup

Your repository is ready at: **https://github.com/M0nkeyFl0wer/md-to-canva-tool**

### 1. Connect Local Repository to GitHub

```bash
cd /home/monkeyflower/canva-md-converter

# Add remote origin
git remote add origin https://github.com/M0nkeyFl0wer/md-to-canva-tool.git

# Push to GitHub
git push -u origin main
```

### 2. Update README.md Image Links

After pushing, update the README.md to use your actual GitHub repository URLs:

```bash
# Replace these placeholder URLs in README.md:
# https://raw.githubusercontent.com/yourusername/canva-md-converter/main/assets/
# With:
# https://raw.githubusercontent.com/M0nkeyFl0wer/md-to-canva-tool/main/assets/
```

## 🎨 Adding Preview Images

### Create Preview Images

1. **Ocean Theme Preview**
   ```bash
   # Take screenshot of presentation-preview.html
   # Save as: assets/ocean-theme-preview.png
   ```

2. **Template Gallery**
   ```bash
   # Create collage of all templates
   # Save as: assets/template-gallery.png
   ```

3. **Ocean Slides Preview**
   ```bash
   # Screenshot of multiple ocean-themed slides
   # Save as: assets/ocean-slides-preview.png
   ```

### Upload Images to Repository

```bash
# Add images to assets folder
git add assets/*.png
git commit -m "docs: add preview images for README"
git push
```

## 📝 Repository Settings

### Enable GitHub Pages (Optional)

1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main / docs
4. Use for documentation hosting

### Add Repository Topics

Add these topics to help discovery:
- `canva`
- `markdown`
- `presentations`
- `mcp`
- `claude-code`
- `collaboration`
- `typescript`
- `react`

### Create Release

```bash
# Create first release
git tag -a v0.1.0 -m "Initial release - Canva Markdown Converter"
git push origin v0.1.0
```

Then create release on GitHub:
1. Go to Releases → Create a new release
2. Tag: v0.1.0
3. Title: "Initial Release - Canva Markdown Converter"
4. Description: Copy from CHANGELOG.md

## 🔧 Post-Deployment Setup

### Update README.md Links

Find and replace in README.md:
```bash
# From:
https://raw.githubusercontent.com/yourusername/canva-md-converter/main/

# To:
https://raw.githubusercontent.com/M0nkeyFl0wer/md-to-canva-tool/main/
```

### Verify Installation

Test that users can install:
```bash
git clone https://github.com/M0nkeyFl0wer/md-to-canva-tool.git
cd md-to-canva-tool
npm install
npm run setup
```

## 📊 Repository Stats

After deployment, your repository will include:

- **60 files** committed
- **10,813 lines** of code
- **5 templates** ready to use
- **Complete documentation**
- **Working examples**
- **Test suite**

## 🎯 Next Steps

1. **Push to GitHub** using commands above
2. **Add preview images** to make README visually appealing
3. **Create release** to mark stable version
4. **Share with community** - consider posting on relevant forums
5. **Monitor issues** and respond to user feedback

Your Canva Markdown Converter is ready for the world! 🌊