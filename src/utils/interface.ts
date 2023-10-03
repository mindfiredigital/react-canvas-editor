export interface FontSizeDropdownProps {
  onChange: (fontSize: number) => void;
  onClose: () => void;
}

export interface IColor {
  _id: string;
  documentId: string;
  feature: string;
  colors: string[];
}

export interface IColorPalette {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  definedColor: string | null | undefined;
  feature: string;
}

export interface IColorPicker {
  colorPickerHandleClose: () => void;
  colorPickerAnchor: null | HTMLElement;
  color: string | null | undefined;
  feature: string;
}
