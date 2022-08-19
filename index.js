import * as m3u from './m3u/index.js'

m3u.download('streaming m3u file url', 'path that the file will be saved')
.then(() => {
    console.log('success');
})
.catch((error) => {
    console.log(error);
})