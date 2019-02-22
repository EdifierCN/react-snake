import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const Counter = ({ value, onIncrement, onDecrement, onIncrementAsync }) => {
  return (
      <div>
        <button onClick={onIncrementAsync}>
          Increment after 1 second
        </button>
        {' '}
        <button onClick={onIncrement}>
          Increment
        </button>
        {' '}
        <button onClick={onDecrement}>
          Decrement
        </button>
        <hr />
        <div>
          Value: {value}
        </div>
      </div>
  );
};


Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrementAsync: PropTypes.func.isRequired,
};

export default Counter