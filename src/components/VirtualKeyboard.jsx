import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const KEYBOARD_LAYOUT = [
  [
    { id: '`', label: '`' }, { id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' }, { id: '4', label: '4' }, { id: '5', label: '5' }, { id: '6', label: '6' }, { id: '7', label: '7' }, { id: '8', label: '8' }, { id: '9', label: '9' }, { id: '0', label: '0' }, { id: '-', label: '-' }, { id: '=', label: '=' }, { id: 'backspace', label: 'BACK', className: 'key-backspace special' }
  ],
  [
    { id: 'tab', label: 'TAB', className: 'key-tab special' }, { id: 'q', label: 'Q' }, { id: 'w', label: 'W' }, { id: 'e', label: 'E' }, { id: 'r', label: 'R' }, { id: 't', label: 'T' }, { id: 'y', label: 'Y' }, { id: 'u', label: 'U' }, { id: 'i', label: 'I' }, { id: 'o', label: 'O' }, { id: 'p', label: 'P' }, { id: '[', label: '[' }, { id: ']', label: ']' }, { id: '\\', label: '\\' }
  ],
  [
    { id: 'capslock', label: 'CAPS', className: 'key-capslock special' }, { id: 'a', label: 'A' }, { id: 's', label: 'S' }, { id: 'd', label: 'D' }, { id: 'f', label: 'F' }, { id: 'g', label: 'G' }, { id: 'h', label: 'H' }, { id: 'j', label: 'J' }, { id: 'k', label: 'K' }, { id: 'l', label: 'L' }, { id: ';', label: ';' }, { id: "'", label: "'" }, { id: 'enter', label: 'ENTER', className: 'key-enter special' }
  ],
  [
    { id: 'shift', label: 'SHIFT', className: 'key-shift special' }, { id: 'z', label: 'Z' }, { id: 'x', label: 'X' }, { id: 'c', label: 'C' }, { id: 'v', label: 'V' }, { id: 'b', label: 'B' }, { id: 'n', label: 'N' }, { id: 'm', label: 'M' }, { id: ',', label: ',' }, { id: '.', label: '.' }, { id: '/', label: '/' }, { id: 'shift-right', label: 'SHIFT', className: 'key-shift special' }
  ],
  [
    { id: 'control', label: 'CTRL', className: 'key-ctrl special' }, { id: 'meta', label: 'WIN', className: 'key-win special' }, { id: 'alt', label: 'ALT', className: 'key-alt special' }, { id: ' ', label: '', className: 'key-space' }, { id: 'alt-right', label: 'ALT', className: 'key-alt special' }, { id: 'fn', label: 'FN', className: 'key-win special' }, { id: 'control-right', label: 'CTRL', className: 'key-ctrl special' }
  ]
];

const FINGER_MAP = {
  '`': 'l-pinky', '1': 'l-pinky', 'q': 'l-pinky', 'a': 'l-pinky', 'z': 'l-pinky', 'tab': 'l-pinky', 'capslock': 'l-pinky', 'shift': 'l-pinky', 'control': 'l-pinky',
  '2': 'l-ring', 'w': 'l-ring', 's': 'l-ring', 'x': 'l-ring',
  '3': 'l-middle', 'e': 'l-middle', 'd': 'l-middle', 'c': 'l-middle',
  '4': 'l-index', 'r': 'l-index', 'f': 'l-index', 'v': 'l-index', '5': 'l-index', 't': 'l-index', 'g': 'l-index', 'b': 'l-index',
  ' ': 'thumb',
  '6': 'r-index', 'y': 'r-index', 'h': 'r-index', 'n': 'r-index', '7': 'r-index', 'u': 'r-index', 'j': 'r-index', 'm': 'r-index',
  '8': 'r-middle', 'i': 'r-middle', 'k': 'r-middle', ',': 'r-middle',
  '9': 'r-ring', 'o': 'r-ring', 'l': 'r-ring', '.': 'r-ring',
  '0': 'r-pinky', 'p': 'r-pinky', ';': 'r-pinky', '/': 'r-pinky', '-': 'r-pinky', '[': 'r-pinky', "'": 'r-pinky', '=': 'r-pinky', ']': 'r-pinky', '\\': 'r-pinky', 'backspace': 'r-pinky', 'enter': 'r-pinky', 'shift-right': 'r-pinky', 'alt': 'thumb', 'meta': 'thumb', 'alt-right': 'thumb', 'fn': 'thumb', 'control-right': 'r-pinky'
};

export default function VirtualKeyboard({ selectedLetters, activeKey }) {
  const container = useRef();

  useEffect(() => {
    if (activeKey) {
      let selectorId = activeKey.toLowerCase();
      if (selectorId === ' ') selectorId = ' ';
      
      const el = container.current.querySelector(`[data-key="${selectorId}"]`);
      if (el) {
        gsap.to(el, {
          scale: 0.9,
          duration: 0.05,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      }
    }
  }, [activeKey]);

  return (
    <div className="keyboard" ref={container}>
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((keyDef) => {
            const keyId = keyDef.id;
            const isSelected = selectedLetters.has(keyId) && keyId.length === 1 && keyId !== ' ';
            const isActive = activeKey && activeKey.toLowerCase() === keyId;
            const fingerZone = FINGER_MAP[keyId] || '';
            
            let classes = 'key';
            if (keyDef.className) classes += ` ${keyDef.className}`;
            if (isActive) classes += ' active';
            if (fingerZone) classes += ` finger-${fingerZone}`;
            
            return (
              <div key={`${rowIndex}-${keyId}`} className={classes} data-key={keyId}>
                {keyDef.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
