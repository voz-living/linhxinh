import emotions from './const/emotions';
const PREFIX = '##ahihi ';
const POSTFIX = ' __';
const key = 'AIzaSyDotqQ8Zrj7KdNey9O1RYlzgp3evH9RhRc';

export function emosToText(emos) {
  return PREFIX + emos.join(' ') + POSTFIX;
}
export function shortToEmos(s) {
  const converted = s.split('').map(c => {
    const cc = c.charCodeAt(0);
    let mapIdx = 0;
    if (cc >= 48 && cc <= 57) {
      mapIdx = cc - 48;
    } else if (cc >= 65 && cc <= 90) {
      mapIdx = cc - 65 + 10;
    } else if (cc >= 97 && cc <= 122) {
      mapIdx = cc - 97 + 36;
    } else {
      return c;
    }
    return emotions[mapIdx].text;
  });
  return converted;
}

export function emoToShort(emos) {
  const url = emos
    .map(e => emotions.findIndex(emo => emo.src === e))
    .map(idx => {
      let cc;
      if (idx <= 10) {
        cc = idx + 48;
      } else if (idx <= 36) {
        cc = idx - 10 + 65
      } else if (idx <= (36+26)) {
        cc = idx - 36 + 97
      } else {
        throw new Error('Out of range');
      }
      return String.fromCharCode(cc);
    }).join('')
  return url;
}

export function getShortUrl(url) {
  const apiUrl = `https://www.googleapis.com/urlshortener/v1/url?key=${key}`;
  const body = JSON.stringify({longUrl: url});
  return new Promise((resolve, reject) => {
    fetch(apiUrl, {
      method: 'post',  
      headers: {  
        "Content-type": "application/json"  
      },  
      body,
    })
    .then(response => response.json())
    .then(function (data) {  
      resolve(data);
    })  
    .catch(function (error) {  
      reject(error);
    });
  });
}

export function getLongUrl(short) {
  const apiUrl = `https://www.googleapis.com/urlshortener/v1/url?shortUrl=http://goo.gl/${short}&key=${key}`;
  return new Promise((resolve, reject) => {
    fetch(apiUrl, {
      method: 'get',
    })
    .then(response => response.json())
    .then(function (data) {  
      resolve(data);
    })  
    .catch(function (error) {  
      reject(error);
    });
  });
}