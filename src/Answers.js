import React, {Component} from 'react';
import styled from 'styled-components';

import isTouchDevice from './utils/isTouchDevice';
import Answer from './Answer'


class Answers extends Component {

  constructor(props) {
    super(props);
    this.scrollContainer = React.createRef();
  }

  componentDidMount() {
    this.scrollDownHint();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.answers !== this.props.answers) {
      this.scrollDownHint();
    }
  }


  scrollDownHint() {
    const scrollContainer = this.scrollContainer.current;
    const exceededScrollHeight = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
    if(exceededScrollHeight > 0) {
      scrollContainer.scrollTop = 0;
      const targetScrollTop = exceededScrollHeight / 2;
      const maxAnimateTime = 240;
      const frameTime = 12;
      const frames = Math.floor(maxAnimateTime / frameTime);
      const frameDistanceLinear = targetScrollTop / frames;
      let timePassed = 0;
      function moveScroll() {
        setTimeout(() => {
          if (timePassed <= maxAnimateTime) {
            scrollContainer.scrollTop += frameDistanceLinear;
            timePassed += frameTime;
            moveScroll();
          }
        }, frameTime)
      }
      moveScroll();
    }
  }

  

  render() {
    const {className, isSelected, handleClick, answers} = this.props;
    return (
      <div className={className} ref={this.scrollContainer}>
        {
          answers.map(ans => (
            <Answer
              isTouchDevice={isTouchDevice}
              selected={isSelected(ans.id)}
              key={ans.id}
              ans={ans}
              handleClick={handleClick} />
          ))
        }
      </div>
    )
  }
}

const StyledAnswers = styled(Answers)`
  overflow-y: auto;
  width: 100%;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`


export default StyledAnswers;