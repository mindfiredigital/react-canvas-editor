import documentReducer, {
  DocumentState,
  setDocumentTitle,
  reloadRecentDoc,
  setDocumentId,
  setDocumentMargins,
} from '../redux/documentReducer';

const initialState: DocumentState = {
  documentId: '',
  title: '',
  reloadRecentDoc: false,
  margins: [],
};

describe('documentReducer', () => {
  describe('initial state', () => {
    it('returns the correct initial state for an unknown action', () => {
      const state = documentReducer(undefined, { type: '@@INIT' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setDocumentTitle', () => {
    it('updates the title', () => {
      const state = documentReducer(
        undefined,
        setDocumentTitle({ title: 'My Document' })
      );
      expect(state.title).toBe('My Document');
    });

    it('does not affect other state fields', () => {
      const prev = {
        ...initialState,
        documentId: 'abc',
        margins: [100, 100, 120, 120],
      };
      const state = documentReducer(
        prev,
        setDocumentTitle({ title: 'New Title' })
      );
      expect(state.documentId).toBe('abc');
      expect(state.margins).toEqual([100, 100, 120, 120]);
    });

    it('does not mutate the previous state', () => {
      const prev = { ...initialState, title: 'old' };
      const next = documentReducer(prev, setDocumentTitle({ title: 'new' }));
      expect(next).not.toBe(prev);
      expect(prev.title).toBe('old');
    });

    it('overwrites an existing title', () => {
      const prev = { ...initialState, title: 'first title' };
      const state = documentReducer(
        prev,
        setDocumentTitle({ title: 'second title' })
      );
      expect(state.title).toBe('second title');
    });
  });

  describe('reloadRecentDoc', () => {
    it('sets reloadRecentDoc to true', () => {
      const state = documentReducer(
        undefined,
        reloadRecentDoc({ reloadRecentDoc: true })
      );
      expect(state.reloadRecentDoc).toBe(true);
    });

    it('sets reloadRecentDoc to false', () => {
      const state = documentReducer(
        { ...initialState, reloadRecentDoc: true },
        reloadRecentDoc({ reloadRecentDoc: false })
      );
      expect(state.reloadRecentDoc).toBe(false);
    });
  });

  describe('setDocumentMargins', () => {
    it('updates margins array', () => {
      const margins = [100, 100, 120, 120];
      const state = documentReducer(undefined, setDocumentMargins({ margins }));
      expect(state.margins).toEqual(margins);
    });

    it('replaces previously set margins', () => {
      const state = documentReducer(
        { ...initialState, margins: [50, 50, 60, 60] },
        setDocumentMargins({ margins: [100, 100, 120, 120] })
      );
      expect(state.margins).toEqual([100, 100, 120, 120]);
    });

    it('accepts an empty margins array', () => {
      const state = documentReducer(
        { ...initialState, margins: [100, 100, 120, 120] },
        setDocumentMargins({ margins: [] })
      );
      expect(state.margins).toEqual([]);
    });
  });

  describe('setDocumentId', () => {
    it('updates documentId', () => {
      const state = documentReducer(
        undefined,
        setDocumentId({ documentId: 'doc-123' })
      );
      expect(state.documentId).toBe('doc-123');
    });

    it('overwrites an existing documentId', () => {
      const state = documentReducer(
        { ...initialState, documentId: 'old-id' },
        setDocumentId({ documentId: 'new-id' })
      );
      expect(state.documentId).toBe('new-id');
    });

    it('does not affect other fields', () => {
      const state = documentReducer(
        { ...initialState, title: 'My Doc', margins: [10, 20, 30, 40] },
        setDocumentId({ documentId: 'x' })
      );
      expect(state.title).toBe('My Doc');
      expect(state.margins).toEqual([10, 20, 30, 40]);
    });
  });
});
