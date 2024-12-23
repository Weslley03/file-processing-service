import cluster from "cluster";
import app from './app.js';
import os from 'os';

if(cluster.isPrimary) {
  /*
  eu entendo que usar tanto assim pode não ser tão vantajoso e talvez desnecessário, 
  isso é apenas um exemplo !
  */
  const num_cpus = os.cpus().length;
  console.log(`primary process running with PID: ${process.pid}`);

  for(let index = 0 ; index < num_cpus ; index++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died. restarting...`);
    cluster.fork();
  });

} else {
  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`server running with worker ${process.pid}`);
  });
}

