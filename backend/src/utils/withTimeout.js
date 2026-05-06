/**
 * Wraps a promise with a timeout.
 * Rejects if the promise doesn't resolve within the specified time.
 */
const withTimeout = (promise, ms, label = "Operation") => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
};

export default withTimeout;
