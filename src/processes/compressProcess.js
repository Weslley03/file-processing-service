import { workerData, parentPort } from 'worker_threads';
import zlib from 'zlib';
import fs from 'fs'; 

const inputStream = fs.createReadStream(workerData.input_path);
const outputStream = fs.createWriteStream(workerData.output_path);
const gzip = zlib.createGzip();

inputStream.pipe(gzip).pipe(outputStream).on('finish', () => {
  parentPort.postMessage({ status: 'done', output_path });
}); 
