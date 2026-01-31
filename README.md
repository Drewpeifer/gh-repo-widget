# GitHub Repository Widget

A lightweight, embeddable widget to display GitHub repository information on any webpage. No frameworks required - pure vanilla JavaScript.

![Light Theme](https://img.shields.io/badge/theme-light-lightgrey) ![Dark Theme](https://img.shields.io/badge/theme-dark-black)

## Features

- ⭐ Stars count
- 🍴 Forks count
- 📝 Repository description
- 🎨 Language breakdown with color-coded bar
- 📊 Traffic stats (views & clones) - requires token
- 🌙 Light and dark theme support
- 📱 Responsive design
- 🚀 Zero dependencies

## Quick Start

### Option 1: CDN (Recommended)

Add this to your HTML:

```html
<!-- Container for the widget -->
<div id="github-widget"></div>

<!-- Load the widget script -->
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@main/github-widget.js"></script>

<!-- Initialize the widget -->
<script>
  GitHubWidget.create({
    container: '#github-widget',
    owner: 'facebook',
    repo: 'react'
  });
</script>
```

### Option 2: Download

1. Download `github-widget.js`
2. Include it in your project
3. Initialize as shown above

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `container` | String/Element | Yes | - | CSS selector or DOM element |
| `owner` | String | Yes | - | GitHub username or organization |
| `repo` | String | Yes | - | Repository name |
| `theme` | String | No | `'light'` | `'light'` or `'dark'` |
| `token` | String | No | - | GitHub PAT for traffic stats |

## Examples

### Basic Usage

```html
<div id="widget"></div>
<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@main/github-widget.js"></script>
<script>
  GitHubWidget.create({
    container: '#widget',
    owner: 'microsoft',
    repo: 'vscode'
  });
</script>
```

### Dark Theme

```javascript
GitHubWidget.create({
  container: '#widget',
  owner: 'torvalds',
  repo: 'linux',
  theme: 'dark'
});
```

### With Traffic Stats

Traffic stats require a GitHub Personal Access Token with `public_repo` scope (or `repo` for private repos).

```javascript
GitHubWidget.create({
  container: '#widget',
  owner: 'YOUR_USERNAME',
  repo: 'YOUR_REPO',
  token: 'ghp_xxxxxxxxxxxx'
});
```

> ⚠️ **Security Warning**: Never expose your token in client-side code on public websites. Traffic stats are only available for repositories you own or have push access to.

### Multiple Widgets

```html
<div id="widget1"></div>
<div id="widget2"></div>

<script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@main/github-widget.js"></script>
<script>
  GitHubWidget.create({ container: '#widget1', owner: 'facebook', repo: 'react' });
  GitHubWidget.create({ container: '#widget2', owner: 'vuejs', repo: 'vue', theme: 'dark' });
</script>
```

## CDN URLs

After pushing to GitHub, your widget will be available at:

```
# Latest version (may be cached)
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@main/github-widget.js

# Specific version (recommended for production)
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@v1.0.0/github-widget.js

# Minified (automatic)
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@main/github-widget.min.js
```

## Creating a GitHub Token

To enable traffic statistics:

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scope: `public_repo` (for public repos) or `repo` (for private repos)
4. Generate and copy the token

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## API Reference

### `GitHubWidget.create(options)`

Creates a new widget instance.

### `GitHubWidget.colors`

Object containing GitHub's official language colors. You can modify these before creating widgets:

```javascript
GitHubWidget.colors['MyLanguage'] = '#ff0000';
```

### `GitHubWidget.version`

Returns the current version string.

## License

MIT License - feel free to use in personal and commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
