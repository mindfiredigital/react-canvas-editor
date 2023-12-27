---
sidebar_position: 1
---

# How to customize toolbar

Customizing the user interface and actions of the editor to align with your application's requirements is essential.

## Customize toolbar

The toolbar offers the flexibility to add or remove various tools to suit your specific needs. By default, all tools in the toolbar options are displayed.

## Adding or Removing Tools

To customize the toolbar, you can create an object with the following structure:

```javascript
const toolbarItem = {
  bold: true,
  italic: true,
  underline: true,
  undo: true,
  redo: true,
  image: false,
};
```

- To add a tool, set its value to true.
- To remove a tool, set its value to false.

Here's an example of how to implement this in your code:

- **React Component**

  ```javascript
  import { DocumentEditor } from "@mindfiredigital/react-canvas-editor";
  import React from "react";

  export const App = () => {
    const toolbarItem = {
      bold: true,
      italic: true,
      underline: true,
      undo: true,
      redo: true,
      image: false,
    };

    return <DocumentEditor toolbar={toolbarItem} />;
  };
  ```

- **Web Component for React**

  ```javascript
  import { DocumentEditorWebComponent } from "@mindfiredigital/react-canvas-editor";
  import React from "react";

  const toolbarItem = {
    bold: true,
    italic: true,
    underline: true,
    undo: true,
    redo: true,
    image: false,
  };

  DocumentEditorWebComponent({ toolbar: toolbarItem });

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

  const toolbarItem = {
    bold: true,
    italic: true,
    underline: true,
    undo: true,
    redo: true,
    image: false,
  };

  DocumentEditorWebComponent({ toolbar: toolbarItem });
  ```
