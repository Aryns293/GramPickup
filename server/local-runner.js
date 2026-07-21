const { MongoMemoryServer } = require('mongodb-memory-server');
const { execSync, spawn } = require('child_process');
const path = require('path');

(async () => {
  console.log('[local-runner] Starting in-memory MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`[local-runner] MongoDB started at ${uri}`);

  // Create environment variables with MONGODB_URI set
  const env = { ...process.env, MONGODB_URI: uri };

  try {
    // Run seed script from within the server directory
    console.log('[local-runner] Seeding database...');
    execSync('npm run seed', { stdio: 'inherit', env, cwd: __dirname });

    // Run the root 'npm run dev' to start both client and server concurrently
    console.log('[local-runner] Starting frontend and backend...');
    const rootDir = path.resolve(__dirname, '..');
    const dev = spawn('npm', ['run', 'dev'], { 
      stdio: 'inherit', 
      env,
      cwd: rootDir
    });

    dev.on('close', async (code) => {
      console.log(`[local-runner] Processes exited with code ${code}`);
      await mongod.stop();
      process.exit(code);
    });

    // Handle termination
    process.on('SIGINT', async () => {
      console.log('\n[local-runner] Stopping MongoDB...');
      await mongod.stop();
      process.exit();
    });
    
  } catch (err) {
    console.error('[local-runner] Error:', err);
    await mongod.stop();
    process.exit(1);
  }
})();
