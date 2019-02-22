import React from 'react';

class Book extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { match } = this.props;
    return (
        <div className="book">
          <h1>图书 {match.params.id}</h1>
        </div>
    );
  }
}

export default Book;