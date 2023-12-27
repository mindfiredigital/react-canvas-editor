import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/react-canvas-editor/markdown-page',
    component: ComponentCreator('/react-canvas-editor/markdown-page', 'ef3'),
    exact: true
  },
  {
    path: '/react-canvas-editor/docs',
    component: ComponentCreator('/react-canvas-editor/docs', 'd63'),
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
        path: '/react-canvas-editor/docs/category/why-we-use-canvas',
        component: ComponentCreator('/react-canvas-editor/docs/category/why-we-use-canvas', 'c4b'),
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
        path: '/react-canvas-editor/docs/contributors/code-of-conduct',
        component: ComponentCreator('/react-canvas-editor/docs/contributors/code-of-conduct', '34b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/react-canvas-editor/docs/contributors/how-to-contribute',
        component: ComponentCreator('/react-canvas-editor/docs/contributors/how-to-contribute', 'a7b'),
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
      },
      {
        path: '/react-canvas-editor/docs/Why-we-use-canvas/',
        component: ComponentCreator('/react-canvas-editor/docs/Why-we-use-canvas/', 'ffd'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/react-canvas-editor/',
    component: ComponentCreator('/react-canvas-editor/', '600'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
