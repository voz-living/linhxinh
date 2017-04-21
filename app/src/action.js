import emotions from './const/emotions';
const PREFIX = '##ahihi ';
const POSTFIX = ' __';
export function shortToEmo(s) {
  const conveted = s.split('').map(c => {
    const cc = c.charCodeAt(0);
    let mapIdx = 0;
    if (cc >= 48 && cc <= 57) {
      mapIdx = cc - 48;
    } else if (cc >= 65 && cc <= 90) {
      mapIdx = cc - 65 + 10;
    } else if (cc >= 97 && cc <= 122) {
      mapIdx = cc - 48 + 36;
    } else {
      return c;
    }
    return emotions[mapIdx].text;
  });
  return PREFIX + conveted.join(' ') + POSTFIX;
}

export function emoToShort(content) {
  
}

export function getShortUrl(url) {
  const apiUrl = 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyDotqQ8Zrj7KdNey9O1RYlzgp3evH9RhRc';
  const body = JSON.stringify({longUrl: url});
  console.log(url, body);
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