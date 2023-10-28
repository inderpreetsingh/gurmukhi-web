import React from 'react'
import LevelHexagon from '../levels/LevelHexagon';
import StartQuestionBtn from '../questions/StartQuestionBtn';

export default function LevelsFooter() {
  const totalNumQuestions = 13;
  const currentQuestion = 5;
  const numQuestionsLeft = totalNumQuestions - currentQuestion;
  return (
    <footer className="flex flex-row bg-white/[.1] items-center justify-between p-12 z-10">
      <div className="flex flex-col items-left justify-between">
        <h1 className='opacity-60 text-sm tracking-[.25rem] mb-2'>{numQuestionsLeft} QUESTIONS TO GO TO YOUR NEXT NANAK COIN!!</h1>
        <div className="flex flex-row gap-5">
          {Array.from(Array(totalNumQuestions).keys()).map((num) => {
            if (num < currentQuestion - 1) {
              return <LevelHexagon key={num} number={num + 1} type='completed' />
            } else if (num === currentQuestion - 1) {
              return <LevelHexagon key={num} number={num + 1} type='current' />
            } else {
              return <LevelHexagon key={num} number={num + 1} type='locked' />
            }
          })}
        </div>
      </div>
      <StartQuestionBtn />
    </footer>
  )
}