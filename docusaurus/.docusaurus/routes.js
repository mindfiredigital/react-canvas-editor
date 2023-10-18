import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', '233'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '548'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '3db'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', 'c9e'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', '67a'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', 'c6a'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', 'fbb'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', 'e90'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '764'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '00f'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', '4df'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '4ce'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '6c7'),
    routes: [
      {
        path: '/docs/category/contribution-guide',
        component: ComponentCreator('/docs/category/contribution-guide', 'efe'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/get-started',
        component: ComponentCreator('/docs/category/get-started', '9e4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/references',
        component: ComponentCreator('/docs/category/references', 'c2e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/release',
        component: ComponentCreator('/docs/category/release', 'a32'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/tutorials',
        component: ComponentCreator('/docs/category/tutorials', 'f40'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contributors/',
        component: ComponentCreator('/docs/contributors/', '7c4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contributors/code-of-conduce',
        component: ComponentCreator('/docs/contributors/code-of-conduce', '817'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contributors/contribution',
        component: ComponentCreator('/docs/contributors/contribution', '530'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Get-started/Installation',
        component: ComponentCreator('/docs/Get-started/Installation', 'bac'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/Get-started/quickstart',
        component: ComponentCreator('/docs/Get-started/quickstart', 'f58'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/references/dom-event',
        component: ComponentCreator('/docs/references/dom-event', '62b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/references/toolbar-option',
        component: ComponentCreator('/docs/references/toolbar-option', '594'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/release/change-logs',
        component: ComponentCreator('/docs/release/change-logs', '098'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/release/release-notes',
        component: ComponentCreator('/docs/release/release-notes', '801'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/customized-style',
        component: ComponentCreator('/docs/tutorial-basics/customized-style', '700'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/customized-tool',
        component: ComponentCreator('/docs/tutorial-basics/customized-tool', '0ee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/tutorial-basics/dom-handle',
        component: ComponentCreator('/docs/tutorial-basics/dom-handle', '205'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/what-is-canvas-editor',
        component: ComponentCreator('/docs/what-is-canvas-editor', '3c8'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '554'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
