import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/react-canvas-editor/__docusaurus/debug',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug', '260'),
    exact: true
  },
  {
    path: '/react-canvas-editor/__docusaurus/debug/config',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug/config', '464'),
    exact: true
  },
  {
    path: '/react-canvas-editor/__docusaurus/debug/content',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug/content', 'de0'),
    exact: true
  },
  {
    path: '/react-canvas-editor/__docusaurus/debug/globalData',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug/globalData', '74a'),
    exact: true
  },
  {
    path: '/react-canvas-editor/__docusaurus/debug/metadata',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug/metadata', '629'),
    exact: true
  },
  {
    path: '/react-canvas-editor/__docusaurus/debug/registry',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug/registry', 'bef'),
    exact: true
  },
  {
    path: '/react-canvas-editor/__docusaurus/debug/routes',
    component: ComponentCreator('/react-canvas-editor/__docusaurus/debug/routes', '1d8'),
    exact: true
  },
  {
    path: '/react-canvas-editor/markdown-page',
    component: ComponentCreator('/react-canvas-editor/markdown-page', '506'),
    exact: true
  },
  {
    path: '/react-canvas-editor/docs',
    component: ComponentCreator('/react-canvas-editor/docs', '14f'),
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
        path: '/react-canvas-editor/docs/contributors/how-to-cotribute',
        component: ComponentCreator('/react-canvas-editor/docs/contributors/how-to-cotribute', '410'),
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
