import React, { Component } from 'react';
import './App.css';
import CKEditor from './component/CKEditor';
import * as action from './action';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decodedURL: '',
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

  onClickDecode = () => {
    const emo = this.getEmoValue();
    const emos = emo.match(/vozforums.com\/images\/smilies[^"]*/g)
      .map(e => e.replace('vozforums.com',''));
    let short;
    try {
      short = action.emoToShort(emos);
    } catch(e) {
      alert('Error while decoding emoicons');
    }
    action.getLongUrl(short).then(res => {
      if (res.error) {
        console.error(res.error);
        alert('Error while expanding the url');
        return;
      }
      if(res.longUrl) {
        this.setState({ decodedURL: res.longUrl});
      }
    }).catch((error) => {
      console.error(error);
      alert('Error while expanding the url');
    })
  };

  render() {
    const { encodedContent, decodedURL } = this.state;
    return (
      <div className="app">
        <div className="section">
          <h2>Encode</h2>
          <div className="col-tainer">
            <div className="col">
              <label>
                <input type="text" id='urlToEncode' placeholder="Url To Encode"/>
                <button onClick={this.onClickEncode}>Encode</button>
              </label>
            </div>
            <div className="col">
              <textarea value={encodedContent}></textarea>
            </div>
          </div>
        </div>
        <div className="section">
          <h2>Decode</h2>
          <div className="col-tainer">
            <div className="col">
              <label>
                Paste Emoicons to decode (From the post, not from the editor)
                <CKEditor id='emoToDecode' refGetValue={(getValue) => this.getEmoValue = getValue}/>
                <button onClick={this.onClickDecode}>Decode</button>
              </label>
            </div>
            <div className="col">
              <input type="text" value={decodedURL} id='decodedUrl' />
              <p>
                We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the content of the url
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
