<h1 align="center">Canvas document editor package</h1>

<!-- <p align="center"> -->
<!-- <a href="https://www.npmjs.com/package/\react-canvas-editor"><img src="https://img.shields.io/npm/v/react-canvas-editor.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/react-canvas-editor"><img src="https://img.shields.io/npm/l/@mindfiredigital/react-canvas-editor.svg?sanitize=true" alt="License"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/react-canvas-editor"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p> -->

<br>

The `Canvas-document-editor` npm package is a tool that allows developers to integrate multipage document editors built on top of Canvas using React.

<br>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

<br>

## Features

- **Bold**: Allows users to apply bold formatting to selected text.
- _Italic_: Enables users to apply italic formatting to selected text.
- **Underline**: Allows users to underline selected text.
- **Redo**: Allows users to redo the previous action.
- **Undo**: Enables users to undo the previous action.
- **Image**: Allows users to insert images into the document.

- **Customizable UI**: Easily customize the document editor's user interface to match your application's branding.

<br>

## Installation

To install the `document-editor` npm package in your project, use the following command:

```bash
npm install react-canvas-editor
```
<br>

## Getting Started

- **Initialization**: Initialize the canvas document editor in your project, specifying the container element where the editor will be embedded.

```javascript


import { DocumentEditor } from 'react-canvas-editor';
import React from 'react';

export default {
  component: DocumentEditor,
  title: 'DocumentEditor',
};

const toolbarItem: any = {
  bold: true,
  italic: true,
  underline: true,
  undo: true,
  redo: true,
  image: true
}

const handleChange = (data) => {
  console.log('test ->',data);

}

const handleSelectedText = (text) => {
  console.log(text);

}

export const test = () => <DocumentEditor 
toolbar={toolbarItem}
toolbarClass={toolbarClass} 
canvasClass={canvasClass} 
onChange={handleChange} 
onSelect={handleSelectedText}
value="Hello world"
/>

```
<br>

- **Customization**: Customize the editor's UI and behavior to match your application's requirements.
```javascript
const toolbarClass: any = {
  container: {
    // backgroundColor: "red"
  },
  primaryToolbar: {
    justifyContent: "center"
  },
  item: {
    undo: {
      // border: 'red solid 2px',
      // background:'yellow'
    },
    redo: {
      // border: 'black solid 3px',
      // background:'blue'
    },
    bold: {
      // border: 'black solid 3px',
      // background:'blue'
    },
    italic: {
      // border: 'black solid 3px',
      // background:'blue'
    },
    underline: {
      // border: 'black solid 3px',
      // background:'blue'
    },
    image: {
      // border: 'black solid 3px',
      // background:'blue'
    }
    
  }
}

const canvasClass = {
  editorMain: {
    // background:'antiquewhite'
  },
  margin: {}
}
```
<br>

- **DOM handlers**: 
  - **onChange**: The onchange event occurs when the value of an page is changed.
  - **onSelect**: The onchange event occurs when the value of an page is selected.
  - **value**: The value attribute on an tag sets the value of the page.

<br>


## Contributing

We welcome contributions from the community. If you'd like to contribute to the `document-editor` npm package, please follow our [Contributing Guidelines](CONTRIBUTING.md).
<br>

## License

This package is open-source and available under the [MIT License](LICENSE).