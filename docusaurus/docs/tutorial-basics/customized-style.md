---
sidebar_position: 2
---

# How to customize style

Tailor the editor's user interface to align with the specific requirements of your application.

## Customize toolbar style
You can adjust the style of the toolbar to meet your design needs. Create a configuration object as follows:

```javascript
const toolbarClass: any = {
  container: {
    backgroundColor: "red"
  },
  primaryToolbar: {
    justifyContent: "center"
  }
}
```
Now, integrate this style configuration into your `DocumentEditor`:

```javascript
return (
    <DocumentEditor 
        toolbarClass={toolbarClass} 
    />)

```

![Customize toolbar style](../../static/img/customize-toolbar-style.png)
## Customize toolbar components style

To fine-tune the style of individual toolbar components, define styles for items like undo, redo, and images. Here's an example configuration:

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
```
Apply these styles to your `DocumentEditor`:

```javascript
return (
    <DocumentEditor 
        toolbarClass={toolbarClass} 
    />)
```
![Customize toolbar components style](../../static/img/customize-toolbar-components-style.png)
## Customize editor page

You can also customize the appearance of the editor page. Define the styles for the editor main and margin areas:
```javascript
const canvasClass = {
  editorMain: {
    background:'antiquewhite'
  },
  margin: {}
}
```
Incorporate these styles into your `DocumentEditor`:
```javascript
return (
    <DocumentEditor 
        canvasClass={canvasClass} 
    />)
```
![Customize editor page](../../static/img/customize-editor-page.png)

By following these steps, you can professionally customize the style of your editor to align with your application's requirements.