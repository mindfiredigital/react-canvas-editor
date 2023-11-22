import { DocumentEditor } from "../component";
import React from "react";

export default {
  component: DocumentEditor,
  title: "DocumentEditor",
};

// export const Default = {
//   args: {},
// };
const toolbarItem: any = {
  bold: true,
  italic: true,
  underline: true,
  undo: true,
  redo: true,
  image: true,
};

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

const handleChange = (data) => {
  console.log("test ->", data);
};

const handleSelectedText = (text) => {
  console.log(text);
};

export const test = () => (
  <DocumentEditor
    // toolbar={toolbarItem}
    toolbarClass={toolbarClass}
    canvasClass={canvasClass}
    onChange={handleChange}
    onSelect={handleSelectedText}
    value='Hello world'
  />
);
