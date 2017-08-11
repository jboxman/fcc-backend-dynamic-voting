import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

import palette from '../../util/palette';

const wrapperStyle = {
  position: 'relative',
  margin: 'auto',
  width: '80vw'
};

class PollVotingChart extends React.Component {
  constructor() {
    super();
    // TODO - Why did this suddenly stop working?
    this.getCanvasRef = this.getCanvasRef.bind(this);
  }

  getCanvasRef(el) {
    console.log(el);
    this.canvasEl = el;
  }

  compoundWillUnmount() {
    this.Chart.destroy();
  }

  componentDidMount() {
    if(this.Chart) return;

    this.Chart = new Chart(this.canvasEl, {
      type: 'pie',
      data: this.getData()
    });
  }

  // Derived from https://stackoverflow.com/a/39884692/6732764
  getData() {
    const {poll} = this.props;
    return {
      datasets: [
        {
          data: poll.answers.map(answer => answer.voteCount),
          backgroundColor: palette('tol-rainbow', poll.answers.length).map(hex => `#${hex}`)
        }
      ],
      labels: poll.answers.map((answer, idx) => `Choice ${idx+1}`)
    };
  }

  render() {
    return (
      <div className='ui container' style={wrapperStyle}>
        <canvas ref={(el) => {this.canvasEl = el;}}></canvas>
      </div>
    );
  }
}

export default PollVotingChart;
