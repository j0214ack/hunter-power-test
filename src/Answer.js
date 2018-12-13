import React from 'react';
import styled from 'styled-components';

function Answer(props) {
  const {className, ans} = props;
  const {label, desc, id} = ans;

  const handleClick = () => {
    props.handleClick(id);
  }

  return (
    <div onClick={handleClick} className={className}>
      <div>{label !== "" ? label+"　" : ""}</div><div>{desc}</div>
    </div>
  );
}

const AnswerStyled = styled(Answer)`
  width: 90%;
  margin: 5px 0;
  padding: 5px;
  font-size: 24px;
  display: flex;
  flex-shrink: 0;
  cursor: pointer;

  background-color: ${(props) => props.selected ? "rgba(0,0,0,0.7)" : "white"};
  color: ${(props) => props.selected ? "white" : "black"};

  ${
    (props) => props.isTouchDevice() ? "" : `
      &:hover {
        background-color: rgba(0,0,0,0.5);
        color: white;
      }
    `
  }
`

export default AnswerStyled;