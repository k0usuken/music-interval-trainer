import React, { useState } from 'react';
import * as Tone from 'tone';
import { Note, AnswerState } from '../types';
import TrebleClef from './TrebleClef';
import { ACCIDENTAL_SYMBOLS } from '../constants';
import { playChord } from '../utils/audio';

interface StaffProps {
  notes: [Note, Note];
  answerState: AnswerState;
}

const PlayIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const NoteComponent: React.FC<{ note: Note; x: number, y: number }> = ({ note, x, y }) => {
  const hasAccidental = note.accidental !== 'natural';

  const ledgerLines = [];
  // Ledger lines below staff (for C4/pos 10 and lower)
  if (note.staffPosition >= 10) {
      for (let p = 10; p <= note.staffPosition; p += 2) {
          const lineY = 50 + p * 10; // y for the ledger line
          ledgerLines.push(<line key={`l-b-${p}`} x1={x-15} y1={lineY} x2={x+15} y2={lineY} stroke="currentColor" strokeWidth="2" />);
      }
  }

  // Ledger lines above staff (for A5/pos -2 and higher)
  if (note.staffPosition <= -2) {
      for (let p = -2; p >= note.staffPosition; p -= 2) {
          const lineY = 50 + p * 10; // y for the ledger line
          ledgerLines.push(<line key={`l-a-${p}`} x1={x-15} y1={lineY} x2={x+15} y2={lineY} stroke="currentColor" strokeWidth="2" />);
      }
  }

  return (
    <g>
      {hasAccidental && (
        <text
          x={x - 40}
          y={y + 5}
          className="text-3xl fill-current"
          style={{ fontFamily: 'Arial' }}
        >
          {ACCIDENTAL_SYMBOLS[note.accidental]}
        </text>
      )}
      <ellipse cx={x} cy={y} rx="10" ry="8" className="fill-current" />
      {ledgerLines}
    </g>
  );
};

const Staff: React.FC<StaffProps> = ({ notes, answerState }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const staffHeight = 80;
  const lineSpacing = staffHeight / 4;
  const noteSpacingY = lineSpacing / 2;

  const note1 = notes[0];
  const note2 = notes[1];
  
  const y1 = 50 + note1.staffPosition * noteSpacingY;
  const y2 = 50 + note2.staffPosition * noteSpacingY;

  let x1 = 130;
  let x2 = 130;

  if (Math.abs(note1.staffPosition - note2.staffPosition) === 1) {
    if (note1.staffPosition > note2.staffPosition) {
        x1 = 118;
        x2 = 142;
    } else {
        x1 = 142;
        x2 = 118;
    }
  }

  const handlePlaySound = async () => {
      if (isPlaying) return;
      
      // Tone.start() must be called in response to a user gesture.
      await Tone.start();

      const duration = 2; // 2 seconds
      setIsPlaying(true);
      playChord(notes, duration);
      setTimeout(() => {
          setIsPlaying(false);
      }, duration * 1000);
  };

  return (
    <div className={`relative w-full max-w-lg h-auto mx-auto p-auto rounded-lg bg-gray-800 shadow-lg ${answerState === 'incorrect' ? 'animate-shake' : ''}`}>
      {answerState !== 'unanswered' && (
         <div className={`absolute inset-0 border-4 ${answerState === 'correct' ? 'border-green-400' : 'border-red-500'} rounded-lg animate-glow pointer-events-none`}></div>
      )}
      
      <button
        onClick={handlePlaySound}
        disabled={isPlaying}
        className={`absolute top-2 right-2 p-2 rounded-full text-white transition-colors duration-200
                    ${isPlaying ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'} 
                    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800`}
        aria-label="Play Chord"
      >
        <PlayIcon />
      </button>

      <TrebleClef />

      <svg viewBox="0 0 400 180" className="w-full h-auto text-gray-200">
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1="10"
            y1={50 + i * lineSpacing}
            x2="390"
            y2={50 + i * lineSpacing}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
        <g className={answerState === 'correct' ? 'text-green-300' : answerState === 'incorrect' ? 'text-red-400' : 'text-white'}>
          <NoteComponent note={note1} x={x1} y={y1} />
          <NoteComponent note={note2} x={x2} y={y2} />
        </g>
      </svg>
    </div>
  );
};

export default Staff;
