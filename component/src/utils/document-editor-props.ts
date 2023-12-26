export const toolbarItem: any = {
  bold: true,
  italic: true,
  underline: true,
  undo: true,
  redo: true,
  image: true,
};

export const toolbarClass: any = {
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

export const canvasClass = {
  editorMain: {
    // background:'antiquewhite'
  },
  margin: {},
};

export function handleChange(data) {
  console.log(`test -> ${data}`);
}

export function handleSelectedText(text) {
  console.log(`select->, ${text}`);
}

export const defaultText = "Hello world";
