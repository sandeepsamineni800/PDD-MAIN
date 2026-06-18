const autocannon = require('autocannon');

async function runLoadTest() {
  console.log('Starting Baseline/Load Testing...');
  console.log('Configuration: 100 concurrent users (connections), 1 minute duration');
  
  const instance = autocannon({
    url: 'http://localhost:3000',
    connections: 100, // 100 virtual users
    duration: 60, // 1 minute
    pipelining: 1,
    title: 'Baseline Load Test',
    requests: [
      {
        method: 'GET',
        path: '/'
      },
      {
        method: 'GET',
        path: '/api/auth/me'
      }
    ]
  }, (err, result) => {
    if (err) {
      console.error('Error running load test:', err);
      process.exit(1);
    }
    
    console.log('\n=== Load Test Results ===');
    console.log(`Requests per second (RPS): ${result.requests.average}`);
    console.log(`Total Requests Sent: ${result.requests.sent}`);
    console.log('\nResponse Time (Latency):');
    console.log(`  Average: ${result.latency.average} ms`);
    console.log(`  Min:     ${result.latency.min} ms`);
    console.log(`  Max:     ${result.latency.max} ms`);
    console.log('=========================\n');
    
    if (result.errors > 0 || result.timeouts > 0) {
      console.log(`Warning: Load test encountered ${result.errors} errors and ${result.timeouts} timeouts.`);
    }
    
    // Exit cleanly
    process.exit(0);
  });

  // Track progress
  autocannon.track(instance, { renderProgressBar: false });
}

runLoadTest();
