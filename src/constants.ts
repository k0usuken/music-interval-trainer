import { Interval, NoteStep } from './types';

export const INTERVALS: Interval[] = [
  { name: 'm2(b9)', semitones: 1, degree: 2 },
  { name: 'M2(9)', semitones: 2, degree: 2 },
  { name: 'm3', semitones: 3, degree: 3 },
  { name: 'M3', semitones: 4, degree: 3 },
  { name: 'o4(b11)', semitones: 4, degree: 4 },
  { name: 'P4(11)', semitones: 5, degree: 4 },
  { name: '+4', semitones: 6, degree: 4 },
  { name: 'o5', semitones: 6, degree: 5 },
  { name: 'P5', semitones: 7, degree: 5 },
  { name: '+5', semitones: 8, degree: 5 },
  { name: 'm6(b13)', semitones: 8, degree: 6 },
  { name: 'M6(13)', semitones: 9, degree: 6 },
  { name: 'm7', semitones: 10, degree: 7 },
  { name: 'M7', semitones: 11, degree: 7 },
];

export const NOTE_STEPS: NoteStep[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const NOTE_PITCH_MAP: Record<NoteStep, number> = {
  'C': 0,
  'D': 2,
  'E': 4,
  'F': 5,
  'G': 7,
  'A': 9,
  'B': 11,
};

// Maps note step and octave to a numerical staff position. 
// Higher number = lower on staff.
export const STAFF_POSITIONS: Record<string, number> = {
  'G3': 13, 'A3': 12, 'B3': 11,
  'C4': 10, 'D4': 9, 'E4': 8, 'F4': 7, 'G4': 6, 'A4': 5, 'B4': 4,
  'C5': 3, 'D5': 2, 'E5': 1, 'F5': 0, 'G5': -1, 'A5': -2, 'B5': -3,
};

export const ACCIDENTAL_SYMBOLS: Record<string, string> = {
  'sharp': '♯',
  'flat': '♭',
};
