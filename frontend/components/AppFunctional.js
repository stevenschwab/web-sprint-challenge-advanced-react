import React, { useState } from 'react';
import axios from 'axios';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    const { x, y } = getXY();
    switch (direction) {
      case 'left': return x > 1 ? index - 1 : index;
      case 'up': return y > 1 ? index - 3 : index;
      case 'right': return x < 3 ? index + 1 : index;
      case 'down': return y < 3 ? index + 3 : index;
      case 'reset': return initialIndex;
      default: return index;
    }
  }

  function move(evt) {
    evt.preventDefault();
    const direction = evt.target.id;
    const nextIdx = getNextIndex(direction);

    if (direction === 'reset') {
      reset();
    } else if (nextIdx === index) {
      setMessage(`You can't go ${direction}`);
    } else {
      setIndex(nextIdx);
      setSteps(prevSteps => prevSteps + 1);
      if (message !== initialMessage) {
        setMessage(initialMessage);
      }
    }
  }

  function onChange(evt) {
    const { value } = evt.target;
    setEmail(value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();
    const payload = {
      x: x,
      y: y,
      steps: steps,
      email: email
    };
    axios.post("http://localhost:9000/api/result", payload)
      .then(res => {
        setMessage(res.data.message);
        setEmail(initialEmail);
      })
      .catch(err => {
        setMessage(err.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
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
        <button id="left" onClick={move} >LEFT</button>
        <button id="up" onClick={move} >UP</button>
        <button id="right" onClick={move} >RIGHT</button>
        <button id="down" onClick={move} >DOWN</button>
        <button id="reset" onClick={move} >reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={onChange} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit" data-testid="submit-button"></input>
      </form>
    </div>
  )
}
