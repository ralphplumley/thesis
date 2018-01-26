import React from 'react';
import NavHeader from './NavHeader.jsx';
import Search from './Search.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <NavHeader />
        <Search />
      </div>);
  }
}
export default App;
