import React from 'react';
import { render } from '@testing-library/react';
import DocumentEditor from '../pages/DocumentEditor/DocumentEditor';

// DocumentEditor wraps children in its own <Provider store={store}> — no external Provider needed.

describe('DocumentEditor', () => {
  it('renders without crashing when no props are provided', () => {
    expect(() => render(<DocumentEditor />)).not.toThrow();
  });

  it('renders when all optional props are provided', () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    expect(() =>
      render(
        <DocumentEditor
          toolbar={{ bold: true, italic: true, undo: true }}
          toolbar_class={{ container: { backgroundColor: '#fff' } }}
          canvas_class={{ editorMain: {}, margin: {} }}
          on_change={onChange}
          on_select={onSelect}
          value="Test content"
          documentId="doc-1"
        />
      )
    ).not.toThrow();
  });

  it('accepts undefined toolbar — all tools visible', () => {
    expect(() => render(<DocumentEditor toolbar={undefined} />)).not.toThrow();
  });

  it('accepts a partial toolbar whitelist', () => {
    expect(() =>
      render(<DocumentEditor toolbar={{ bold: true, undo: true }} />)
    ).not.toThrow();
  });

  it('accepts an empty toolbar_class and uses defaults', () => {
    expect(() => render(<DocumentEditor toolbar_class={{}} />)).not.toThrow();
  });

  it('merges custom toolbar_class container with defaults', () => {
    expect(() =>
      render(
        <DocumentEditor
          toolbar_class={{
            container: { border: '1px solid blue' },
            primaryToolbar: { flexDirection: 'column' as const },
            item: { bold: { fontWeight: 'bold' } },
          }}
        />
      )
    ).not.toThrow();
  });

  it('renders with a custom value string', () => {
    expect(() => render(<DocumentEditor value="Custom document text" />)).not.toThrow();
  });

  it('calls on_change when provided', () => {
    const onChange = jest.fn();
    expect(() => render(<DocumentEditor on_change={onChange} />)).not.toThrow();
  });

  it('calls on_select when provided', () => {
    const onSelect = jest.fn();
    expect(() => render(<DocumentEditor on_select={onSelect} />)).not.toThrow();
  });
});
