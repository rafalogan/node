import { pipeline, Readable, Writable, Transform  } from 'stream';
import { promisify  } from 'util';
import { createWriteStream } from 'fs';

const pipelineAsync = promisify(pipeline);

{
	const readableStream = Readable({
		read: function () {
			this.push('hello Dude!!0');
			this.push('hello Dude!!1');
			this.push('hello Dude!!2');
			this.push(null);
		}
	});

	const writableStream = Writable({
		write(chunk, encoding, cb) {
			console.log('message:', chunk.toString());
			cb();
		}
	})

	await pipelineAsync(
		readableStream,
		// process.stdout
		writableStream
	);

	console.log('end process 01!!')

}
{

	const readableStream = Readable({
		read () {
			for (let index = 0; index < 1e5; index++) {
				const person = {
					id: Date.now() + index,
					name: `_R-${index}`
				}
				const data = JSON.stringify(person);
				this.push(data);
			}
			this.push(null);
		}
	})

	const writableMapToCSV = Transform({
		transform(chunk, encoding, cb) {
			const data = JSON.parse(chunk);
			const result = `${data.id},${data.name.toUpperCase()}\n`;
			cb(null, result)
		}
	});

	const setHeader = Transform({
		transform(chunk, encoding, cb) {
			this.counter = this.counter ?? 0;
			if (this.counter) return cb(null, chunk);

			this.counter +=1;

			cb(null, 'id,name\n'.concat(chunk));
		}
	})

	await pipelineAsync(
		readableStream,
		writableMapToCSV,
		setHeader,
		createWriteStream('./data/my.csv')
	);
}
