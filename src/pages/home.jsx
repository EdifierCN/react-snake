import React from 'react';
import { Route,Link } from 'react-router-dom';
import styles from './home.css'

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="home">
          <h1 className={styles.home}>首页</h1>
          <ul>
            <li><Link to="/book/id/1">book-1</Link></li>
            <li><Link to="/book/id/2">book-2</Link></li>
            <li><Link to="/book/id/3">book-3</Link></li>
          </ul>
        </div>
    );
  }
}

export default Home;