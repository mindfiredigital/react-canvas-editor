import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DOMEventHandlers } from '@mindfiredigital/canvas-editor';
import type { RootState } from '../../redux/store';
import type { DocumentState } from '../../redux/documentReducer';
import { setDocumentMargins } from '../../redux/documentReducer';

const PAGE_H = 1056;
const DEFAULT_MARGINS = [100, 100, 120, 120]; // [top, bottom, left, right]
const RULER_W = 20; // ruler width in px

function buildTicks() {
  const ticks: Array<{ y: number; major: boolean; label: string }> = [];
  for (let y = 0; y <= PAGE_H; y += 24) {
    const inch = y / 96;
    ticks.push({ y, major: y % 96 === 0, label: inch > 0 ? String(inch) : '' });
  }
  return ticks;
}
const TICKS = buildTicks();

export function VerticalRuler() {
  const dispatch = useDispatch();
  const doc = useSelector((s: RootState) => s.document) as unknown as DocumentState;
  const margins = doc.margins?.length === 4 ? doc.margins : DEFAULT_MARGINS;
  const marginsRef = useRef(margins);
  marginsRef.current = margins;

  const topMargin = margins[0];
  const bottomMargin = margins[1];
  const contentStart = topMargin;
  const contentEnd = PAGE_H - bottomMargin;

  function startDrag(handle: 'top' | 'bottom', startClientY: number) {
    const startMargins = [...marginsRef.current];
    const startMargin = handle === 'top' ? startMargins[0] : startMargins[1];

    function onMove(e: MouseEvent) {
      const dy = e.clientY - startClientY;
      const raw = startMargin + (handle === 'top' ? dy : -dy);
      const clamped = Math.round(Math.max(20, Math.min(450, raw)));
      const next = [...startMargins];
      if (handle === 'top') next[0] = clamped;
      else next[1] = clamped;
      try {
        DOMEventHandlers.setPaperMargins(next);
      } catch {
        /* editor not yet registered */
      }
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
    // This div is absolute‑positioned inside .canvas-editor-main (see CanvasEditor.tsx)
    <div
      className="ce-vertical-ruler"
      style={{
        position: 'absolute',
        left: 4,
        top: 10, // match .canvas-editor padding-top
        width: RULER_W,
        height: PAGE_H,
        userSelect: 'none',
        zIndex: 1,
      }}
    >
      {/* Top margin zone */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: contentStart,
        backgroundColor: '#dde1e7',
      }} />
      {/* Content zone */}
      <div style={{
        position: 'absolute', top: contentStart, left: 0,
        width: '100%', height: Math.max(0, contentEnd - contentStart),
        backgroundColor: '#ffffff',
      }} />
      {/* Bottom margin zone */}
      <div style={{
        position: 'absolute', top: contentEnd, left: 0,
        width: '100%', height: PAGE_H - contentEnd,
        backgroundColor: '#dde1e7',
      }} />

      {/* Tick marks */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          width: RULER_W, height: PAGE_H,
          pointerEvents: 'none', overflow: 'visible',
        }}
      >
        {TICKS.map(({ y, major, label }) => (
          <g key={y}>
            <line
              x1={major ? 6 : 12} y1={y}
              x2={RULER_W} y2={y}
              stroke="#9aa0a6" strokeWidth="0.75"
            />
            {major && label && (
              <text
                x={RULER_W / 2} y={y - 2}
                fontSize="8" fill="#5f6368"
                fontFamily="Arial, sans-serif"
                textAnchor="middle"
                transform={`rotate(-90, ${RULER_W / 2}, ${y - 2})`}
              >
                {label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Top margin handle — right‑pointing triangle */}
      <div
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startDrag('top', e.clientY); }}
        title="Top margin"
        style={{
          position: 'absolute',
          top: contentStart - 6,
          left: 0,
          width: '100%',
          height: 12,
          cursor: 'row-resize',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{
          width: 0, height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: '9px solid #1a73e8',
        }} />
      </div>

      {/* Bottom margin handle */}
      <div
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); startDrag('bottom', e.clientY); }}
        title="Bottom margin"
        style={{
          position: 'absolute',
          top: contentEnd - 6,
          left: 0,
          width: '100%',
          height: 12,
          cursor: 'row-resize',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{
          width: 0, height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: '9px solid #1a73e8',
        }} />
      </div>
    </div>
  );
}
