# Node.js Streams

## Requres:
## Examples:
use terminal as streams:
```js
process.stdin.pipe(process.stdout);
```
user ``.on()``:

```js
process.stdin.pipe(process.stdout)
	.on('data', message => console.log('teminal out:',message));
```

other examples:
```js
process.stdin.pipe(process.stdout)
	.on('error')
	.on('end')
	.on('close');
```
## create "big.file":
```shell
mkdir "data";
node -e "process.stdout.write(crypto.randomBytes(1e9))" > ./data/big.file
```

### server the big.file

1. the incorrect form of server this file

```js
import http from 'http';
import { readFileSync } from 'fs';

http.createServer((req, res) => {
    const file = readFileSync('./data/big.file').toString();
    res.write(file);
    res.end();
}).listen(3000, () => console.log('running server at http://localhost:3000'));
```
this code returns an error, because crate a very long string;

2. try to resolve the very long string:

```js
import http from 'http';
import { readFileSync } from 'fs';

http.createServer((req, res) => {
    const file = readFileSync('./data/big.file')
    res.write(file);
    res.end();
}).listen(3000, () => console.log('running server at http://localhost:3000'));
```
this conde generate a warning to server a big.file as binary   
_"the binary flie can to download of consumers."_


3. User streams:
```js
import http from 'http';
import { createReadStream } from 'fs';

http.createServer((req, res) => {
	createReadStream('data/big.file')
		.pipe(res);
}).listen(3000, () => console.log('running server at http://localhost:3000'));
```
the bast form of work with the big flies;

### user net:

create a net server and send the results of termial out:

```js
import net from 'net';

net.createServer(socket => socket.pipe(process.stdout))
	.listen(1338);

```
In other terminal create the connection of net server.ß

```shell
node -e "process.stdin.pipe(require('net').connect(1338))"
```
