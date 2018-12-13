import React, {Component} from 'react';
import styled from 'styled-components';

const ResultDesc = styled.div`
  margin: 10px 7.5vw;
`

class RadarSVG extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      containerWidth: null,
    }

    this.svgRatio = 0.75;
    this.innerHexagonWidthToSVGWidthRatio = 0.09;
    this.outerHexagonWidthToSVGWidthRatio = 0.4;
    this.hexagonWidthToSVGRatioDistance = 0.075;

    this.labelPoistionRatio = 0.45;
    
    this.maxScore = 320;

    this.isContainerWidthReady = this.isContainerWidthReady.bind(this);
    this.getSVGCenter = this.getSVGCenter.bind(this);
    this.calculatePointOnSVG = this.calculatePointOnSVG.bind(this);
    this.getAngle = this.getAngle.bind(this);
    this.drawHexagon = this.drawHexagon.bind(this);
    this.svgWidth = this.svgWidth.bind(this);
    this.drawHexagonSkeleton = this.drawHexagonSkeleton.bind(this);
    this.drawLabels = this.drawLabels.bind(this);
  }

  isContainerWidthReady() {
    return this.state.containerWidth !== null;
  }

  svgWidth() {
    return this.state.containerWidth * this.svgRatio;
  }

  getSVGCenter() {
    if(this.isContainerWidthReady()) {
      return [this.svgWidth() / 2, this.svgWidth() / 2];
    }
    else return null;
  }

  getAngle(anglePosition) {
    switch(anglePosition) {
      case 1: return Math.PI / 2;
      case 2: return Math.PI / 6;
      case 3: return (Math.PI * 11 / 6);
      case 4: return (Math.PI * 3 / 2);
      case 5: return (Math.PI * 7 / 6);
      case 6: return (Math.PI * 5 / 6);
      default: return 0;
    }
  }

  scoreToMagnitude(score) {
    return (score / this.maxScore) * (this.outerHexagonWidthToSVGWidthRatio * this.svgWidth());
  }

  // returns [number, number]
  calculatePointOnSVG(magnitude, angle) {
    const rawXpoint = magnitude * Math.cos(angle),
          rawYpoint = magnitude * Math.sin(angle),
          center = this.getSVGCenter();
    const translatedX = center[0] + rawXpoint;
    const translatedY = center[1] - rawYpoint;
    return [translatedX, translatedY];
  }

  drawHexagon(radius, idx) {
    const pointsString = "" +
      this.calculatePointOnSVG(radius, this.getAngle(1)).join(',') + " " +
      this.calculatePointOnSVG(radius, this.getAngle(2)).join(',') + " " +
      this.calculatePointOnSVG(radius, this.getAngle(3)).join(',') + " " +
      this.calculatePointOnSVG(radius, this.getAngle(4)).join(',') + " " +
      this.calculatePointOnSVG(radius, this.getAngle(5)).join(',') + " " +
      this.calculatePointOnSVG(radius, this.getAngle(6)).join(',');
    return <polygon key={idx} points={pointsString} fill='none' stroke='grey'/>
  }

  drawHexagonSkeleton() {
    const outerMostRadius = this.svgWidth() * this.outerHexagonWidthToSVGWidthRatio;
    return <path fill='none' stroke='grey' d={`
      M ${this.getSVGCenter().join(',')} 
      L ${this.calculatePointOnSVG(outerMostRadius, this.getAngle(1)).join(',')}
      M ${this.getSVGCenter().join(',')} 
      L ${this.calculatePointOnSVG(outerMostRadius, this.getAngle(2)).join(',')}
      M ${this.getSVGCenter().join(',')} 
      L ${this.calculatePointOnSVG(outerMostRadius, this.getAngle(3)).join(',')}
      M ${this.getSVGCenter().join(',')} 
      L ${this.calculatePointOnSVG(outerMostRadius, this.getAngle(4)).join(',')}
      M ${this.getSVGCenter().join(',')} 
      L ${this.calculatePointOnSVG(outerMostRadius, this.getAngle(5)).join(',')}
      M ${this.getSVGCenter().join(',')} 
      L ${this.calculatePointOnSVG(outerMostRadius, this.getAngle(6)).join(',')}
    `}/>
  }

  drawLabels() {
    const xys = [1,2,3,4,5,6].map(num => this.calculatePointOnSVG(
      this.svgWidth() * this.labelPoistionRatio, this.getAngle(num)
    ));
    return (
      <React.Fragment>
        <text x={xys[0][0]} y={xys[0][1]} dominantBaseline='middle' textAnchor='middle'>強</text>
        <text x={xys[1][0]} y={xys[1][1]} dominantBaseline='middle' textAnchor='middle'>變</text>
        <text x={xys[2][0]} y={xys[2][1]} dominantBaseline='middle' textAnchor='middle'>具</text>
        <text x={xys[3][0]} y={xys[3][1]} dominantBaseline='middle' textAnchor='middle'>特</text>
        <text x={xys[4][0]} y={xys[4][1]} dominantBaseline='middle' textAnchor='middle'>操</text>
        <text x={xys[5][0]} y={xys[5][1]} dominantBaseline='middle' textAnchor='middle'>放</text>
      </React.Fragment>
    )
  }

  drawScore(score) {
    let pointsString = '';
    for (let [key, value] of Object.entries(score)) {
      switch(key){
        case 'enhancer':
          pointsString += this.calculatePointOnSVG(
            this.scoreToMagnitude(value), this.getAngle(1)).join(',') + ' ';
          break;
        case 'transmuter':
          pointsString += this.calculatePointOnSVG(
            this.scoreToMagnitude(value), this.getAngle(2)).join(',') + ' ';
          break;
        case 'conjurer':
          pointsString += this.calculatePointOnSVG(
            this.scoreToMagnitude(value), this.getAngle(3)).join(',') + ' ';
          break;
        case 'specialist':
          pointsString += this.calculatePointOnSVG(
            this.scoreToMagnitude(value), this.getAngle(4)).join(',') + ' ';
          break;
        case 'manipulator':
          pointsString += this.calculatePointOnSVG(
            this.scoreToMagnitude(value), this.getAngle(5)).join(',') + ' ';
          break;
        case 'emitter':
          pointsString += this.calculatePointOnSVG(
            this.scoreToMagnitude(value), this.getAngle(6)).join(',') + ' ';
          break;
        default: break;
      }
    }
    return <polygon fill='rgba(77,255,255,0.6)' stroke='rgb(0,255,255)' points={pointsString}/>
  }

  componentDidMount() {
    this.setState({
      containerWidth: this.containerRef.current.offsetWidth,
    })
  }

  getHighestTrait() {
    const {score} = this.props;
    let [highestTrait, highestScore] = ['enhancer', 0]
    for(let trait in score) {
      if (score[trait] > highestScore) {
        [highestTrait, highestScore] = [trait, score[trait]]
      }
    }
    return highestTrait;
  }

  render(){
    const {score, className} = this.props;
    const hexagonRadiuses = [];
    if (this.isContainerWidthReady()) {
      for(let i = this.outerHexagonWidthToSVGWidthRatio; 
          i >= this.innerHexagonWidthToSVGWidthRatio; 
          i -= this.hexagonWidthToSVGRatioDistance) {
        hexagonRadiuses.push(i * this.svgWidth())
      }
    }
    return (
      <div ref={this.containerRef} className={className}>
        {
          this.isContainerWidthReady() ? 
            <svg width={this.svgWidth()} height={this.svgWidth()}>
              {
                hexagonRadiuses.map((radius, idx) => this.drawHexagon(radius, idx))
              }
              {
                this.drawHexagonSkeleton()
              }
              {
                this.drawLabels()
              }
              {
                this.drawScore(score)
              }
            </svg>
            :
            null
        }
        <ResultDesc>
            <span>您的分數:</span>
            <br /> 
            <p>
              {'強化系: ' + score.enhancer} {'變化系: ' + score.transmuter} {'具現化系: ' + score.conjurer} 
              <br />
              {'特質系: ' + score.specialist} {'操作系: ' + score.manipulator} {'放出系: ' + score.emitter}
            </p>
            <p>
              您是「{traitNames[this.getHighestTrait()]}」。
              {waterTestDescription[this.getHighestTrait()]}
              {traitDescription[this.getHighestTrait()]}
            </p>
        </ResultDesc>
        <button onClick={this.props.redoTest}>重新作答</button>
      </div>
    );
  }
}

const traitNames = {
  enhancer: '強化系',
  transmuter: '變化系',
  conjurer: '具現化系',
  specialist: '特質系',
  manipulator: '操作系',
  emitter: '放出系）'
}

const waterTestDescription = {
  enhancer: '若您進行水見式測試，杯子裡的水會越來越多唷！',
  transmuter: '若您進行水見式測試，杯子裡的水會改變味道，酸甜苦鹹都有可能唷！',
  conjurer: '若您進行水見式測試，杯子裡可能會冒出雜質或結晶唷！',
  specialist: '若您進行水見式測試，杯子裡什麼都可能會發生，十分難以歸類呢！',
  manipulator: '若您進行水見式測試，水面上的葉子可能會移動唷！',
  emitter: '若您進行水見式測試，水的顏色可能會改變唷！'
}

const traitDescription = {
  enhancer: '根據西索的見解，強化系的人通常頭腦簡單、非常單純（代表:小傑、窩金、雲古、信長、華石鬥郎、尤匹）',
  transmuter: '根據西索的見解，變化系的人通常反覆無常、又愛騙人（代表：奇犽、西索、瑪奇、比司吉、飛坦）',
  conjurer: '根據西索的見解，具現化系的人通常很神經質（代表：酷拉皮卡、小滴、庫嗶、甘舒、凱特、諾布）',
  specialist: '根據西索的見解，特質系的人通常是個人主義者、有領袖氣質（代表：火紅眼狀態的酷拉皮卡、庫洛洛、派克諾妲、尼飛彼多、妮翁、梅路艾姆、拿尼加）',
  manipulator: '根據西索的見解，操作系的人通常我行我素、愛講道理（代表：伊爾謎、俠客、普夫、智喜、柯特）',
  emitter: '根據西索的見解，放出系的人通常粗枝大葉、性急、急燥（代表：雷歐力、富蘭克林、磊札、爆庫兒、拿酷戮）'
}


const StyledRadarSVG = styled(RadarSVG)`
  margin: 0 auto;
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 480px;
`


export default StyledRadarSVG;