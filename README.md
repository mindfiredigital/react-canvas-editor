<h1 align="center">React Document Editor </h1><br><br>
<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/react-canvas-editor"><img src="https://img.shields.io/npm/v/@mindfiredigital/react-canvas-editor.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/react-canvas-editor"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p>

<br>

<p align="center"> Experience powerful document creation with our React-based editor. Craft and manage multi-page documents effortlessly </p>

The `@mindfiredigital/react-canvas-editor` is a tool that allows developers to integrate multi page document editors built on top of Canvas using React.

<br>

## Table of Contents

- [Features](#features)
- [Canvas vs HTML Editor](#canvas-vs-html-editor)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

<br>

## Features

- **Undo**: This feature allows you to reverse the most recent action you performed. It's particularly useful when you make a mistake and want to go back one step.
- **Redo**: Redo is the opposite of undo. It allows you to reapply an action that you've previously undone.
- **Bold**: When you apply bold formatting to text, it makes the selected text appear thicker and more prominent.
- **Italic**: Italic text is slanted to the right.
- **Underline**: Underlining text places a horizontal line beneath it.
- **Subscript**: Subscript lowers the selected text below the baseline.
- **Superscript**: Superscript raises the selected text above the baseline.
- **Strikethrough**: Text with a strikethrough line through it is used to indicate that the content should be deleted or is no longer valid.
- **Left Align**: This feature aligns text to the left margin, creating a straight left edge.
- **Center Align**: Center alignment places text in the middle of the page or text box.
- **Right Align**: Text is aligned to the right margin, creating a straight right edge.
- **Justify**: Justification spreads text evenly between both the left and right margins, creating a clean and straight appearance on both sides.
- **Bullet List**: Bullet lists present information as a series of items with bullets.
- **Numbered List**: Numbered lists provide a sequential order to items.
- **Font Type**: Font type refers to the specific style of text characters. Examples include Arial, Times New Roman, and Calibri.
- **Insert Table**: This feature allows you to create tables to organize data.
- **Text Color**: Text color lets you change the color of the text.
- **Highlight Color**: Highlighting text adds a background color.
- **Font Size**: Font size controls the size of the text characters.
- **Heading**: Headings are typically used to divide a document into sections or chapters. They are usually styled differently, such as with larger text or bold formatting.
- **Hyperlink**: A hyperlink is a clickable link that connects to a webpage or another location within the document.
- **Image**: This feature allows you to insert images or graphics into your document to enhance its visual appeal or convey additional information.
- **Customizable UI**: Easily customize the document editor's user interface to match your application's branding.

<br>

# Canvas vs HTML Editor

Canvas is better suited for projects that require high levels of customization, interactivity, and performance, especially when developed by individuals with programming skills.

- Dynamic Content and Interactivity

  - Canvas is particularly powerful for creating dynamic and interactive content, such as animations, games, and data visualizations. It provides a drawing API that allows you to manipulate pixels directly, offering fine-grained control over the visual elements.
  - HTML editors are generally designed for static content creation, and while they may offer some interactivity features, they might not provide the same level of control as Canvas when it comes to dynamic and custom interactions.

- Customization and Flexibility

  - Canvas allows developers to create highly customized and unique visual elements. It provides a blank canvas where you have complete control over the rendering process. This makes it suitable for projects that require a high degree of customization.
  - HTML editors often come with predefined templates and styles, which can limit the level of customization. While they are great for quick and easy content creation, they may not be as flexible for highly tailored or specialized designs.

- Performance

  - Canvas can be more performant for certain graphics-intensive tasks, especially when dealing with a large number of elements or complex animations. This is because it allows for direct manipulation of pixels and can leverage hardware acceleration.
  - HTML editors might introduce some overhead, as they often generate complex HTML and CSS structures to represent the content, which can impact performance, especially in resource-intensive applications.

- Programmatic Control

  - Canvas is manipulated through JavaScript, giving developers programmatic control over every aspect of the canvas. This enables the creation of complex graphics and animations using code.
  - HTML editors are typically designed for users who prefer a visual interface over coding. While they might provide some level of scripting or automation, they may not offer the same level of programmatic control as Canvas.

- Learning and Development
  - Canvas is a good choice for developers who are comfortable with programming and want to create graphics and visualizations using code. It requires a solid understanding of JavaScript and the Canvas API.
  - HTML editors are generally more user-friendly for non-programmers and can be a quicker way to create visually appealing content without the need for coding skills.

<br>

## Installation

To install the `@mindfiredigital/react-canvas-editor` npm package in your project, use the following command:

```bash
npm install @mindfiredigital/react-canvas-editor
```

<br>

## Getting Started

- **Initialization**: Initialize the canvas document editor in your project, specifying the container element where the editor will be embedded.

```javascript
import { DocumentEditor } from "@mindfiredigital/react-canvas-editor";
import React from "react";

export const test = () => {
  const toolbarItem: any = {
    bold: true,
    italic: true,
    underline: true,
    undo: true,
    redo: true,
    image: true,
  };

  const handleChange = (data) => {
    console.log("test ->", data);
  };

  const handleSelectedText = (text) => {
    console.log(text);
  };

  return (
    <DocumentEditor
      toolbar={toolbarItem}
      canvasClass={canvasClass}
      onChange={handleChange}
      onSelect={handleSelectedText}
      value='Hello world'
    />
  );
};
```

<br>

- **Customization**: Customize the editor's UI and behavior to match your application's requirements.

```javascript
import { DocumentEditor } from "@mindfiredigital/react-canvas-editor";
import React from "react";

export const test = () => {
  const toolbarClass: any = {
    container: {
      // backgroundColor: "red"
    },
    primaryToolbar: {
      justifyContent: "center",
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
      },
      fontType: {
        // background:'green'
      },
      table: {
        // background:'green'
      },
      fontColor: {
        // background:'green'
      },
      highlight: {
        // background:'green'
      },
      fontSize: {
        // background:'green'
      },
      heading: {
        // background:'green'
      },
      selectedToolbarItemColor: {
        // color: "#1a73e8",
      },
    },
  };

  const canvasClass = {
    editorMain: {
      // background:'antiquewhite'
    },
    margin: {},
  };

  return <DocumentEditor canvasClass={canvasClass} />;
};
```

<br>

- **DOM handlers**:
  - **onChange**: The onchange event occurs when the value is changed.
  - **onSelect**: The onSelect event occurs when the value is selected.
  - **value**: The value attribute on an tag sets the value of the page.

<br>

## Contributing

We welcome contributions from the community. If you'd like to contribute to the `react-document-editor` npm package, please follow our [Contributing Guidelines](CONTRIBUTING.md).
<br>

## License

Copyright (c) Mindfire Digital llp. All rights reserved.

Licensed under the MIT license.
