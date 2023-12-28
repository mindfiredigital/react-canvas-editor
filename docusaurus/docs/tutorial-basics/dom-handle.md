---
sidebar_position: 3
---

# How to use DOM events

Mastering the handling of DOM events is crucial for effective React development. Below are key events and how to use them:

## Retrieving Page Value

**on_change**: This event triggers when the value of an input page changes.

- **React Component**

  ```javascript
  export const App = () => {
    const handleChange = (data) => {
      console.log("test ->", data);
    };

    return <DocumentEditor on_change={handleChange} />;
  };
  ```

- **Web Component for React**

  ```javascript
  const handleChange = (data) => {
    console.log("test ->", data);
  };

  DocumentEditorWebComponent({ on_change: handleChange });

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
  const handleChange = (data) => {
    console.log("test ->", data);
  };

  DocumentEditorWebComponent({ on_change: handleChange });
  ```

  ![Get value from page](../../static/img/onChange.png)

## Capturing Selected Text

**on_select**: This event activates when text on the page is selected.

- **React Component**

  ```javascript
  export const App = () => {
    const handleSelectedText = (text) => {
      console.log(text);
    };

    return <DocumentEditor on_select={handleSelectedText} />;
  };
  ```

- **Web Component for React**

  ```javascript
  const handleSelectedText = (text) => {
    console.log(text);
  };

  DocumentEditorWebComponent({ on_select: handleSelectedText });

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
  const handleSelectedText = (text) => {
    console.log(text);
  };

  DocumentEditorWebComponent({ on_select: handleSelectedText });
  ```

![Get select text from page](../../static/img/onSelect.png)

## Setting Page Value

**value**: To assign a value to an input page, use the value attribute.

- **React Component**

  ```javascript
  export const App = () => {
    return <DocumentEditor value='Hello world' />;
  };
  ```

- **Web Component for React**

  ```javascript
  DocumentEditorWebComponent({ value='Hello world' });

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
  DocumentEditorWebComponent({ value='Hello world' });
  ```

![value](../../static/img/setValue.png)

By following these steps, you can proficiently work with DOM events in React, enhancing your application's functionality.
