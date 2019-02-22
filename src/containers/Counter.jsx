import Counter from '../components/Counter'
import { connect } from 'react-redux'

const mapStateToProps = ({store5: store}) => {
  return {
    value: store.num
  }
};

const mapDispatchToDispatch = (dispatch) => {
  const action = type => dispatch({type});
  return {
    onIncrement: () => action('INCREMENT'),
    onDecrement: () => action('DECREMENT'),
    onIncrementAsync: () => action('INCREMENT_ASYNC'),
  }
};

export default connect(mapStateToProps, mapDispatchToDispatch)(Counter)