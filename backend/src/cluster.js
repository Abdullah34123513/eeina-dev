import cluster from 'cluster';
import os from 'os';
import process from 'process';


if (cluster.isPrimary) {
      const numCPUs = os.cpus().length;
      console.log(`primary ${process.pid} is running`);
      console.log(`Forking ${numCPUs} workers...`);
      
      for (let i = 0; i < numCPUs; i++) {
            console.log(`CPU ${i}:`, os.cpus()[i].model);
            cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
      });
} else {
      import("./index.js")
}