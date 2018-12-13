import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import styled from 'styled-components';

import isTouchDevice from './utils/isTouchDevice';
import Answers from './Answers';


const NavBar = styled.div`
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: flex-start;
`

const PrevQuestionButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  border: 0;
  border-radius: 5px;
  background-color: rgba(0,0,0,0);
  cursor: pointer;

  ${
    (props) => props.isTouchDevice() ? "" : `
      &:hover {
        color: white;
        background-color: rgba(0,0,0,0.5);
      }
    `
  }
  
`

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  margin: 0 auto;
`

const QuestionDesc = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 20%; 
  margin: 10px 0;
  font-size: 28px;
  width: 90%;
`


function NextQuestionButton(props) {
  const {className, handleButtonSubmit} = props;
  return (
    <button onClick={handleButtonSubmit} className={className}>下一題</button>
  )
}

const NextQuestionButtonStyled = styled(NextQuestionButton)`
  font-size: 20px;
  margin-top: 20px;
  padding: 10px;
  width: 65%;
  cursor: pointer;
`

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswerIDs: Set()
    }
    this.handleButtonSubmit = this.handleButtonSubmit.bind(this);
    this.handleAnswerClick = this.handleAnswerClick.bind(this);
    this.isAnswerSelected = this.isAnswerSelected.bind(this);
  }

  isAnswerSelected(answerID) {
    if (answerID) {
      return this.state.selectedAnswerIDs.has(answerID);
    }
    else {
      return !this.state.selectedAnswerIDs.isEmpty();
    }
  }

  handleButtonSubmit() {
    if (this.isAnswerSelected()) {
      this.props.nextQuestionWithAnswers(this.state.selectedAnswerIDs.toList());
      this.setState({
        selectedAnswerIDs: Set()
      })
    }
  }

  handleAnswerClick(answerID) {
    const {selectedAnswerIDs} = this.state;
    if (this.props.question.multiAns) {
      this.setState({
        selectedAnswerIDs: selectedAnswerIDs.has(answerID) ? 
          selectedAnswerIDs.remove(answerID) : selectedAnswerIDs.add(answerID)
      })
    }
    else {
      this.setState({
        selectedAnswerIDs: selectedAnswerIDs.has(answerID) ? 
          selectedAnswerIDs.remove(answerID) : (selectedAnswerIDs.clear().add(answerID))
      })
    }
  }

  render() {
    const {question, prevQuestion, answers} = this.props;
    return (
      <QuestionContainer>
        <NavBar>
          {
            question.id > 1 ?
              <PrevQuestionButton isTouchDevice={isTouchDevice} onClick={prevQuestion}>
                {"< 上一題"}
              </PrevQuestionButton>
              : null
          }
        </NavBar>
        <QuestionDesc>
          {question.desc}{question.multiAns ? " (多選)" : ""}
        </QuestionDesc>
        <Answers 
          answers={answers} 
          isSelected={this.isAnswerSelected} 
          handleClick={this.handleAnswerClick}
        />
        {
          this.isAnswerSelected() ?
            <NextQuestionButtonStyled handleButtonSubmit={this.handleButtonSubmit} /> : null
        }
      </QuestionContainer>
    )
  }
}

Question.propTypes = {
  question: PropTypes.shape({
    desc: PropTypes.string.isRequired,
  }).isRequired,
  answers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    desc: PropTypes.string.isRequired,
    label: PropTypes.string
  })).isRequired,
  prevQuestion: PropTypes.func.isRequired,
  nextQuestionWithAnswers: PropTypes.func.isRequired,
}

export default Question;
