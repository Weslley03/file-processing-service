import { Router } from "express";
import { getDirName } from "../utils/getDirName.js";
import multer from "multer";
import path from "path";
import { Worker } from "worker_threads";

const router = Router();
const dirname = getDirName(import.meta.url);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage })

router.post('/upload', upload.single('file'), (req, res) => {
  const input_path = req.file.path;
  const output_path = path.join(dirname, '../processed', `${Date.now()}-compressed.gz`);

  const worker = new Worker('./src/processes/compressProcess.js', { workerData: { input_path, output_path } });

  worker.on('message', (message) => {
    if(message.status === 'done') {
      res.send(`file uploaded successfully! path: ${input_path}`);
    };
  });

  worker.on('error', (err) => {
    console.error('worker error:', err);
    res.status(500).send('error during file compression.');
  });
});

export default router;