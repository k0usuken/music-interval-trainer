import { Question, Note, NoteStep } from '../types';
import { INTERVALS, NOTE_STEPS, NOTE_PITCH_MAP, STAFF_POSITIONS } from '../constants';

const getPitch = (step: NoteStep, octave: number): number => {
  return NOTE_PITCH_MAP[step] + octave * 12;
};

const getAccidentalFromValue = (value: number): 'sharp' | 'flat' => {
    // This function is now only called when value is 1 or -1.
    return value === 1 ? 'sharp' : 'flat';
}

const getStaffPosition = (step: NoteStep, octave: number): number => {
    return STAFF_POSITIONS[`${step}${octave}`] ?? 0;
}

export const generateQuestion = (): Question => {
  const G3_PITCH = getPitch('G', 3);
  const G5_PITCH = getPitch('G', 5);

  while (true) {
    // 1. Pick a random base note (natural notes only for simplicity)
    const allowedBaseNotes: { step: NoteStep, octave: number }[] = [
        {step: 'G', octave: 3}, {step: 'A', octave: 3}, {step: 'B', octave: 3},
        {step: 'C', octave: 4}, {step: 'D', octave: 4}, {step: 'E', octave: 4}, {step: 'F', octave: 4}, {step: 'G', octave: 4},
        {step: 'A', octave: 4}, {step: 'B', octave: 4},
        {step: 'C', octave: 5}, {step: 'D', octave: 5}, {step: 'E', 'octave': 5}, {step: 'F', octave: 5},
    ];
    const { step: baseNoteStep, octave: baseNoteOctave } = allowedBaseNotes[Math.floor(Math.random() * allowedBaseNotes.length)];
    const baseNotePitch = getPitch(baseNoteStep, baseNoteOctave);

    // 2. Pick a random interval
    const interval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];

    // 3. Calculate the top note's pitch
    const topNotePitch = baseNotePitch + interval.semitones;

    // 4. Ensure the entire chord is within the G3-G5 range
    if (baseNotePitch < G3_PITCH || topNotePitch > G5_PITCH) {
        continue;
    }

    const baseNote: Note = {
      step: baseNoteStep,
      octave: baseNoteOctave,
      accidental: 'natural',
      fullName: `${baseNoteStep}${baseNoteOctave}`,
      staffPosition: getStaffPosition(baseNoteStep, baseNoteOctave)
    };

    // 5. Calculate the top note's step
    const baseNoteIndex = NOTE_STEPS.indexOf(baseNote.step);
    const topNoteIndex = (baseNoteIndex + interval.degree - 1) % 7;
    const topNoteStep = NOTE_STEPS[topNoteIndex];

    // 6. Determine octave of top note
    const topNoteOctave = (baseNoteIndex + interval.degree - 1 >= 7) ? baseNote.octave + 1 : baseNote.octave;

    // 7. Calculate accidental and filter out unwanted ones
    const naturalTopNotePitch = getPitch(topNoteStep, topNoteOctave);
    const accidentalValue = topNotePitch - naturalTopNotePitch;
    
    // Only allow sharps (1) and flats (-1).
    // This filters out natural (0), double-sharp (2), and double-flat (-2).
    if (accidentalValue !== 1 && accidentalValue !== -1) {
        continue;
    }
    
    const topNoteAccidental = getAccidentalFromValue(accidentalValue);

    const topNote: Note = {
      step: topNoteStep,
      octave: topNoteOctave,
      accidental: topNoteAccidental,
      fullName: `${topNoteStep}${topNoteAccidental === 'sharp' ? '#' : 'b'}${topNoteOctave}`,
      staffPosition: getStaffPosition(topNoteStep, topNoteOctave)
    };
    
    return {
        notes: [baseNote, topNote],
        correctAnswer: interval.name,
    };
  }
};
