export type NoteStep = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Accidental = 'natural' | 'sharp' | 'flat';

export interface Note {
  step: NoteStep;
  octave: number;
  accidental: Accidental;
  fullName: string; // e.g., 'C#4'
  staffPosition: number; // Vertical position on the staff
}

export interface Interval {
  name: string;
  semitones: number;
  degree: number;
}

export interface Question {
  notes: [Note, Note];
  correctAnswer: string;
}

export type AnswerState = 'unanswered' | 'correct' | 'incorrect';
