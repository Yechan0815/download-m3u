# download-m3u

`download-m3u` is a library that reads `m3u streaming files (m3u8)` and downloads the complete video.

This library can be used like below.

```js
import * as m3u from './m3u/index.js'

m3u.download('streaming m3u file url', 'path that the file will be saved')
.then(() => {
    console.log('success');
})
.catch((error) => {
    console.log(error);
})
```
