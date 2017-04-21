import React, { Component } from 'react';
import './App.css';
import * as action from './action';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encodedContent: '',
    };
  }

  /*
https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#2-unsupported-syntax
  */

  onClickEncode = () => {
    const url = document.querySelector('#urlToEncode').value;
    action.getShortUrl(url).then((res) => {
      if (res.error) {
        console.error(res.error);
        alert('Error while shortening the url');
        return;
      }
      if (res.id) {
        const id = res.id.match(/goo\.gl\/(.*)/)[1];
        const encodedContent = action.shortToEmo(id);
        this.setState({
          encodedContent
        })
      }
    }).catch((error) => {
      console.error(error);
      alert('Error while shortening the url');
    })
  }

  render() {
    const { encodedContent } = this.state;
    return (
      <div className="app">
        <div className="section">
          <h2>Encode</h2>
          <div className="col-tainer">
            <div className="col">
              <label>
                <input type="text" id='urlToEncode'/>
                <button onClick={this.onClickEncode}>Encode</button>
              </label>
            </div>
            <div className="col">
              <textarea value={encodedContent}></textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
