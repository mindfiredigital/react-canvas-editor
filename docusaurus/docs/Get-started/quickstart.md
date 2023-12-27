---
sidebar_position: 2
---

# Quick Start

Let's explore the Document Editor in less than 5 minutes.

## Getting Started

To get started with the Document Editor, you'll need to initialize it in your project and specify the container element where the editor will be embedded.

- **React Component**

  ```javascript
  import { DocumentEditor } from "@mindfiredigital/react-canvas-editor";
  import React from "react";

  export const App = () => <DocumentEditor />;
  ```

- **Web Component for React**

  ```javascript
  import { DocumentEditorWebComponent } from "@mindfiredigital/react-canvas-editor";
  import React from "react";

  DocumentEditorWebComponent();

  export const App = () => <div id='document-editor'></div>;
  ```

- **Web Component for JavaScript**

  ```html
  <!-- In you html file add following code in a body tag where you want to use react canvas editor -->
  <body>
    <div id="document-editor"></div>
    <script type="module" src="/main.js"></script>
  </body>
  ;
  ```

  ```javascript
  // In main.js file(i.e. used as a script in html file) add the following code
  import { DocumentEditorWebComponent } from "@mindfiredigital/react-canvas-editor";

  DocumentEditorWebComponent();
  ```

:::info

Note that after importing '@mindfiredigital/react-canvas-editor,' your project may experience a longer initial load time, but subsequent loads should be quicker.

:::

Please make sure that you import the library correctly, and your editor will function smoothly.
