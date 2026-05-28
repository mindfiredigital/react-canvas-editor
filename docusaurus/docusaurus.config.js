// @ts-check
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'React Canvas Editor',
  tagline:
    'A powerful, customizable React-based document editor for crafting and managing multi-page documents with ease.',
  favicon: 'img/mindfire.ico',

  url: 'https://mindfiredigital.github.io',
  baseUrl: '/react-canvas-editor',

  organizationName: 'mindfiredigital',
  projectName: 'react-canvas-editor',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/mindfiredigital/react-canvas-editor/tree/main/docusaurus/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'npm_release',
        content:
          '🎉 <b>v1.3.0</b> of <code>@mindfiredigital/canvas-editor</code> is live on npm — <a target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/@mindfiredigital/canvas-editor">view package</a>',
        backgroundColor: '#1a1b2e',
        textColor: '#ffffff',
        isCloseable: true,
      },
      navbar: {
        title: 'React Canvas Editor',
        logo: {
          alt: 'React Canvas Editor',
          src: 'img/logo.webp',
        },
        items: [
          {to: '/', label: 'Home', position: 'left'},
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            to: '/docs/Get-started/quickstart',
            label: 'Quick Start',
            position: 'left',
          },
          {
            href: 'https://www.npmjs.com/package/@mindfiredigital/canvas-editor',
            label: 'npm',
            position: 'right',
          },
          {
            href: 'https://github.com/mindfiredigital/react-canvas-editor',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {label: 'Introduction', to: '/docs/what-is-document-editor'},
              {label: 'Installation', to: '/docs/Get-started/Installation'},
              {label: 'Quick Start', to: '/docs/Get-started/quickstart'},
              {label: 'API Reference', to: '/docs/references/dom-event'},
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/mindfiredigital/react-canvas-editor',
              },
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/@mindfiredigital/canvas-editor',
              },
              {
                label: 'Issues',
                href: 'https://github.com/mindfiredigital/react-canvas-editor/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {label: 'Release Notes', to: '/docs/release/release-notes'},
              {
                label: 'Report an Issue',
                href: 'https://github.com/mindfiredigital/react-canvas-editor/issues',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Mindfire Digital LLP. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'tsx', 'jsx'],
      },
    }),
};

module.exports = config;
