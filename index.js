import * as m3u from './m3u/index.js'

m3u.download('url', 'target path')
.then(() => {
    console.log('success');
})
.catch((error) => {
    console.log(error);
})