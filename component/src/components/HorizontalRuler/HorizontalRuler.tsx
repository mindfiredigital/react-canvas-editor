import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';
import type { RootState } from '../../redux/store';
import type { DocumentState } from '../../redux/documentReducer';
import { setDocumentMargins } from '../../redux/documentReducer';

const PAGE_W = 816;
const DEFAULT_MARGINS = [100, 100, 120, 120]; // [top, bottom, left, right]
const RULER_H = 24; // total ruler height in px

// Tick marks: minor every 24 px (quarter‑inch at 96 dpi), major every 96 px (1 inch)
function buildTicks() {
  const ticks: Array<{ x: number; major: boolean; label: string }> = [];
  for (let x = 0; x <= PAGE_W; x += 24) {
    const inch = x / 96;
    ticks.push({ x, major: x % 96 === 0, label: inch > 0 ? String(inch) : '' });
  }
  return ticks;
}
const TICKS = buildTicks();

export function HorizontalRuler() {
  const dispatch = useDispatch();
  const doc = useSelector((s: RootState) => s.document) as unknown as DocumentState;
  const margins = doc.margins?.length === 4 ? doc.margins : DEFAULT_MARGINS;
  const marginsRef = useRef(margins);
  marginsRef.current = margins;

  // Seed the Redux store with defaults so the ruler renders correctly on first load.
  // Do NOT call DOMEventHandlers.setPaperMargins here — the editor is not yet
  // registered at this point. The canvas uses its own built-in defaults.
  useEffect(() => {
    if (!doc.margins?.length) {
      dispatch(setDocumentMargins({ margins: DEFAULT_MARGINS }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftMargin = margins[2];
  const rightMargin = margins[3];
  const contentStart = leftMargin;
  const contentEnd = PAGE_W - rightMargin;

  function startDrag(handle: 'left' | 'right', startClientX: number) {
    const startMargin = handle === 'left'
      ? marginsRef.current[2]
      : marginsRef.current[3];

    function onMove(e: MouseEvent) {
      const dx = e.clientX - startClientX;
      const raw = startMargin + (handle === 'left' ? dx : -dx);
      const clamped = Math.round(Math.max(20, Math.min(380, raw)));
      const next = [...marginsRef.current];
      if (handle === 'left') next[2] = clamped;
      else next[3] = clamped;
      DOMEventHandlers.setPaperMargins(next);
      dispatch(setDocumentMargins({ margins: next }));
    }

    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  return (
    <div
      className="ce-horizontal-ruler"
      style={{
        width: '100%',
        height: RULER_H,
        backgroundColor: '#f1f3f4',
        borderBottom: '1px solid #dadce0',
        userSelect: 'none',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Inner 816 px strip — aligns with the page via the same margin: auto centering */}
      <div
        style={{
          width: PAGE_W,
          height: '100%',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Left margin zone */}
        <div style={{
          position: 'absolute', left: 0, top: 0,
          width: contentStart, height: '100%',
          backgroundColor: '#dde1e7',
        }} />
        {/* Content zone (white) */}
        <div style={{
          position: 'absolute', left: contentStart, top: 0,
          width: Math.max(0, contentEnd - contentStart), height: '100%',
          backgroundColor: '#ffffff',
        }} />
        {/* Right margin zone */}
        <div style={{
          position: 'absolute', left: contentEnd, top: 0,
          width: PAGE_W - contentEnd, height: '100%',
          backgroundColor: '#dde1e7',
        }} />

        {/* Tick marks via SVG */}
        <svg
          style={{
            position: 'absolute', inset: 0,
            width: PAGE_W, height: RULER_H,
            pointerEvents: 'none', overflow: 'visible',
          }}
        >
          {TICKS.map(({ x, major, label }) => (
            <g key={x}>
              <line
                x1={x} y1={major ? RULER_H - 14 : RULER_H - 7}
                x2={x} y2={RULER_H}
                stroke="#9aa0a6" strokeWidth="0.75"
              />
              {major && label && (
                <text
                  x={x + 2} y={RULER_H - 15}
                  fontSize="8" fill="#5f6368"
                  fontFamily="Arial, sans-serif"
                  dominantBaseline="auto"
                >
                  {label}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Left margin handle — downward triangle sitting on top boundary */}
        <div
          onMouseDown={(e) => { e.preventDefault(); startDrag('left', e.clientX); }}
          title="Left margin"
          style={{
            position: 'absolute',
            left: contentStart - 6,
            top: 0,
            width: 12,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '9px solid #1a73e8',
          }} />
        </div>

        {/* Right margin handle */}
        <div
          onMouseDown={(e) => { e.preventDefault(); startDrag('right', e.clientX); }}
          title="Right margin"
          style={{
            position: 'absolute',
            left: contentEnd - 6,
            top: 0,
            width: 12,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: 0, height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '9px solid #1a73e8',
          }} />
        </div>
      </div>
    </div>
  );
}
