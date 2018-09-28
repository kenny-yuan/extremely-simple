function fx(x) { return x * x; }
function dx(x) { return 2 * x; }

function sqrt(x) {
  const EPS = 1e-11;
  let guess = x / 10; // I bet you know 0x5f3759df :)
  let diff = fx(guess) - x; // diff is delta-Y
  let iter = 1;
  while (Math.abs(diff) > EPS) {
    guess -= diff / dx(guess); // move delta-X
    diff = fx(guess) - x;
    console.log(`Iteration ${iter++}: Guess ${guess}, Diff ${diff}`);
  }
  console.log(`OK.  sqrt(${x}) = ${guess}`);
  console.log(`Math.sqrt(${x}) = ${Math.sqrt(x)}`);
  return guess;
}

sqrt(Math.random() * 1000);


