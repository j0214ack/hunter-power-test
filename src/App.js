import React, { Component } from 'react';
import { OrderedMap } from 'immutable';
import { questions, answers, setScore } from './question-data';

import Question from './Question';
import ResultRadarChart from './ResultRadarChart';


function addScore(score, ans) {
  return {
    enhancer: score.enhancer + ans.score.enhancer,
    transmuter: score.transmuter + ans.score.transmuter,
    conjurer: score.conjurer + ans.score.conjurer,
    specialist: score.specialist + ans.score.specialist,
    manipulator: score.manipulator + ans.score.manipulator,
    emitter: score.emitter + ans.score.emitter,
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedAnswerIDs: OrderedMap(),
      currentQuestionID: 0,
      prevQuestionID: null,
    };

    this.getCurrentQuestion = this.getCurrentQuestion.bind(this);
    this.getCurrentAnswer = this.getCurrentAnswer.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
    this.nextQuestionWithAnswers = this.nextQuestionWithAnswers.bind(this);
    this.caculateScore = this.caculateScore.bind(this);
    this.resetTest = this.resetTest.bind(this);
  }

  resetTest() {
    this.setState({
      selectedAnswerIDs: OrderedMap(),
      currentQuestionID: 0,
      prevQuestionID: null,
    })
  }

  getCurrentQuestion() {
    return questions.find((question) => question.id === this.state.currentQuestionID);
  }

  getCurrentAnswer() {
    return answers.filter((ans) => ans.questionID === this.state.currentQuestionID);
  }

  prevQuestion() {
    const {selectedAnswerIDs, prevQuestionID} = this.state;
    const restoredAnswers = selectedAnswerIDs.delete(prevQuestionID);
    const restoredPrevQuestionID = restoredAnswers.isEmpty() ? 
      null : restoredAnswers.keySeq().last();
    if(prevQuestionID !== null) {
      this.setState({
        selectedAnswerIDs: restoredAnswers,
        currentQuestionID: prevQuestionID,
        prevQuestionID: restoredPrevQuestionID,
      })
    }
  }

  nextQuestionWithAnswers(anwserIDs) {
    const {selectedAnswerIDs, currentQuestionID} = this.state;
    const nextQuestionID = this.calculateNextQuestionID(anwserIDs);
    this.setState({
      selectedAnswerIDs: selectedAnswerIDs.set(currentQuestionID, anwserIDs),
      currentQuestionID: nextQuestionID,
      prevQuestionID: currentQuestionID,
    });
  }

  calculateNextQuestionID(anwserIDs) {
    if(anwserIDs.includes(2)) {
      return 2002;
    }
    if(this.state.currentQuestionID === 2002) {
      return 3;
    }
    if(this.state.currentQuestionID === 20) {
      return null;
    }
    return this.state.currentQuestionID + 1;
  }

  caculateScore() {
    const allAnswerIDs = this.state.selectedAnswerIDs.valueSeq().flatten();
    const allAnswers = answers.filter(ans => allAnswerIDs.includes(ans.id));
    const score = allAnswers.reduce(
      addScore, setScore(0,0,0,0,0,0));
    return score;
  }

  render() {
    if (this.state.currentQuestionID !== null) {
      return (
        <div>
          <Question 
            question={this.getCurrentQuestion()}
            answers={this.getCurrentAnswer()}
            prevQuestion={this.prevQuestion}
            nextQuestionWithAnswers={this.nextQuestionWithAnswers}
          />
        </div>
      );
    }
    else {
      return ( <ResultRadarChart redoTest={this.resetTest} score={this.caculateScore()} />);
    }
  }
}

export default App;
