import { prisma } from '../../../config/database';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Cascade delete ensures test cases and submissions are cleared
  await prisma.problem.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing database tables');

  const problemsData = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly* one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

### Example 1:
**Input:** nums = [2,7,11,15], target = 9  
**Output:** [0,1]  
**Explanation:** Because nums[0] + nums[1] == 9, we return [0, 1].`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function twoSum(nums, target) {
  // Write your code here
}`,
      solutionCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      tags: ['arrays', 'hash-map'],
      isPublished: true,
      order: 1,
      testCases: {
        create: [
          { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]', isHidden: false, order: 1 },
          { input: '[[3,2,4], 6]', expectedOutput: '[1,2]', isHidden: false, order: 2 },
          { input: '[[3,3], 6]', expectedOutput: '[0,1]', isHidden: false, order: 3 },
          { input: '[[1,5,9,10,15], 25]', expectedOutput: '[3,4]', isHidden: true, order: 4 },
          { input: '[[-1,-2,-3,-4,-5], -8]', expectedOutput: '[2,4]', isHidden: true, order: 5 },
        ],
      },
    },
    {
      title: 'Reverse a String',
      slug: 'reverse-a-string',
      description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.

### Example 1:
**Input:** s = ["h","e","l","l","o"]  
**Output:** ["o","l","l","e","h"]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function reverseString(s) {
  // Write your code here
  return s;
}`,
      solutionCode: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  return s;
}`,
      tags: ['strings', 'two-pointers'],
      isPublished: true,
      order: 2,
      testCases: {
        create: [
          {
            input: '[["h","e","l","l","o"]]',
            expectedOutput: '["o","l","l","e","h"]',
            isHidden: false,
            order: 1,
          },
          {
            input: '[["H","a","n","n","a","h"]]',
            expectedOutput: '["h","a","n","n","a","H"]',
            isHidden: false,
            order: 2,
          },
          { input: '[["a"]]', expectedOutput: '["a"]', isHidden: true, order: 3 },
          {
            input: '[["t","e","s","t"]]',
            expectedOutput: '["t","s","e","t"]',
            isHidden: true,
            order: 4,
          },
        ],
      },
    },
    {
      title: 'Palindrome Checker',
      slug: 'palindrome-checker',
      description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a palindrome, or \`false\` otherwise*.

### Example 1:
**Input:** s = "A man, a plan, a canal: Panama"  
**Output:** true  
**Explanation:** "amanaplanacanalpanama" is a palindrome.`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function isPalindrome(s) {
  // Write your code here
}`,
      solutionCode: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
      tags: ['strings'],
      isPublished: true,
      order: 3,
      testCases: {
        create: [
          {
            input: '["A man, a plan, a canal: Panama"]',
            expectedOutput: 'true',
            isHidden: false,
            order: 1,
          },
          { input: '["race a car"]', expectedOutput: 'false', isHidden: false, order: 2 },
          { input: '[" "]', expectedOutput: 'true', isHidden: true, order: 3 },
          { input: '["0P"]', expectedOutput: 'false', isHidden: true, order: 4 },
        ],
      },
    },
    {
      title: 'Fibonacci Generator',
      slug: 'fibonacci-generator',
      description: `Write a generator function that yields the infinite Fibonacci sequence.

The sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.

### Example:
\`\`\`javascript
const gen = fibonacciGenerator();
gen.next().value; // 0
gen.next().value; // 1
gen.next().value; // 1
gen.next().value; // 2
\`\`\`  
Write a function \`getFibonacciArray(n)\` that returns the first \`n\` Fibonacci numbers using a generator.`,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function* fibonacciGenerator() {
  // Write your generator here
}

function getFibonacciArray(n) {
  const gen = fibonacciGenerator();
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(gen.next().value);
  }
  return result;
}`,
      solutionCode: `function* fibonacciGenerator() {
  let prev = 0;
  let curr = 1;
  yield prev;
  yield curr;
  while (true) {
    const next = prev + curr;
    yield next;
    prev = curr;
    curr = next;
  }
}

function getFibonacciArray(n) {
  if (n <= 0) return [];
  const gen = fibonacciGenerator();
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(gen.next().value);
  }
  return result;
}`,
      tags: ['generators', 'sequences'],
      isPublished: true,
      order: 4,
      testCases: {
        create: [
          { input: '[5]', expectedOutput: '[0,1,1,2,3]', isHidden: false, order: 1 },
          { input: '[1]', expectedOutput: '[0]', isHidden: false, order: 2 },
          { input: '[10]', expectedOutput: '[0,1,1,2,3,5,8,13,21,34]', isHidden: true, order: 3 },
        ],
      },
    },
    {
      title: 'FizzBuzz',
      slug: 'fizz-buzz',
      description: `Given an integer \`n\`, return *a string array \`answer\` (1-indexed) where*:

* \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
* \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
* \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
* \`answer[i] == i\` (as a string) if none of the above conditions are true.

### Example 1:
**Input:** n = 3  
**Output:** ["1","2","Fizz"]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function fizzBuzz(n) {
  // Write your code here
}`,
      solutionCode: `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      result.push('FizzBuzz');
    } else if (i % 3 === 0) {
      result.push('Fizz');
    } else if (i % 5 === 0) {
      result.push('Buzz');
    } else {
      result.push(i.toString());
    }
  }
  return result;
}`,
      tags: ['loops', 'math'],
      isPublished: true,
      order: 5,
      testCases: {
        create: [
          { input: '[3]', expectedOutput: '["1","2","Fizz"]', isHidden: false, order: 1 },
          {
            input: '[5]',
            expectedOutput: '["1","2","Fizz","4","Buzz"]',
            isHidden: false,
            order: 2,
          },
          {
            input: '[15]',
            expectedOutput:
              '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]',
            isHidden: true,
            order: 3,
          },
        ],
      },
    },
    {
      title: 'Chunk Array',
      slug: 'chunk-array',
      description: `Given an array \`arr\` and a chunk size \`size\`, return a **chunked** array.

A chunked array contains the original elements broken into sub-arrays of length \`size\`. The last sub-array may be shorter than \`size\` if the array length is not evenly divisible.

You must not modify the original array.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5], size = 2  
**Output:** [[1, 2], [3, 4], [5]]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function chunk(arr, size) {
  // Write your code here
}`,
      solutionCode: `function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`,
      tags: ['arrays'],
      isPublished: true,
      order: 6,
      testCases: {
        create: [
          {
            input: '[[1, 2, 3, 4, 5], 2]',
            expectedOutput: '[[1,2],[3,4],[5]]',
            isHidden: false,
            order: 1,
          },
          {
            input: '[[1, 9, 6, 3, 2], 3]',
            expectedOutput: '[[1,9,6],[3,2]]',
            isHidden: false,
            order: 2,
          },
          { input: '[[], 1]', expectedOutput: '[]', isHidden: true, order: 3 },
        ],
      },
    },
    {
      title: 'Flatten Array',
      slug: 'flatten-array',
      description: `Given a multi-dimensional array \`arr\` and a depth \`n\`, return a **flattened** array.

A multi-dimensional array is a recursive data structure containing integers or other multi-dimensional arrays. A flattened array contains the elements in their original order, with all sub-arrays flattened up to depth \`n\`.

If \`n\` is not provided, flatten the array completely.

### Example 1:
**Input:** arr = [1, 2, 3, [4, 5, [6, 7]], 8, [9]], n = 1  
**Output:** [1, 2, 3, 4, 5, [6, 7], 8, 9]`,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function flat(arr, n) {
  // Write your code here
}`,
      solutionCode: `function flat(arr, n) {
  const depth = n === undefined ? Infinity : n;
  if (depth <= 0) return arr.slice();
  
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flat(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
      tags: ['arrays', 'recursion'],
      isPublished: true,
      order: 7,
      testCases: {
        create: [
          {
            input: '[[1, 2, 3, [4, 5, [6, 7]], 8, [9]], 1]',
            expectedOutput: '[1,2,3,4,5,[6,7],8,9]',
            isHidden: false,
            order: 1,
          },
          {
            input: '[[1, 2, 3, [4, 5, [6, 7]], 8, [9]], 2]',
            expectedOutput: '[1,2,3,4,5,6,7,8,9]',
            isHidden: false,
            order: 2,
          },
          {
            input: '[[[1, [2, [3, [4]]]]]]',
            expectedOutput: '[1,2,3,4]',
            isHidden: true,
            order: 3,
          },
        ],
      },
    },
    {
      title: 'Debounce Implementation',
      slug: 'debounce-implementation',
      description: `Implement a \`debounce\` function. A debounced function delays invoking the original function until after \`wait\` milliseconds have elapsed since the last time the debounced function was invoked.

The debounced function should also expose a \`cancel\` method to abort delayed executions.

### Example:
\`\`\`javascript
let counter = 0;
const increment = () => counter++;
const debounced = debounce(increment, 100);

debounced();
debounced();
// Wait 100ms... counter === 1
\`\`\`  
*Note: Due to asynchronous nature, test cases will execute mock timers to verify debounce.*`,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function debounce(fn, wait) {
  // Write your code here
}`,
      solutionCode: `function debounce(fn, wait) {
  let timeoutId = null;
  
  function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, wait);
  }
  
  debounced.cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}`,
      tags: ['functions', 'async'],
      isPublished: true,
      order: 8,
      testCases: {
        create: [
          {
            input: '["debounce-test-simple"]',
            expectedOutput: '"passed"',
            isHidden: false,
            order: 1,
          },
        ],
      },
    },
    {
      title: 'Deep Clone Object',
      slug: 'deep-clone-object',
      description: `Write a function \`deepClone(obj)\` that returns a deep copy of the passed object.

The object can contain nested objects, arrays, strings, numbers, booleans, null, and Date instances. It must handle circular references correctly without entering an infinite loop.

### Example:
\`\`\`javascript
const original = { a: 1, b: { c: 2 } };
const clone = deepClone(original);
clone.b.c = 3;
original.b.c; // 2
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function deepClone(obj, cache = new WeakMap()) {
  // Write your code here
}`,
      solutionCode: `function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const clone = Array.isArray(obj) ? [] : {};
  cache.set(obj, clone);
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], cache);
    }
  }
  return clone;
}`,
      tags: ['objects', 'recursion'],
      isPublished: true,
      order: 9,
      testCases: {
        create: [
          {
            input: '[{"a":1,"b":{"c":2}}]',
            expectedOutput: '{"a":1,"b":{"c":2}}',
            isHidden: false,
            order: 1,
          },
          {
            input: '[[1,{"x":9},[2]]]',
            expectedOutput: '[1,{"x":9},[2]]',
            isHidden: false,
            order: 2,
          },
        ],
      },
    },
    {
      title: 'Event Emitter Class',
      slug: 'event-emitter-class',
      description: `Design an \`EventEmitter\` class. It should support subscribing to events, unsubscribing from events, and emitting events.

Methods:
1. \`subscribe(eventName, callback)\`: Registers callback for the event. Returns a subscription object with a \`release()\` method to unsubscribe.
2. \`emit(eventName, args)\`: Calls all registered callbacks for the event with the arguments array. Returns an array of execution results.

### Example:
\`\`\`javascript
const emitter = new EventEmitter();
const sub = emitter.subscribe('click', (x) => x * 2);
emitter.emit('click', [5]); // [10]
sub.release();
emitter.emit('click', [5]); // []
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `class EventEmitter {
  subscribe(eventName, callback) {
    // Write subscription logic
    return {
      release: () => {}
    };
  }
  
  emit(eventName, args = []) {
    // Write emit logic
  }
}`,
      solutionCode: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  subscribe(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    const callbacks = this.events.get(eventName);
    callbacks.push(callback);

    return {
      release: () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          this.events.delete(eventName);
        }
      }
    };
  }
  
  emit(eventName, args = []) {
    if (!this.events.has(eventName)) return [];
    const callbacks = this.events.get(eventName);
    return callbacks.map((cb) => cb(...args));
  }
}`,
      tags: ['classes', 'events'],
      isPublished: true,
      order: 10,
      testCases: {
        create: [
          {
            input: '["emitter-test-simple"]',
            expectedOutput: '"passed"',
            isHidden: false,
            order: 1,
          },
        ],
      },
    },
    {
      title: 'Promise.all Polyfill',
      slug: 'promise-all-polyfill',
      description: `Implement the \`promiseAll\` function which mimics \`Promise.all\`.

The function takes an array of Promises and returns a single Promise that resolves when all input promises have resolved, or rejects immediately when any input promise rejects.

### Example:
\`\`\`javascript
const p1 = Promise.resolve(3);
const p2 = 42;
const p3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

promiseAll([p1, p2, p3]).then(values => console.log(values)); // [3, 42, 'foo']
\`\`\``,
      difficulty: 'HARD',
      category: 'JAVASCRIPT',
      starterCode: `function promiseAll(promises) {
  // Write your polyfill here
}`,
      solutionCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Arguments must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve([]);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          results[index] = val;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}`,
      tags: ['promises', 'async'],
      isPublished: true,
      order: 11,
      testCases: {
        create: [
          {
            input: '["promise-all-simple"]',
            expectedOutput: '"passed"',
            isHidden: false,
            order: 1,
          },
        ],
      },
    },
    {
      title: 'Memoize Function',
      slug: 'memoize-function',
      description: `Write a function \`memoize(fn)\` that returns a memoized version of \`fn\`.

A memoized function caches execution results based on its argument list. If called again with the same arguments, it returns the cached result without executing the function.

Assume arguments are serializable (e.g. primitive values or JSON objects).

### Example:
\`\`\`javascript
let callCount = 0;
const add = (a, b) => {
  callCount++;
  return a + b;
};
const memoizedAdd = memoize(add);
memoizedAdd(1, 2); // 3
memoizedAdd(1, 2); // 3 (returns cached)
callCount; // 1
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function memoize(fn) {
  // Write your code here
}`,
      solutionCode: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
      tags: ['functions', 'caching'],
      isPublished: true,
      order: 12,
      testCases: {
        create: [
          {
            input: '["memoize-test-simple"]',
            expectedOutput: '"passed"',
            isHidden: false,
            order: 1,
          },
        ],
      },
    },
    {
      title: 'Currying Function',
      slug: 'currying-function',
      description: `Implement the \`curry\` function. Currying is the technique of converting a function that takes multiple arguments into a sequence of functions that each take a single argument.

It should allow the curried function to be called either with single arguments sequentially, or with multiple arguments at once.

### Example:
\`\`\`javascript
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);

curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6
curriedSum(1, 2, 3); // 6
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'JAVASCRIPT',
      starterCode: `function curry(fn) {
  // Write your code here
}`,
      solutionCode: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}`,
      tags: ['functions'],
      isPublished: true,
      order: 13,
      testCases: {
        create: [
          { input: '["curry-test-simple"]', expectedOutput: '"passed"', isHidden: false, order: 1 },
        ],
      },
    },
    {
      title: 'Merge Sorted Arrays',
      slug: 'merge-sorted-arrays',
      description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order, and two integers \`m\` and \`n\`, representing the number of elements in \`nums1\` and \`nums2\` respectively.

Merge \`nums1\` and \`nums2\` into a single array sorted in non-decreasing order.

The modification must be in-place. The array \`nums1\` has a length of \`m + n\`, where the first \`m\` elements denote the elements that should be merged, and the last \`n\` elements are set to 0 and should be ignored.

### Example 1:
**Input:** nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3  
**Output:** [1,2,2,3,5,6]`,
      difficulty: 'EASY',
      category: 'JAVASCRIPT',
      starterCode: `function merge(nums1, m, nums2, n) {
  // Write your code here
  return nums1;
}`,
      solutionCode: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;

  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }

  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
  
  return nums1;
}`,
      tags: ['arrays', 'two-pointers'],
      isPublished: true,
      order: 14,
      testCases: {
        create: [
          {
            input: '[[1,2,3,0,0,0], 3, [2,5,6], 3]',
            expectedOutput: '[1,2,2,3,5,6]',
            isHidden: false,
            order: 1,
          },
          { input: '[[1], 1, [], 0]', expectedOutput: '[1]', isHidden: false, order: 2 },
          { input: '[[0], 0, [1], 1]', expectedOutput: '[1]', isHidden: true, order: 3 },
        ],
      },
    },
    {
      title: 'TypeScript Type Utility: Omit',
      slug: 'ts-omit-utility',
      description: `In TypeScript, write a generic type utility \`MyOmit<T, K>\` that constructs a type by picking all properties from \`T\` and then removing \`K\`.

This is a types-only question, but represented as a verification script.

### Example:
\`\`\`typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}
type TodoPreview = MyOmit<Todo, 'description' | 'completed'>
// Expected: { title: string }
\`\`\``,
      difficulty: 'MEDIUM',
      category: 'TYPESCRIPT',
      starterCode: `// Write your TypeScript helper here (represented as standard JS checker)
function verifyOmit() {
  return "passed";
}`,
      solutionCode: `function verifyOmit() {
  return "passed";
}`,
      tags: ['types', 'utility'],
      isPublished: true,
      order: 15,
      testCases: {
        create: [{ input: '[]', expectedOutput: '"passed"', isHidden: false, order: 1 }],
      },
    },
    {
      title: 'Hash a String with SHA-256',
      slug: 'hash-string-sha256',
      description: `Use Node.js's built-in \`crypto\` module to generate a SHA-256 hash of a given text.

Return the hash as a hexadecimal string.

### Example:
**Input:** text = "hello"  
**Output:** "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"`,
      difficulty: 'EASY',
      category: 'NODEJS',
      starterCode: `const crypto = require('crypto');

function hashSHA256(text) {
  // Write your code here
}`,
      solutionCode: `const crypto = require('crypto');

function hashSHA256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}`,
      tags: ['crypto', 'security'],
      isPublished: true,
      order: 16,
      testCases: {
        create: [
          {
            input: '["hello"]',
            expectedOutput: '"2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"',
            isHidden: false,
            order: 1,
          },
          {
            input: '[""]',
            expectedOutput: '"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"',
            isHidden: false,
            order: 2,
          },
          {
            input: '["interview-prep"]',
            expectedOutput: '"226bc8f15d74944fa12419c8d57577317e08929e0618037305988e404b901594"',
            isHidden: true,
            order: 3,
          },
        ],
      },
    },
    {
      title: 'Parse URL Query Parameters',
      slug: 'parse-url-query-params',
      description: `Write a function that parses a URL string and returns its query parameters as a key-value object.

You can use Node's built-in \`URL\` API.

### Example:
**Input:** urlString = "https://example.com?name=Alice&age=25"  
**Output:** { "name": "Alice", "age": "25" }`,
      difficulty: 'EASY',
      category: 'NODEJS',
      starterCode: `function parseQueryParams(urlString) {
  // Write your code here
}`,
      solutionCode: `function parseQueryParams(urlString) {
  const url = new URL(urlString);
  const params = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}`,
      tags: ['url', 'parsing'],
      isPublished: true,
      order: 17,
      testCases: {
        create: [
          {
            input: '["https://example.com?name=Alice&age=25"]',
            expectedOutput: '{"name":"Alice","age":"25"}',
            isHidden: false,
            order: 1,
          },
          {
            input: '["https://google.com/search?q=nodejs&hl=en"]',
            expectedOutput: '{"q":"nodejs","hl":"en"}',
            isHidden: false,
            order: 2,
          },
          {
            input: '["https://api.github.com/users"]',
            expectedOutput: '{}',
            isHidden: true,
            order: 3,
          },
        ],
      },
    },
    {
      title: 'Filter Engineering Employees',
      slug: 'filter-engineering-employees',
      description: `We have a table \`employees\` with columns \`id\`, \`name\`, \`department\`, and \`salary\`.
      
Write a query to select the \`name\` and \`salary\` of all employees in the 'Engineering' department, sorted by \`salary\` in descending order.

### Example:
**Input:**
\`employees\` table:
| id | name    | department  | salary |
|----|---------|-------------|--------|
| 1  | Alice   | Engineering | 90000  |
| 2  | Bob     | Sales       | 60000  |
| 3  | Charlie | Engineering | 95000  |

**Output:**
| name    | salary |
|---------|--------|
| Charlie | 95000  |
| Alice   | 90000  |`,
      difficulty: 'EASY',
      category: 'SQL',
      starterCode: `-- Write your SQL query here
`,
      solutionCode: `SELECT name, salary FROM employees WHERE department = 'Engineering' ORDER BY salary DESC;`,
      tags: ['sql', 'basic'],
      isPublished: true,
      order: 18,
      testCases: {
        create: [
          {
            input:
              "\"CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER); INSERT INTO employees VALUES (1, \\'Alice\\', \\'Engineering\\', 90000); INSERT INTO employees VALUES (2, \\'Bob\\', \\'Sales\\', 60000); INSERT INTO employees VALUES (3, \\'Charlie\\', \\'Engineering\\', 95000);\"",
            expectedOutput: '[{"name":"Charlie","salary":95000},{"name":"Alice","salary":90000}]',
            isHidden: false,
            order: 1,
          },
          {
            input:
              "\"CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER); INSERT INTO employees VALUES (1, \\'Eve\\', \\'Engineering\\', 80000); INSERT INTO employees VALUES (2, \\'Dave\\', \\'Marketing\\', 70000);\"",
            expectedOutput: '[{"name":"Eve","salary":80000}]',
            isHidden: true,
            order: 2,
          },
        ],
      },
    },
    {
      title: 'User Total Order Amount',
      slug: 'user-total-order-amount',
      description: `We have two tables: \`users\` (with \`id\`, \`name\`) and \`orders\` (with \`id\`, \`user_id\`, \`amount\`).
      
Write a query to find the \`name\` of each user and the total sum of their order amounts as \`total_amount\`.
Only include users who have made at least one order.
Sort the results by \`total_amount\` in descending order.

### Example:
**Input:**
\`users\` table:
| id | name  |
|----|-------|
| 1  | Alice |
| 2  | Bob   |

\`orders\` table:
| id  | user_id | amount |
|-----|---------|--------|
| 101 | 1       | 250    |
| 102 | 2       | 100    |
| 103 | 1       | 150    |

**Output:**
| name  | total_amount |
|-------|--------------|
| Alice | 400          |
| Bob   | 100          |`,
      difficulty: 'EASY',
      category: 'SQL',
      starterCode: `-- Write your SQL query here
`,
      solutionCode: `SELECT u.name, SUM(o.amount) AS total_amount FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name ORDER BY total_amount DESC;`,
      tags: ['sql', 'join'],
      isPublished: true,
      order: 19,
      testCases: {
        create: [
          {
            input:
              "\"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER); INSERT INTO users VALUES (1, \\'Alice\\'); INSERT INTO users VALUES (2, \\'Bob\\'); INSERT INTO orders VALUES (101, 1, 250); INSERT INTO orders VALUES (102, 2, 100); INSERT INTO orders VALUES (103, 1, 150);\"",
            expectedOutput:
              '[{"name":"Alice","total_amount":400},{"name":"Bob","total_amount":100}]',
            isHidden: false,
            order: 1,
          },
          {
            input:
              '"CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER); INSERT INTO users VALUES (1, \\\'Charlie\\\'); INSERT INTO orders VALUES (104, 3, 300);"',
            expectedOutput: '[]',
            isHidden: true,
            order: 2,
          },
        ],
      },
    },
    {
      title: 'React Todo Reducer',
      slug: 'react-todo-reducer',
      description: `Write a reducer function \`todoReducer\` that manages a todo list state in a React application.
      
The state is an array of todo objects: \`{ id: number, text: string, completed: boolean }\`.

The reducer must handle three actions:
1. \`{ type: 'ADD', payload: { id: number, text: string } }\`: Adds a new todo to the end of the state with \`completed: false\`.
2. \`{ type: 'TOGGLE', payload: { id: number } }\`: Toggles the \`completed\` status of the todo with the given \`id\`.
3. \`{ type: 'DELETE', payload: { id: number } }\`: Deletes the todo with the given \`id\`.

If the action type is unknown, return the current state.

### Example:
**Input:** state = [], action = { type: 'ADD', payload: { id: 1, text: 'Learn React' } }  
**Output:** [{ id: 1, text: 'Learn React', completed: false }]`,
      difficulty: 'EASY',
      category: 'REACT',
      starterCode: `function todoReducer(state, action) {
  // Write your code here
}`,
      solutionCode: `function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: action.payload.id, text: action.payload.text, completed: false }];
    case 'TOGGLE':
      return state.map(todo => todo.id === action.payload.id ? { ...todo, completed: !todo.completed } : todo);
    case 'DELETE':
      return state.filter(todo => todo.id !== action.payload.id);
    default:
      return state;
  }
}`,
      tags: ['react', 'reducer', 'state'],
      isPublished: true,
      order: 20,
      testCases: {
        create: [
          {
            input: '[[], {"type": "ADD", "payload": {"id": 1, "text": "Learn React"}}]',
            expectedOutput: '[{"id": 1, "text": "Learn React", "completed": false}]',
            isHidden: false,
            order: 1,
          },
          {
            input:
              '[[{"id": 1, "text": "Learn React", "completed": false}], {"type": "TOGGLE", "payload": {"id": 1}}]',
            expectedOutput: '[{"id": 1, "text": "Learn React", "completed": true}]',
            isHidden: false,
            order: 2,
          },
          {
            input:
              '[[{"id": 1, "text": "Learn React", "completed": false}], {"type": "DELETE", "payload": {"id": 1}}]',
            expectedOutput: '[]',
            isHidden: true,
            order: 3,
          },
        ],
      },
    },
    {
      title: 'React Wizard Derived State',
      slug: 'react-wizard-derived-state',
      description: `In forms with multiple steps (wizards), state is often derived from the list of steps, the current step index, and user answers.

Write a function \`deriveWizardState(steps, currentStepIndex, formAnswers)\` that returns an object containing derived states:
- \`canGoNext\`: boolean, \`true\` if all fields listed in \`requiredFields\` of the current step are present in \`formAnswers\` (i.e. not undefined, null, or empty string \`""\`).
- \`canGoBack\`: boolean, \`true\` if \`currentStepIndex > 0\`.
- \`progress\`: integer, from 0 to 100 representing the percentage of steps where all required fields have been completed.
- \`isLastStep\`: boolean, \`true\` if the user is on the final step.

### Example:
**Input:** 
\`steps\` = [{ title: 'Step 1', requiredFields: ['email'] }, { title: 'Step 2', requiredFields: ['password'] }]  
\`currentStepIndex\` = 0  
\`formAnswers\` = { email: 'user@test.com' }

**Output:**
\`{ canGoNext: true, canGoBack: false, progress: 50, isLastStep: false }\``,
      difficulty: 'MEDIUM',
      category: 'REACT',
      starterCode: `function deriveWizardState(steps, currentStepIndex, formAnswers) {
  // Write your code here
}`,
      solutionCode: `function deriveWizardState(steps, currentStepIndex, formAnswers) {
  const currentStep = steps[currentStepIndex];
  const isFieldFilled = (field) => {
    const val = formAnswers[field];
    return val !== undefined && val !== null && val !== '';
  };
  const canGoNext = currentStep.requiredFields.every(isFieldFilled);
  const canGoBack = currentStepIndex > 0;
  
  const completedSteps = steps.filter(step => 
    step.requiredFields.every(isFieldFilled)
  ).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  
  const isLastStep = currentStepIndex === steps.length - 1;
  
  return { canGoNext, canGoBack, progress, isLastStep };
}`,
      tags: ['react', 'state', 'derived-state'],
      isPublished: true,
      order: 21,
      testCases: {
        create: [
          {
            input:
              '[[{"title": "Step 1", "requiredFields": ["email"]}, {"title": "Step 2", "requiredFields": ["password"]}], 0, {"email": "user@test.com"}]',
            expectedOutput: '{"canGoNext":true,"canGoBack":false,"progress":50,"isLastStep":false}',
            isHidden: false,
            order: 1,
          },
          {
            input:
              '[[{"title": "Step 1", "requiredFields": ["email"]}, {"title": "Step 2", "requiredFields": ["password"]}], 1, {"email": "user@test.com"}]',
            expectedOutput: '{"canGoNext":false,"canGoBack":true,"progress":50,"isLastStep":true}',
            isHidden: true,
            order: 2,
          },
        ],
      },
    },
    {
      title: 'Active Users Query',
      slug: 'active-users-query',
      description: `Write an asynchronous function \`getActiveUsers(db)\` that queries a MongoDB \`users\` collection.
      
Return an array of documents for users where \`status\` is 'active'. Only return the \`name\` and \`email\` fields (and exclude the \`_id\` field). Sort the results by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
| _id | name    | email             | status   |
|-----|---------|-------------------|----------|
| 1   | Alice   | alice@test.com    | active   |
| 2   | Bob     | bob@test.com      | inactive |
| 3   | Charlie | charlie@test.com  | active   |

**Output:**
\`[ { "name": "Alice", "email": "alice@test.com" }, { "name": "Charlie", "email": "charlie@test.com" } ]\``,
      difficulty: 'EASY',
      category: 'MONGODB',
      starterCode: `async function getActiveUsers(db) {
  // Write your code here
}`,
      solutionCode: `async function getActiveUsers(db) {
  return await db.collection('users')
    .find({ status: 'active' }, { projection: { _id: 0, name: 1, email: 1 } })
    .sort({ name: 1 })
    .toArray();
}`,
      tags: ['mongodb', 'find'],
      isPublished: true,
      order: 22,
      testCases: {
        create: [
          {
            input:
              '{"users":[{"_id":1,"name":"Alice","email":"alice@test.com","status":"active"},{"_id":2,"name":"Bob","email":"bob@test.com","status":"inactive"},{"_id":3,"name":"Charlie","email":"charlie@test.com","status":"active"}]}',
            expectedOutput:
              '[{"name":"Alice","email":"alice@test.com"},{"name":"Charlie","email":"charlie@test.com"}]',
            isHidden: false,
            order: 1,
          },
          {
            input:
              '{"users":[{"_id":1,"name":"Dave","email":"dave@test.com","status":"inactive"}]}',
            expectedOutput: '[]',
            isHidden: true,
            order: 2,
          },
        ],
      },
    },
    {
      title: 'Total Revenue by Product',
      slug: 'total-revenue-by-product',
      description: `Write an asynchronous function \`getSalesByProduct(db)\` that queries a MongoDB \`orders\` collection.
      
Use an aggregation pipeline to:
1. Group orders by \`product\`
2. Sum up the total revenue (\`price\` multiplied by \`quantity\`) as \`totalRevenue\`
3. Sort the results by \`totalRevenue\` in descending order.

### Example:
**Input:**
\`orders\` collection:
| _id | product  | price | quantity |
|-----|----------|-------|----------|
| 101 | Laptop   | 1000  | 1        |
| 102 | Mouse    | 25    | 3        |
| 103 | Laptop   | 1000  | 2        |
| 104 | Keyboard | 50    | 1        |

**Output:**
\`[ { "_id": "Laptop", "totalRevenue": 3000 }, { "_id": "Mouse", "totalRevenue": 75 }, { "_id": "Keyboard", "totalRevenue": 50 } ]\``,
      difficulty: 'MEDIUM',
      category: 'MONGODB',
      starterCode: `async function getSalesByProduct(db) {
  // Write your code here
}`,
      solutionCode: `async function getSalesByProduct(db) {
  return await db.collection('orders').aggregate([
    {
      $group: {
        _id: '$product',
        totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } }
      }
    },
    {
      $sort: { totalRevenue: -1 }
    }
  ]).toArray();
}`,
      tags: ['mongodb', 'aggregation'],
      isPublished: true,
      order: 23,
      testCases: {
        create: [
          {
            input:
              '{"orders":[{"_id":101,"product":"Laptop","price":1000,"quantity":1},{"_id":102,"product":"Mouse","price":25,"quantity":3},{"_id":103,"product":"Laptop","price":1000,"quantity":2},{"_id":104,"product":"Keyboard","price":50,"quantity":1}]}',
            expectedOutput:
              '[{"_id":"Laptop","totalRevenue":3000},{"_id":"Mouse","totalRevenue":75},{"_id":"Keyboard","totalRevenue":50}]',
            isHidden: false,
            order: 1,
          },
          {
            input: '{"orders":[]}',
            expectedOutput: '[]',
            isHidden: true,
            order: 2,
          },
        ],
      },
    },
  ];

  console.log(`🚀 Seeding ${problemsData.length} problems...`);

  for (const problem of problemsData) {
    const created = await prisma.problem.create({
      data: problem as any,
    });
    console.log(`✅ Seeded problem: ${created.title} (slug: ${created.slug})`);
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
