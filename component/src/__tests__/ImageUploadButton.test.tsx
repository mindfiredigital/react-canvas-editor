import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImageUploadButton from '../components/ImageUploadButton/ImageUploadButton';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';

const mockSetImage = DOMEventHandlers.setImage as jest.Mock;

// Mock FileReader used inside handleFileInputChange
const mockReadAsDataURL = jest.fn();
const mockFileReader = {
  readAsDataURL: mockReadAsDataURL,
  onloadend: null as any,
  result: null as any,
};
(global as any).FileReader = jest.fn(() => mockFileReader);

// Mock Image
const mockImageLoad = jest.fn();
(global as any).Image = class {
  onload: (() => void) | null = null;
  set src(_v: string) {
    // Trigger onload synchronously
    this.onload && this.onload();
  }
  height = 100;
  width = 200;
};

describe('ImageUploadButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<ImageUploadButton />)).not.toThrow();
  });

  it('renders an icon button', () => {
    render(<ImageUploadButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders a hidden file input', () => {
    const { container } = render(<ImageUploadButton />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    // MUI Input wraps the <input> in a <div style="display:none">, so the input is not visible
    expect(fileInput).not.toBeVisible();
  });

  it('file input accepts only image files', () => {
    const { container } = render(<ImageUploadButton />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput.accept).toBe('image/*');
  });

  it('clicking the icon button triggers the file input click', () => {
    const { container } = render(<ImageUploadButton />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(fileInput, 'click');
    fireEvent.click(screen.getByRole('button'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('calls DOMEventHandlers.setImage after a file is loaded', async () => {
    const { container } = render(<ImageUploadButton />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    Object.defineProperty(fileInput, 'files', { value: [file], configurable: true });

    await act(async () => {
      fireEvent.change(fileInput);
      // Simulate FileReader.onloadend
      mockFileReader.result = 'data:image/png;base64,abc123';
      mockFileReader.onloadend && mockFileReader.onloadend();
    });

    expect(mockSetImage).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'data:image/png;base64,abc123' })
    );
  });

  it('does not call setImage when no file is selected', () => {
    const { container } = render(<ImageUploadButton />);
    const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', { value: [], configurable: true });
    fireEvent.change(fileInput);
    expect(mockSetImage).not.toHaveBeenCalled();
  });
});
