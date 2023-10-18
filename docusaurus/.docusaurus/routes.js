import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/react-canvas-editor/blog',
    component: ComponentCreator('/react-canvas-editor/blog', '695'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/archive',
    component: ComponentCreator('/react-canvas-editor/blog/archive', '047'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/first-blog-post',
    component: ComponentCreator('/react-canvas-editor/blog/first-blog-post', 'ee1'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/long-blog-post',
    component: ComponentCreator('/react-canvas-editor/blog/long-blog-post', 'b0e'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/mdx-blog-post',
    component: ComponentCreator('/react-canvas-editor/blog/mdx-blog-post', '6c0'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/tags',
    component: ComponentCreator('/react-canvas-editor/blog/tags', '71c'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/tags/docusaurus',
    component: ComponentCreator('/react-canvas-editor/blog/tags/docusaurus', 'ce0'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/tags/facebook',
    component: ComponentCreator('/react-canvas-editor/blog/tags/facebook', '571'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/tags/hello',
    component: ComponentCreator('/react-canvas-editor/blog/tags/hello', 'c39'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/tags/hola',
    component: ComponentCreator('/react-canvas-editor/blog/tags/hola', '03c'),
    exact: true
  },
  {
    path: '/react-canvas-editor/blog/welcome',
    component: ComponentCreator('/react-canvas-editor/blog/welcome', '7dc'),
    exact: true
  },
  {
    path: '/react-canvas-editor/markdown-page',
    component: ComponentCreator('/react-canvas-editor/markdown-page', '506'),
    exact: true
  },
  {
    path: '/react-canvas-editor/docs',
    component: ComponentCreator('/react-canvas-editor/docs', '278'),
    routes: [
      {
        path: '/react-canvas-editor/docs/category/contribution-guide',
        component: ComponentCreator('/react-canvas-editor/docs/category/contribution-guide', 'a45'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/category/get-started',
        component: ComponentCreator('/react-canvas-editor/docs/category/get-started', '3a7'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/category/references',
        component: ComponentCreator('/react-canvas-editor/docs/category/references', '7c6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/category/release',
        component: ComponentCreator('/react-canvas-editor/docs/category/release', '79e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/category/tutorials',
        component: ComponentCreator('/react-canvas-editor/docs/category/tutorials', '360'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/contributors/',
        component: ComponentCreator('/react-canvas-editor/docs/contributors/', 'da6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/contributors/code-of-conduce',
        component: ComponentCreator('/react-canvas-editor/docs/contributors/code-of-conduce', '669'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/contributors/contribution',
        component: ComponentCreator('/react-canvas-editor/docs/contributors/contribution', 'f17'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/Get-started/Installation',
        component: ComponentCreator('/react-canvas-editor/docs/Get-started/Installation', 'aa6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/Get-started/quickstart',
        component: ComponentCreator('/react-canvas-editor/docs/Get-started/quickstart', 'e3c'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/references/dom-event',
        component: ComponentCreator('/react-canvas-editor/docs/references/dom-event', 'f39'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/references/toolbar-option',
        component: ComponentCreator('/react-canvas-editor/docs/references/toolbar-option', 'ffd'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/release/change-logs',
        component: ComponentCreator('/react-canvas-editor/docs/release/change-logs', '335'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/release/release-notes',
        component: ComponentCreator('/react-canvas-editor/docs/release/release-notes', 'a21'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/tutorial-basics/customized-style',
        component: ComponentCreator('/react-canvas-editor/docs/tutorial-basics/customized-style', 'c86'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/tutorial-basics/customized-tool',
        component: ComponentCreator('/react-canvas-editor/docs/tutorial-basics/customized-tool', 'bb9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/tutorial-basics/dom-handle',
        component: ComponentCreator('/react-canvas-editor/docs/tutorial-basics/dom-handle', '4e2'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/what-is-document-editor',
        component: ComponentCreator('/react-canvas-editor/docs/what-is-document-editor', 'cd3'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/react-canvas-editor/',
    component: ComponentCreator('/react-canvas-editor/', 'fae'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];