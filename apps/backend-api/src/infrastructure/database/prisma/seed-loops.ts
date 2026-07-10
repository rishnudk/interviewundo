import { prisma } from '../../../config/database';

interface TestCaseSeed {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
}

interface ProblemSeed {
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: 'JAVASCRIPT';
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

const loopProblems: ProblemSeed[] = [
  {
    title: 'Print Even Numbers',
    slug: 'print-even-numbers',
    description: `Write a function \`getEvenNumbers(n)\` that returns an array of all even integers from \`2\` up to \`n\` (inclusive) using a loop.

### Example 1:
**Input:** n = 10  
**Output:** [ 2, 4, 6, 8, 10 ]  

### Constraints:
- 1 <= n <= 10^3`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function getEvenNumbers(n) {
  // Write your code here
}`,
    solutionCode: `function getEvenNumbers(n) {
  const evens = [];
  for (let i = 2; i <= n; i += 2) {
    evens.push(i);
  }
  return evens;
}`,
    order: 501,
    isPublished: true,
    testCases: [
      { input: '[10]', expectedOutput: '[2,4,6,8,10]', isHidden: false, order: 1 },
      { input: '[5]', expectedOutput: '[2,4]', isHidden: false, order: 2 },
      { input: '[1]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[2]', expectedOutput: '[2]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Print Even Numbers in Reverse',
    slug: 'print-even-numbers-reverse',
    description: `Write a function \`getEvenNumbersReverse(n)\` that returns an array of all even integers from \`n\` down to \`2\` (inclusive) in descending order.

### Example 1:
**Input:** n = 10  
**Output:** [ 10, 8, 6, 4, 2 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function getEvenNumbersReverse(n) {
  // Write your code here
}`,
    solutionCode: `function getEvenNumbersReverse(n) {
  const evens = [];
  let start = n % 2 === 0 ? n : n - 1;
  for (let i = start; i >= 2; i -= 2) {
    evens.push(i);
  }
  return evens;
}`,
    order: 502,
    isPublished: true,
    testCases: [
      { input: '[10]', expectedOutput: '[10,8,6,4,2]', isHidden: false, order: 1 },
      { input: '[5]', expectedOutput: '[4,2]', isHidden: false, order: 2 },
      { input: '[1]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[2]', expectedOutput: '[2]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum from 1 to N',
    slug: 'sum-1-to-n',
    description: `Write a function \`sumToN(n)\` that returns the sum of all integers from 1 to \`n\` (inclusive) using a loop.

### Example 1:
**Input:** n = 5  
**Output:** 15  
**Explanation:** 1 + 2 + 3 + 4 + 5 = 15.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function sumToN(n) {
  // Write your code here
}`,
    solutionCode: `function sumToN(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}`,
    order: 503,
    isPublished: true,
    testCases: [
      { input: '[5]', expectedOutput: '15', isHidden: false, order: 1 },
      { input: '[1]', expectedOutput: '1', isHidden: false, order: 2 },
      { input: '[100]', expectedOutput: '5050', isHidden: true, order: 3 },
      { input: '[0]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sort Array Using While Loop',
    slug: 'sort-array-using-while',
    description: `Implement a sorting algorithm using a \`while\` loop. The function \`sortArrayWhile(arr)\` should modify the input array in-place and return it sorted in ascending order. Do not use built-in \`Array.prototype.sort()\`.

### Example 1:
**Input:** arr = [ 5, 3, 8, 2 ]  
**Output:** [ 2, 3, 5, 8 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function sortArrayWhile(arr) {
  // Write your code here
}`,
    solutionCode: `function sortArrayWhile(arr) {
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  }
  return arr;
}`,
    order: 504,
    isPublished: true,
    testCases: [
      { input: '[[5,3,8,2]]', expectedOutput: '[2,3,5,8]', isHidden: false, order: 1 },
      { input: '[[1]]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[4,4,2,1,3]]', expectedOutput: '[1,2,3,4,4]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse String Using While Loop',
    slug: 'reverse-string-using-while',
    description: `Write a function \`reverseStringWhile(str)\` that returns the reversed version of the input string using a \`while\` loop.

### Example 1:
**Input:** str = "hello"  
**Output:** "olleh"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops', 'strings'],
    starterCode: `function reverseStringWhile(str) {
  // Write your code here
}`,
    solutionCode: `function reverseStringWhile(str) {
  let reversed = "";
  let i = str.length - 1;
  while (i >= 0) {
    reversed += str[i];
    i--;
  }
  return reversed;
}`,
    order: 505,
    isPublished: true,
    testCases: [
      { input: '["hello"]', expectedOutput: '"olleh"', isHidden: false, order: 1 },
      { input: '[""]', expectedOutput: '""', isHidden: false, order: 2 },
      { input: '["a"]', expectedOutput: '"a"', isHidden: true, order: 3 },
      { input: '["while"]', expectedOutput: '"elihw"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Multiples Using While Loop',
    slug: 'multiples-using-while',
    description: `Write a function \`getMultiplesWhile(base, limit)\` that returns an array of positive multiples of \`base\` that are strictly less than \`limit\`, using a \`while\` loop.

### Example 1:
**Input:** base = 3, limit = 10  
**Output:** [ 3, 6, 9 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function getMultiplesWhile(base, limit) {
  // Write your code here
}`,
    solutionCode: `function getMultiplesWhile(base, limit) {
    const multiples = [];
    let current = base;
    while (current < limit) {
      multiples.push(current);
      current += base;
    }
    return multiples;
}`,
    order: 506,
    isPublished: true,
    testCases: [
      { input: '[3, 10]', expectedOutput: '[3,6,9]', isHidden: false, order: 1 },
      { input: '[5, 5]', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '[10, 100]',
        expectedOutput: '[10,20,30,40,50,60,70,80,90]',
        isHidden: true,
        order: 3,
      },
      { input: '[7, 15]', expectedOutput: '[7,14]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Basic Do-While Loop',
    slug: 'basic-do-while-loop',
    description: `Write a function \`doWhileDemo(n)\` that returns an array containing integers from \`1\` up to \`n\` using a \`do-while\` loop. Note that because a \`do-while\` loop executes at least once, calling \`doWhileDemo(0)\` should return \`[1]\`.

### Example 1:
**Input:** n = 3  
**Output:** [ 1, 2, 3 ]

### Example 2:
**Input:** n = 0  
**Output:** [ 1 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function doWhileDemo(n) {
  // Write your code here
}`,
    solutionCode: `function doWhileDemo(n) {
  const result = [];
  let i = 1;
  do {
    result.push(i);
    i++;
  } while (i <= n);
  return result;
}`,
    order: 507,
    isPublished: true,
    testCases: [
      { input: '[3]', expectedOutput: '[1,2,3]', isHidden: false, order: 1 },
      { input: '[0]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[1]', expectedOutput: '[1]', isHidden: true, order: 3 },
      { input: '[5]', expectedOutput: '[1,2,3,4,5]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Multiples of 5',
    slug: 'multiples-of-five-loop',
    description: `Write a function \`countMultiplesOfFive(start, end)\` that counts and returns how many multiples of 5 exist in the range \`[start, end]\` (inclusive) using a loop.

### Example 1:
**Input:** start = 4, end = 15  
**Output:** 3  
**Explanation:** 5, 10, and 15 are multiples of 5 in the range.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function countMultiplesOfFive(start, end) {
  // Write your code here
}`,
    solutionCode: `function countMultiplesOfFive(start, end) {
  let count = 0;
  for (let i = start; i <= end; i++) {
    if (i % 5 === 0) count++;
  }
  return count;
}`,
    order: 508,
    isPublished: true,
    testCases: [
      { input: '[4, 15]', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '[1, 3]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[0, 5]', expectedOutput: '2', isHidden: true, order: 3 },
      { input: '[-10, 10]', expectedOutput: '5', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Multiplication Table',
    slug: 'multiplication-table-array',
    description: `Write a function \`getMultiplicationTable(n)\` that returns an array representing the multiplication table of \`n\` from 1 to 10 (i.e. \`[n*1, n*2, ..., n*10]\`) using a loop.

### Example 1:
**Input:** n = 5  
**Output:** [ 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function getMultiplicationTable(n) {
  // Write your code here
}`,
    solutionCode: `function getMultiplicationTable(n) {
  const table = [];
  for (let i = 1; i <= 10; i++) {
    table.push(n * i);
  }
  return table;
}`,
    order: 509,
    isPublished: true,
    testCases: [
      { input: '[5]', expectedOutput: '[5,10,15,20,25,30,35,40,45,50]', isHidden: false, order: 1 },
      { input: '[1]', expectedOutput: '[1,2,3,4,5,6,7,8,9,10]', isHidden: false, order: 2 },
      { input: '[0]', expectedOutput: '[0,0,0,0,0,0,0,0,0,0]', isHidden: true, order: 3 },
      {
        input: '[-2]',
        expectedOutput: '[-2,-4,-6,-8,-10,-12,-14,-16,-18,-20]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Reverse Array Using Loop',
    slug: 'reverse-array-using-loop',
    description: `Write a function \`reverseArrayLoop(arr)\` that reverses the elements of the array in-place and returns it, using a loop. Do not use the built-in \`Array.prototype.reverse()\` method.

### Example 1:
**Input:** arr = [ 1, 2, 3, 4 ]  
**Output:** [ 4, 3, 2, 1 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops', 'arrays'],
    starterCode: `function reverseArrayLoop(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseArrayLoop(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
  }
  return arr;
}`,
    order: 510,
    isPublished: true,
    testCases: [
      { input: '[[1,2,3,4]]', expectedOutput: '[4,3,2,1]', isHidden: false, order: 1 },
      { input: '[["a","b"]]', expectedOutput: '["b","a"]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[5]]', expectedOutput: '[5]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Merge Arrays Using Loop',
    slug: 'merge-arrays-using-loop',
    description: `Write a function \`mergeArraysLoop(arr1, arr2)\` that merges two arrays together by copying elements into a new array using loops. Do not use spread operators (\`...\`) or \`Array.prototype.concat()\`.

### Example 1:
**Input:** arr1 = [ 1, 2 ], arr2 = [ 3, 4 ]  
**Output:** [ 1, 2, 3, 4 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops', 'arrays'],
    starterCode: `function mergeArraysLoop(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function mergeArraysLoop(arr1, arr2) {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i]);
  }
  for (let j = 0; j < arr2.length; j++) {
    result.push(arr2[j]);
  }
  return result;
}`,
    order: 511,
    isPublished: true,
    testCases: [
      { input: '[[1,2], [3,4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[], [1]]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[["a"], []]', expectedOutput: '["a"]', isHidden: true, order: 3 },
      { input: '[[], []]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Break and Continue Output',
    slug: 'break-and-continue-output',
    description: `Write a function \`loopControl(n)\` that loops from 1 to \`n\` (inclusive). If the current number is divisible by 5, skip it using \`continue\`. If the sum of the processed numbers (including the current number if added) exceeds 50, terminate the loop using \`break\`. Return the sum of all the processed numbers.

### Example 1:
**Input:** n = 15  
**Output:** 45  
**Explanation:** 1 + 2 + 3 + 4 + (skip 5) + 6 + 7 + 8 + 9 + (skip 10) + 11 = 62, which exceeds 50, so we break before adding 11. The sum is 1+2+3+4+6+7+8+9 = 40. Wait, 1+2+3+4+6+7+8+9 = 40. Next is 11, sum + 11 = 51 (exceeds 50), so we break. Return 40.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function loopControl(n) {
  // Write your code here
}`,
    solutionCode: `function loopControl(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    if (i % 5 === 0) continue;
    if (sum + i > 50) break;
    sum += i;
  }
  return sum;
}`,
    order: 512,
    isPublished: true,
    testCases: [
      { input: '[15]', expectedOutput: '40', isHidden: false, order: 1 },
      { input: '[5]', expectedOutput: '10', isHidden: false, order: 2 },
      { input: '[1]', expectedOutput: '1', isHidden: true, order: 3 },
      { input: '[20]', expectedOutput: '40', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Post and Pre Increment',
    slug: 'post-and-pre-increment',
    description: `Write a function \`incrementOperations(x, y)\` that performs a sequence of pre-increment and post-increment operations on variables \`x\` and \`y\`, then returns their sum.

Specifically:
1. Declare \`let a = ++x;\` (pre-increment)
2. Declare \`let b = y++;\` (post-increment)
3. Return \`a + b + x + y;\`

### Example 1:
**Input:** x = 2, y = 3  
**Output:** 13  
**Explanation:** 
- \`++x\` increments \`x\` to 3 and returns 3. So \`a = 3, x = 3\`.
- \`y++\` returns 3 and then increments \`y\` to 4. So \`b = 3, y = 4\`.
- Return \`3 + 3 + 3 + 4 = 13\`.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function incrementOperations(x, y) {
  // Write your code here
}`,
    solutionCode: `function incrementOperations(x, y) {
  let a = ++x;
  let b = y++;
  return a + b + x + y;
}`,
    order: 513,
    isPublished: true,
    testCases: [
      { input: '[2, 3]', expectedOutput: '13', isHidden: false, order: 1 },
      { input: '[0, 0]', expectedOutput: '3', isHidden: false, order: 2 },
      { input: '[-1, -1]', expectedOutput: '-1', isHidden: true, order: 3 },
      { input: '[5, 10]', expectedOutput: '33', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Increment and Decrement Demo',
    slug: 'increment-decrement-demo',
    description: `Write a function \`incDecDemo(n)\` that simulates a series of increment and decrement operations.
Initialize \`let count = n;\` and \`let result = 0;\`.
Run a loop while \`count > 0\`. In each iteration:
- If \`count\` is even, add \`count--\` to \`result\`.
- If \`count\` is odd, add \`--count\` to \`result\`.
Return \`result\`.

### Example 1:
**Input:** n = 4  
**Output:** 8  
**Explanation:** 
- Iteration 1: count = 4 (even), adds 4 to result (result=4), count becomes 3.
- Iteration 2: count = 3 (odd), decrements count to 2, adds 2 to result (result=6).
- Iteration 3: count = 2 (even), adds 2 to result (result=8), count becomes 1.
- Iteration 4: count = 1 (odd), decrements count to 0, adds 0 to result (result=8).
- Loop terminates. Return 8.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function incDecDemo(n) {
  // Write your code here
}`,
    solutionCode: `function incDecDemo(n) {
  let count = n;
  let result = 0;
  while (count > 0) {
    if (count % 2 === 0) {
      result += count--;
    } else {
      result += --count;
    }
  }
  return result;
}`,
    order: 514,
    isPublished: true,
    testCases: [
      { input: '[4]', expectedOutput: '8', isHidden: false, order: 1 },
      { input: '[3]', expectedOutput: '2', isHidden: false, order: 2 },
      { input: '[0]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '[5]', expectedOutput: '12', isHidden: true, order: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting loop problems seeding...');

  for (const problemData of loopProblems) {
    console.log(`Processing problem: ${problemData.title} (${problemData.slug})`);

    const existing = await prisma.problem.findUnique({
      where: { slug: problemData.slug },
    });

    if (existing) {
      // Clear old test cases for this problem first
      await prisma.testCase.deleteMany({
        where: { problemId: existing.id },
      });
      console.log(`🧹 Cleared existing test cases for: ${problemData.slug}`);
    }

    const problem = await prisma.problem.upsert({
      where: { slug: problemData.slug },
      update: {
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        starterCode: problemData.starterCode,
        solutionCode: problemData.solutionCode,
        tags: problemData.tags,
        order: problemData.order,
        isPublished: problemData.isPublished,
      },
      create: {
        title: problemData.title,
        slug: problemData.slug,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        starterCode: problemData.starterCode,
        solutionCode: problemData.solutionCode,
        tags: problemData.tags,
        order: problemData.order,
        isPublished: problemData.isPublished,
      },
    });

    // Create the test cases
    await prisma.testCase.createMany({
      data: problemData.testCases.map((tc) => ({
        problemId: problem.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden,
        order: tc.order,
      })),
    });

    console.log(`✅ Seeded: ${problemData.title}`);
  }

  console.log('🎉 Database seeding complete for loop problems!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
