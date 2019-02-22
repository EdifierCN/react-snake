import React from 'react';

class About extends React.Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    const style = {
      background: 'blue'
    };
    return (
        <div className="about">
          <h1 style={style}>关于我们</h1>
        </div>
    );
  }
}

export default About;