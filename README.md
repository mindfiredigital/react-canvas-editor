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

- **Undo**: This feature allows you to reverse the most recent action you performed. It's particularly useful when you make a mistake and want to go back one step.
- **Redo**: Redo is the opposite of undo. It allows you to reapply an action that you've previously undone.
- **Bold**: When you apply bold formatting to text, it makes the selected text appear thicker and more prominent. It's often used to emphasize key points.
- **Italic**: Italic text is slanted to the right. It's commonly used to indicate emphasis or to denote titles of books, movies, or foreign words.
- **Underline**: Underlining text places a horizontal line beneath it. This is another way to emphasize or highlight specific content.
- **Subscript**: Subscript lowers the selected text below the baseline, and it's often used for mathematical and chemical formulas (e.g., H2O).
- **Superscript**: Superscript raises the selected text above the baseline. It's typically used for footnotes, exponents, and ordinal numbers (e.g., 1st).
- **Strikethrough**: Text with a strikethrough line through it is used to indicate that the content should be deleted or is no longer valid.
- **Left Align**: This feature aligns text to the left margin, creating a straight left edge.
- **Center Align**: Center alignment places text in the middle of the page or text box.
- **Right Align**: Text is aligned to the right margin, creating a straight right edge.
- **Justify**: Justification spreads text evenly between both the left and right margins, creating a clean and straight appearance on both sides.
- **Bullet List**: Bullet lists present information as a series of items with bullets or other symbols, making it easier to read and understand.
- **Numbered List**: Numbered lists provide a sequential order to items, often used in procedures or steps.
- **Font Type**: Font type refers to the specific style of text characters. Examples include Arial, Times New Roman, and Calibri.
- **Insert Table**: This feature allows you to create tables to organize data, making it easier to present and structure information.
- **Text Color**: Text color lets you change the color of the text, allowing for better visual contrast or highlighting.
- **Highlight Color**: Highlighting text adds a background color to emphasize or draw attention to specific content.
- **Font Size**: Font size controls the size of the text characters, allowing you to adjust the text's visual prominence.
- **Heading**: Headings are typically used to divide a document into sections or chapters. They are usually styled differently, such as with larger text or bold formatting.
- **Hyperlink**: A hyperlink is a clickable link that connects to a webpage or another location within the document.
- **Image**: This feature allows you to insert images or graphics into your document to enhance its visual appeal or convey additional information.

- **Customizable UI**: Easily customize the document editor's user interface to match your application's branding.

<br>

## Installation

To install the `react-canvas-editor` npm package in your project, use the following command:

```bash
npm install react-canvas-editor
```
<br>

## Getting Started

- **Initialization**: Initialize the canvas document editor in your project, specifying the container element where the editor will be embedded.

```javascript


import { DocumentEditor } from 'react-canvas-editor';
import React from 'react';



export const test = () => {
  
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

return (<DocumentEditor 
toolbar={toolbarItem}
toolbarClass={toolbarClass} 
canvasClass={canvasClass} 
onChange={handleChange} 
onSelect={handleSelectedText}
value="Hello world"
/>)}

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