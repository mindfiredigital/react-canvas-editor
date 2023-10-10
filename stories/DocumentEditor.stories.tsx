
import { DocumentEditor } from '../component';
import React from 'react';

export default {
  component: DocumentEditor,
  title: 'DocumentEditor',
};

// export const Default = {
//   args: {},
// };
const toolbarItem: any = {
  bold: false,
  italic: true,
  underline: true
}

const toolbarClass: any = {
  container: {
    // backgroundColor: "red"
  },
  primaryToolbar: {
    justifyContent: "center"
  },
  item: {
    bold: {
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

const handleChange = (data) => {
  console.log('test ->',data);

}

const handleSelectedText = (text) => {
  console.log(text);

}

export const test = () => <DocumentEditor 
toolbarClass={toolbarClass} 
canvasClass={canvasClass} 
onChange={handleChange} 
onSelect={handleSelectedText}
data="Hello world"
/>