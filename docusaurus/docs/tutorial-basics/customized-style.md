---
sidebar_position: 2
---

# How to customize style

Customize the editor's UI style to match your application's requirements.

## Customize toolbar style
```javascript
const toolbarClass: any = {
  container: {
    backgroundColor: "red"
  },
  primaryToolbar: {
    justifyContent: "center"
  }
}

return (
    <DocumentEditor 
        toolbarClass={toolbarClass} 
    />)

```

![Customize toolbar style](../../static/img/customize-toolbar-style.png)
## Customize toolbar components style

```javascript
const toolbarClass: any = {
  item: {
    undo: {
      border: 'red solid 2px',
      background:'yellow'
    },
    redo: {
      border: 'black solid 3px',
      background:'blue'
    },
    image: {
      border: 'black solid 3px',
      background:'blue'
    }
    
  }
}

return (
    <DocumentEditor 
        toolbarClass={toolbarClass} 
    />)
```
![Customize toolbar components style](../../static/img/customize-toolbar-components-style.png)
## Customize editor page
```javascript
const canvasClass = {
  editorMain: {
    background:'antiquewhite'
  },
  margin: {}
}

return (
    <DocumentEditor 
        canvasClass={canvasClass} 
    />)
```
![Customize editor page](../../static/img/customize-editor-page.png)