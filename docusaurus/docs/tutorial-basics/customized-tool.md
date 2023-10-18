---
sidebar_position: 1
---

# How to customize toolbar

Tailor the editor's user interface and actions to the needs of your application.

## Customize toolbar
The toolbar allows you to add and remove tools.

### Default items in toolbar
- bold
- italic
- underline

### Add/ Remove tool

**Create any object as given below**

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
- To add the tool set the tool true
- To remove the tool set the tool false

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

return (
    <DocumentEditor 
        toolbar={toolbarItem}
    />)
    }