import React, { useRef } from 'react';
import gsap from 'gsap';

const COMPACT_LAYOUT = [
  [
    { id: '1', label: '1' }, { id: '2', label: '2' }, { id: '3', label: '3' }, { id: '4', label: '4' }, { id: '5', label: '5' }, { id: '6', label: '6' }, { id: '7', label: '7' }, { id: '8', label: '8' }, { id: '9', label: '9' }, { id: '0', label: '0' }, { id: '-', label: '-' }, { id: '=', label: '=' }
  ],
  [
    { id: 'q', label: 'Q' }, { id: 'w', label: 'W' }, { id: 'e', label: 'E' }, { id: 'r', label: 'R' }, { id: 't', label: 'T' }, { id: 'y', label: 'Y' }, { id: 'u', label: 'U' }, { id: 'i', label: 'I' }, { id: 'o', label: 'O' }, { id: 'p', label: 'P' }, { id: '[', label: '[' }, { id: ']', label: ']' }
  ],
  [
    { id: 'a', label: 'A' }, { id: 's', label: 'S' }, { id: 'd', label: 'D' }, { id: 'f', label: 'F' }, { id: 'g', label: 'G' }, { id: 'h', label: 'H' }, { id: 'j', label: 'J' }, { id: 'k', label: 'K' }, { id: 'l', label: 'L' }, { id: ';', label: ';' }, { id: "'", label: "'" }
  ],
  [
    { id: 'z', label: 'Z' }, { id: 'x', label: 'X' }, { id: 'c', label: 'C' }, { id: 'v', label: 'V' }, { id: 'b', label: 'B' }, { id: 'n', label: 'N' }, { id: 'm', label: 'M' }, { id: ',', label: ',' }, { id: '.', label: '.' }, { id: '/', label: '/' }
  ]
];

const PRESETS = {
  'Home Row': ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  'Top Row': ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  'Bottom Row': ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  'Vowels': ['a', 'e', 'i', 'o', 'u'],
  'Numbers': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
};

import { Trash2 } from 'lucide-react';

const ALL_KEYS = COMPACT_LAYOUT.flat().map(k => k.id);

export default function LetterSelector({ selectedLetters, setSelectedLetters }) {
  const container = useRef();

  const toggleLetter = (letterId, e) => {
    // Quick click animation for compact keys
    gsap.fromTo(e.currentTarget, 
      { y: 3, boxShadow: "0 0 0 transparent, 0 1px 2px rgba(0,0,0,0.1)" }, 
      { y: 0, boxShadow: "0 3px 0 var(--border-shadow-active), 0 4px 6px rgba(0,0,0,0.1)", duration: 0.1 }
    );

    const newSelection = new Set(selectedLetters);
    if (newSelection.has(letterId)) {
      newSelection.delete(letterId);
    } else {
      newSelection.add(letterId);
    }
    setSelectedLetters(newSelection);
  };

  const applyPreset = (presetLetters) => {
    setSelectedLetters(new Set(presetLetters));
  };

  const clearSelection = () => {
    setSelectedLetters(new Set());
  };

  const toggleAll = () => {
    if (selectedLetters.size === ALL_KEYS.length) {
      setSelectedLetters(new Set());
    } else {
      setSelectedLetters(new Set(ALL_KEYS));
    }
  };

  return (
    <div>
      <div className="selector-keyboard compact" ref={container}>
        {COMPACT_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyDef) => {
              const keyId = keyDef.id;
              const isSelected = selectedLetters.has(keyId);
              
              let classes = 'compact-key';
              if (isSelected) classes += ' highlight';
              
              return (
                <div 
                  key={`${rowIndex}-${keyId}`} 
                  className={classes} 
                  onClick={(e) => toggleLetter(keyId, e)}
                >
                  {keyDef.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="presets">
        {Object.entries(PRESETS).map(([name, letters]) => (
          <button
            key={name}
            className="preset-btn"
            onClick={() => applyPreset(letters)}
          >
            {name}
          </button>
        ))}
        <button
          className="preset-btn"
          style={{ borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }}
          onClick={toggleAll}
        >
          {selectedLetters.size === ALL_KEYS.length ? 'Deselect All' : 'Select All'}
        </button>
        <button
          className="preset-btn"
          style={{ borderColor: 'var(--incorrect)', color: 'var(--incorrect)' }}
          onClick={clearSelection}
        >
          <Trash2 size={14} /> Clear All
        </button>
      </div>
    </div>
  );
}
