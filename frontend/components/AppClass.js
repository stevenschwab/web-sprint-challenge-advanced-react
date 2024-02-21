// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
import React from 'react';
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

const URL = 'http://localhost:9000/api/result';

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset = () => {
    this.setState({ ...initialState })
  }

  getNextIndex = (direction) => {
    const { x, y } = this.getXY();
    const { index } = this.state;
    switch (direction) {
      case 'up': return (y > 1) ? (index - 3) : index;
      case 'left': return (x > 1) ? (index - 1) : index;
      case 'down': return (y < 3) ? (index + 3) : index;
      case 'right': return (x < 3) ? (index + 1) : index;
      case 'reset': return initialState.index;
      default: return index;
    }
  }

  move = (evt) => {
    const direction = evt.target.id;
    const { index } = this.state;

    if (direction === 'reset') {
      return this.reset();
    }

    const nextIdx = this.getNextIndex(direction);
    const message = index === nextIdx ? `You can't go ${direction}` : initialMessage;

    this.setState(prevState => ({
      index: nextIdx,
      steps: prevState.index !== nextIdx ? prevState.steps + 1 : prevState.steps, 
      message: message
    }));
  }

  onChange = (evt) => {
    const { value } = evt.target;
    this.setState({ ...this.state, email: value });
  }

  setAxiosResponseError = err => this.setState({ ...this.state, message: err.response.data.message })

  postEmail = () => {
    const { email, steps } = this.state;
    const { x, y } = this.getXY();
    axios.post(URL, {
      x: x,
      y: y,
      steps: steps,
      email: email
    })
      .then(res => {
        this.setState({ ...this.state, message: res.data.message, email: initialEmail });
      })
      .catch(this.setAxiosResponseError)
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    this.postEmail();
  }

  render() {
    const { className } = this.props;
    const { steps, email, index, message } = this.state;
    return (
      <div id="wrapper" className={className}>
        <p>(This component is not required to pass the sprint)</p>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">{`You moved ${steps} time${steps === 1 ? '' : 's'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
                {idx === index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.move}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
