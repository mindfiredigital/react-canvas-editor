
import {DocumentEditor} from '../component';
import React from 'react';

export default {
  component: DocumentEditor,
  title: 'DocumentEditor',
};

// export const Default = {
//   args: {},
// };
const t: any = {
  bold: false,
  italic: true,
  underline: true
}
export const test = () => <DocumentEditor toolbar={t} />