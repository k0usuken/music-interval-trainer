import React, { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { Question, AnswerState, Note } from './types';
import { generateQuestion } from './utils/musicTheory';
import { INTERVALS } from './constants';
import Staff from './components/Staff';
import { playChord } from './utils/audio';

const App: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [autoSound, setAutoSound] = useState(false);

  // Statistics and Timing State
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [totalTimeToCorrect, setTotalTimeToCorrect] = useState<number>(0);
  const [averageTime, setAverageTime] = useState<number>(0);

  const playSound = useCallback(async (notes: [Note, Note]) => {
    try {
      if (!autoSound) return;
      await Tone.start();
      playChord(notes, 2);
    } catch (e) {
      console.error("Error playing sound:", e);
    }
  }, [autoSound]);

  const newQuestion = useCallback(async () => {
    const newQ = generateQuestion();
    setQuestion(newQ);
    setSelectedAnswer(null);
    setAnswerState('unanswered');
    setFeedbackMessage('');
    setElapsedTime(0); // Reset visual timer
    setStartTime(Date.now()); // Start the timer for the new question
    await playSound(newQ.notes);
  }, [playSound]);

  // Effect to handle the timer
  useEffect(() => {
    let interval: number | undefined;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  // Effect to load the first question on mount
  useEffect(() => {
    newQuestion();
  }, [newQuestion]);

  const handleSelectAnswer = (intervalName: string) => {
    if (answerState === 'correct') return; // Don't allow changing answer after correct
    setSelectedAnswer(intervalName);
    setAnswerState('unanswered');
    setFeedbackMessage('');
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !question) return;

    if (answerState === 'correct') { // "Next Question" button
        await newQuestion();
        return;
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      // Stop the timer only on correct answer
      if(startTime) {
        const timeTaken = (Date.now() - startTime) / 1000;
        const newTotalTime = totalTimeToCorrect + timeTaken;
        const newCorrectCount = correctCount + 1;
        setTotalTimeToCorrect(newTotalTime);
        setCorrectCount(newCorrectCount);
        setAverageTime(newTotalTime / newCorrectCount);
      }
      setStartTime(null); // Stop timer

      setAnswerState('correct');
      setFeedbackMessage('Correct!');
    } else {
      setAnswerState('incorrect');
      setFeedbackMessage('Incorrect! Try again.');
      await playSound(question.notes);
      // Timer continues to run on incorrect answer
    }
  };

  const toggleAutoSound = () => {
    setAutoSound(!autoSound);
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  const feedbackClass = answerState === 'correct' ? 'text-green-400' : 'text-red-500';
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-6">
        <header className="w-full">
          <div className="text-center mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Interval Trainer
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Hone your musical ear.</p>
          </div>
          <div className="text-center mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" onClick={toggleAutoSound}/>
              <div
                className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Auto Sound</span>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center bg-gray-800 p-4 rounded-lg shadow-md">
            <div>
              <p className="text-sm font-medium text-gray-400">Correct</p>
              <p className="text-2xl font-bold text-cyan-300">{correctCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Elapsed</p>
              <p className="text-2xl font-bold text-yellow-300">{elapsedTime.toFixed(1)}s</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Average</p>
              <p
                className="text-2xl font-bold text-green-300">{averageTime > 0 ? `${averageTime.toFixed(2)}s` : '---'}</p>
            </div>
          </div>
        </header>

        <main className="w-full flex flex-col items-center space-y-8">
          <Staff notes={question.notes} answerState={answerState} />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full max-w-2xl">
            {INTERVALS.map(({ name }) => {
              const isSelected = selectedAnswer === name;
              const isCorrect = answerState === 'correct' && isSelected;
              const isIncorrect = answerState === 'incorrect' && isSelected;
              
              let buttonClass = "p-3 rounded-lg font-semibold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ";
              if (isCorrect) {
                  buttonClass += "bg-green-500 text-white ring-2 ring-green-300 transform scale-105";
              } else if (isIncorrect) {
                  buttonClass += "bg-red-600 text-white ring-2 ring-red-400";
              } else if (isSelected) {
                  buttonClass += "bg-blue-600 text-white ring-2 ring-blue-400";
              } else {
                  buttonClass += "bg-gray-700 hover:bg-gray-600 text-gray-200";
              }

              return (
                <button
                  key={name}
                  onClick={() => handleSelectAnswer(name)}
                  className={buttonClass}
                >
                  {name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`w-full px-8 py-4 text-xl font-bold rounded-lg transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4
              ${!selectedAnswer ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 
                answerState === 'correct' ? 'bg-green-600 hover:bg-green-500 text-white focus:ring-green-400' :
                'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-400'}`}
            >
              {answerState === 'correct' ? 'Next Question' : 'Submit Answer'}
            </button>
            {feedbackMessage && (
                <div className={`text-xl font-medium animate-pop ${feedbackClass}`}>
                    {feedbackMessage}
                </div>
            )}
          </div>
          <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
            <p className="text-sm font-medium text-gray-400">©2025 k0usuken</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
