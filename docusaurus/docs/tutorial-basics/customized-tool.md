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
  image: false
}
```
- To add a tool, set its value to true.
- To remove a tool, set its value to false.

Here's an example of how to implement this in your code:

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
  image: false
}

return (
    <DocumentEditor 
        toolbar={toolbarItem}
    />)
    }
```