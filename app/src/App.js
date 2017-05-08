import React, { Component } from 'react';
import './App.css';
import CKEditor from './component/CKEditor';
import * as action from './action';
import { marx } from './const/triethoc';
const marxArray = marx.split(/[\.?!]/);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decodedURL: '',
      emos: [],
      encodedContent: '',
      mixMarxContent: '',
    };
  }

  /*
https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#2-unsupported-syntax
  */

  onClickEncode = () => {
    const url = document.querySelector('#urlToEncode').value;
    if(url.trim() === '') alert('Empty');
    action.getShortUrl(url).then((res) => {
      if (res.error) {
        console.error(res.error);
        alert('Error while shortening the url');
        return;
      }
      if (res.id) {
        const id = res.id.match(/goo\.gl\/(.*)/)[1];
        const emos = action.shortToEmos(id);
        const encodedContent = action.emosToText(emos);
        this.setState({
          emos,
          encodedContent,
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
      } else {
        if (res.status === "REMOVED") {
          alert('Link have been removed by google')
        } else {
          alert(`Unknown Error: ${res.status}`)
        }
      }
    }).catch((error) => {
      console.error(error);
      alert('Error while expanding the url');
    })
  };

  onClickMixMarx = () => {
    const { emos } = this.state;
    const eLength = emos.length;
    const start = Math.floor(Math.random()*(marxArray.length - eLength - 1));
    const doc = emos.map((emo, i) => {
      return `${marxArray[start+i]} ${emo}.`
    }).join(' ');
    this.setState({
      mixMarxContent: doc,
    });
  }

  render() {
    const { encodedContent, decodedURL, mixMarxContent } = this.state;
    return (
      <div className="app">
        <div className="section">
          <h2>Encode</h2>
          <div className="col-tainer">
            <div className="col">
              <label>
                <input type="text" id='urlToEncode' placeholder="Url To Encode" style={{width: '100%'}}/>
                <button onClick={this.onClickEncode}>Encode</button>
              </label>
            </div>
            <div className="col">
              <textarea value={encodedContent}></textarea>
              <button onClick={this.onClickMixMarx}>Mix with Marx</button>
              {mixMarxContent !== '' ? <textarea value={mixMarxContent} rows={4}></textarea> : null}
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
              {decodedURL !=='' ? <p>
              <a href={decodedURL} target="_blank">{decodedURL}</a>
              </p> : null}
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
