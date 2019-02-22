import { connect } from 'react-redux'
import React from 'react'
import { NavLink } from 'react-router-dom'

// import { setTodoFilter } from  '../store/store1'
// import Link from '../components/Link'

// const mapStateToProps = (state, ownProps) => {
//   const store = state.store1;
//   return {
//     active: ownProps.filter === store.todoFilter
//   }
// };
//
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     onClick: () => {
//       dispatch(setTodoFilter(ownProps.filter))
//     }
//   }
// };

// const FilterLink = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Link);

// export default FilterLink

const FilterLink = ({ filter, children }) => (
    <NavLink
        to={{
          pathname: `/${filter}`,
          state: {
            filter: 'SHOW_' + filter.toUpperCase()
          }
        }}
        activeStyle={{
          textDecoration: 'none',
          color: 'red'
        }}
    >
      {children}
    </NavLink>
);

export default FilterLink;