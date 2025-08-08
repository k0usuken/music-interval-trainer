import * as Tone from 'tone';
import { Note } from '../types';

// Helper to convert the app's internal Note object to Tone.js's note format (e.g., 'C#4', 'Gb5').
const noteToToneFormat = (note: Note): string => {
    let accidentalSymbol = '';
    switch(note.accidental) {
        case 'sharp': accidentalSymbol = '#'; break;
        case 'flat': accidentalSymbol = 'b'; break;
    }
    return `${note.step}${accidentalSymbol}${note.octave}`;
};


// Create a piano sampler instance using a singleton pattern to ensure
// it's only created and loaded once.
let piano: Tone.Sampler | null = null;
let isPianoLoaded = false;

const initializePiano = () => {
    if (piano) return;

    // A simple piano sampler using high-quality samples from the Salamander Grand Piano.
    piano = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3",
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
        },
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => {
            isPianoLoaded = true;
            console.log("Piano samples loaded.");
        }
    }).toDestination();

    // Lower the volume to a reasonable level to avoid clipping.
    piano.volume.value = -6;
};

// Initialize the piano sampler as soon as the module is loaded.
initializePiano();


/**
 * Plays a two-note chord using the pre-loaded piano sampler.
 * @param notes The two notes to play.
 * @param duration The duration of the sound in seconds.
 */
export const playChord = (notes: [Note, Note], duration: number = 2) => {
    if (!isPianoLoaded || !piano) {
        console.warn("Piano is not loaded yet. Cannot play sound.");
        return;
    }

    const toneNotes = notes.map(noteToToneFormat);
    
    // Play the chord using the sampler.
    piano.triggerAttackRelease(toneNotes, duration);
};
