/**
 * GitHub Repository Widget v1.0.0
 * A standalone, embeddable widget to display GitHub repository information
 *
 * Usage:
 *   <div id="my-widget"></div>
 *   <script src="https://cdn.jsdelivr.net/gh/YOUR_USERNAME/github-widget@main/github-widget.js"></script>
 *   <script>
 *     GitHubWidget.create({
 *       container: '#my-widget',
 *       owner: 'facebook',
 *       repo: 'react'
 *     });
 *   </script>
 *
 * Options:
 *   container: HTMLElement or CSS selector (required)
 *   owner: GitHub username or organization (required)
 *   repo: Repository name (required)
 *   theme: 'light' or 'dark' (optional, default: 'light')
 *   token: GitHub PAT for traffic stats (optional)
 *
 * @license MIT
 */
(function(global) {
    'use strict';

    // Inject CSS if not already present
    function injectStyles() {
        if (document.getElementById('gh-widget-styles')) return;

        const css = `
            .gh-widget {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
                max-width: 400px;
                border: 1px solid #d0d7de;
                border-radius: 6px;
                padding: 16px;
                background: #ffffff;
                color: #1f2328;
                box-sizing: border-box;
            }
            .gh-widget * { box-sizing: border-box; }
            .gh-widget-header {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 12px;
            }
            .gh-widget-avatar {
                width: 48px;
                height: 48px;
                border-radius: 6px;
                flex-shrink: 0;
            }
            .gh-widget-title-section {
                flex: 1;
                min-width: 0;
            }
            .gh-widget-repo-link {
                font-size: 16px;
                font-weight: 600;
                color: #0969da;
                text-decoration: none;
                word-break: break-word;
            }
            .gh-widget-repo-link:hover { text-decoration: underline; }
            .gh-widget-owner {
                font-size: 12px;
                color: #656d76;
                margin-top: 2px;
            }
            .gh-widget-description {
                font-size: 14px;
                color: #1f2328;
                line-height: 1.5;
                margin-bottom: 12px;
                word-break: break-word;
            }
            .gh-widget-description:empty { display: none; }
            .gh-widget-stats {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                margin-bottom: 12px;
                font-size: 12px;
                color: #656d76;
            }
            .gh-widget-stat {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .gh-widget-stat svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }
            .gh-widget-stat-value {
                font-weight: 600;
                color: #1f2328;
            }
            .gh-widget-languages { margin-top: 12px; }
            .gh-widget-lang-bar {
                display: flex;
                height: 8px;
                border-radius: 4px;
                overflow: hidden;
                background: #eaeef2;
                margin-bottom: 8px;
            }
            .gh-widget-lang-segment {
                height: 100%;
                transition: width 0.3s ease;
            }
            .gh-widget-lang-list {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                font-size: 12px;
            }
            .gh-widget-lang-item {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .gh-widget-lang-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .gh-widget-lang-name {
                color: #1f2328;
                font-weight: 500;
            }
            .gh-widget-lang-percent { color: #656d76; }
            .gh-widget-traffic {
                margin-top: 16px;
                padding-top: 12px;
                border-top: 1px solid #d0d7de;
            }
            .gh-widget-traffic-title {
                font-size: 12px;
                font-weight: 600;
                color: #656d76;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .gh-widget-traffic-stats {
                display: flex;
                gap: 20px;
                font-size: 12px;
            }
            .gh-widget-traffic-item {
                display: flex;
                flex-direction: column;
            }
            .gh-widget-traffic-value {
                font-size: 18px;
                font-weight: 600;
                color: #1f2328;
            }
            .gh-widget-traffic-label { color: #656d76; }
            .gh-widget-loading {
                text-align: center;
                padding: 20px;
                color: #656d76;
            }
            .gh-widget-error {
                text-align: center;
                padding: 20px;
                color: #cf222e;
                background: #ffebe9;
                border-radius: 6px;
            }
            .gh-widget-footer {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #d0d7de;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: #656d76;
            }
            .gh-widget-footer svg {
                width: 16px;
                height: 16px;
            }
            /* Dark mode */
            .gh-widget.dark {
                background: #0d1117;
                border-color: #30363d;
                color: #e6edf3;
            }
            .gh-widget.dark .gh-widget-repo-link { color: #58a6ff; }
            .gh-widget.dark .gh-widget-owner,
            .gh-widget.dark .gh-widget-stats,
            .gh-widget.dark .gh-widget-lang-percent,
            .gh-widget.dark .gh-widget-traffic-label,
            .gh-widget.dark .gh-widget-traffic-title,
            .gh-widget.dark .gh-widget-footer { color: #8b949e; }
            .gh-widget.dark .gh-widget-description,
            .gh-widget.dark .gh-widget-stat-value,
            .gh-widget.dark .gh-widget-lang-name,
            .gh-widget.dark .gh-widget-traffic-value { color: #e6edf3; }
            .gh-widget.dark .gh-widget-lang-bar { background: #21262d; }
            .gh-widget.dark .gh-widget-traffic,
            .gh-widget.dark .gh-widget-footer { border-color: #30363d; }
            .gh-widget.dark .gh-widget-error {
                background: #3d1d1d;
                color: #ff7b72;
            }
        `;

        const style = document.createElement('style');
        style.id = 'gh-widget-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // GitHub language colors
    const LANG_COLORS = {
        'JavaScript': '#f1e05a', 'TypeScript': '#3178c6', 'Python': '#3572A5',
        'Java': '#b07219', 'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600',
        'Go': '#00ADD8', 'Rust': '#dea584', 'Ruby': '#701516', 'PHP': '#4F5D95',
        'Swift': '#F05138', 'Kotlin': '#A97BFF', 'Scala': '#c22d40', 'Dart': '#00B4AB',
        'HTML': '#e34c26', 'CSS': '#563d7c', 'SCSS': '#c6538c', 'Shell': '#89e051',
        'PowerShell': '#012456', 'Lua': '#000080', 'Perl': '#0298c3', 'R': '#198CE7',
        'MATLAB': '#e16737', 'Julia': '#a270ba', 'Haskell': '#5e5086', 'Elixir': '#6e4a7e',
        'Clojure': '#db5855', 'Erlang': '#B83998', 'F#': '#b845fc', 'Vue': '#41b883',
        'Svelte': '#ff3e00', 'Dockerfile': '#384d54', 'Makefile': '#427819',
        'Objective-C': '#438eff', 'Jupyter Notebook': '#DA5B0B', 'default': '#8b949e'
    };

    // SVG Icons
    const ICONS = {
        star: '<svg viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>',
        fork: '<svg viewBox="0 0 16 16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>',
        issue: '<svg viewBox="0 0 16 16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/></svg>',
        github: '<svg viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>'
    };

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return num.toString();
    }

    function getLangColor(lang) {
        return LANG_COLORS[lang] || LANG_COLORS['default'];
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function fetchRepoData(owner, repo, token) {
        const headers = {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const baseUrl = 'https://api.github.com';

        const repoResponse = await fetch(baseUrl + '/repos/' + owner + '/' + repo, { headers: headers });
        if (!repoResponse.ok) throw new Error('Repository not found: ' + owner + '/' + repo);
        const repoData = await repoResponse.json();

        var languages = {};
        try {
            const langResponse = await fetch(baseUrl + '/repos/' + owner + '/' + repo + '/languages', { headers: headers });
            if (langResponse.ok) languages = await langResponse.json();
        } catch (e) { /* ignore */ }

        var traffic = null;
        if (token) {
            try {
                const [viewsRes, clonesRes] = await Promise.all([
                    fetch(baseUrl + '/repos/' + owner + '/' + repo + '/traffic/views', { headers: headers }),
                    fetch(baseUrl + '/repos/' + owner + '/' + repo + '/traffic/clones', { headers: headers })
                ]);
                if (viewsRes.ok && clonesRes.ok) {
                    const views = await viewsRes.json();
                    const clones = await clonesRes.json();
                    traffic = {
                        views: views.count || 0,
                        uniqueVisitors: views.uniques || 0,
                        clones: clones.count || 0,
                        uniqueCloners: clones.uniques || 0
                    };
                }
            } catch (e) { /* ignore */ }
        }

        return { repoData: repoData, languages: languages, traffic: traffic };
    }

    function renderWidget(container, data, theme) {
        const { repoData, languages, traffic } = data;
        const isDark = theme === 'dark';

        const totalBytes = Object.values(languages).reduce(function(a, b) { return a + b; }, 0);
        const langPercentages = Object.entries(languages)
            .map(function(entry) {
                return { name: entry[0], percent: ((entry[1] / totalBytes) * 100).toFixed(1), bytes: entry[1] };
            })
            .sort(function(a, b) { return b.bytes - a.bytes; })
            .slice(0, 6);

        var html = '<div class="gh-widget' + (isDark ? ' dark' : '') + '">' +
            '<div class="gh-widget-header">' +
                '<img class="gh-widget-avatar" src="' + escapeHtml(repoData.owner.avatar_url) + '" alt="' + escapeHtml(repoData.owner.login) + '" loading="lazy">' +
                '<div class="gh-widget-title-section">' +
                    '<a class="gh-widget-repo-link" href="' + escapeHtml(repoData.html_url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(repoData.name) + '</a>' +
                    '<div class="gh-widget-owner">' + escapeHtml(repoData.owner.login) + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="gh-widget-description">' + (repoData.description ? escapeHtml(repoData.description) : '') + '</div>' +
            '<div class="gh-widget-stats">' +
                '<div class="gh-widget-stat">' + ICONS.star + '<span class="gh-widget-stat-value">' + formatNumber(repoData.stargazers_count) + '</span> stars</div>' +
                '<div class="gh-widget-stat">' + ICONS.fork + '<span class="gh-widget-stat-value">' + formatNumber(repoData.forks_count) + '</span> forks</div>' +
                (repoData.open_issues_count > 0 ? '<div class="gh-widget-stat">' + ICONS.issue + '<span class="gh-widget-stat-value">' + formatNumber(repoData.open_issues_count) + '</span> issues</div>' : '') +
            '</div>';

        if (langPercentages.length > 0) {
            html += '<div class="gh-widget-languages"><div class="gh-widget-lang-bar">';
            langPercentages.forEach(function(lang) {
                html += '<div class="gh-widget-lang-segment" style="width:' + lang.percent + '%;background-color:' + getLangColor(lang.name) + ';" title="' + lang.name + ': ' + lang.percent + '%"></div>';
            });
            html += '</div><div class="gh-widget-lang-list">';
            langPercentages.forEach(function(lang) {
                html += '<div class="gh-widget-lang-item"><span class="gh-widget-lang-dot" style="background-color:' + getLangColor(lang.name) + ';"></span><span class="gh-widget-lang-name">' + escapeHtml(lang.name) + '</span><span class="gh-widget-lang-percent">' + lang.percent + '%</span></div>';
            });
            html += '</div></div>';
        }

        if (traffic) {
            html += '<div class="gh-widget-traffic">' +
                '<div class="gh-widget-traffic-title">Traffic (last 14 days)</div>' +
                '<div class="gh-widget-traffic-stats">' +
                    '<div class="gh-widget-traffic-item"><span class="gh-widget-traffic-value">' + formatNumber(traffic.views) + '</span><span class="gh-widget-traffic-label">Views (' + traffic.uniqueVisitors + ' unique)</span></div>' +
                    '<div class="gh-widget-traffic-item"><span class="gh-widget-traffic-value">' + formatNumber(traffic.clones) + '</span><span class="gh-widget-traffic-label">Clones (' + traffic.uniqueCloners + ' unique)</span></div>' +
                '</div></div>';
        }

        html += '<div class="gh-widget-footer">' + ICONS.github + '<span>Powered by GitHub API</span></div></div>';
        container.innerHTML = html;
    }

    function renderError(container, message, theme) {
        container.innerHTML = '<div class="gh-widget' + (theme === 'dark' ? ' dark' : '') + '"><div class="gh-widget-error">' + escapeHtml(message) + '</div></div>';
    }

    function renderLoading(container, theme) {
        container.innerHTML = '<div class="gh-widget' + (theme === 'dark' ? ' dark' : '') + '"><div class="gh-widget-loading">Loading repository...</div></div>';
    }

    var GitHubWidget = {
        create: async function(options) {
            injectStyles();

            var container = options.container;
            if (typeof container === 'string') container = document.querySelector(container);
            if (!container) throw new Error('Container element not found');

            var theme = options.theme || 'light';
            renderLoading(container, theme);

            try {
                var data = await fetchRepoData(options.owner, options.repo, options.token);
                renderWidget(container, data, theme);
            } catch (error) {
                renderError(container, error.message, theme);
            }
        },
        colors: LANG_COLORS,
        version: '1.0.0'
    };

    // Export for different module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GitHubWidget;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return GitHubWidget; });
    } else {
        global.GitHubWidget = GitHubWidget;
    }

})(typeof window !== 'undefined' ? window : this);
