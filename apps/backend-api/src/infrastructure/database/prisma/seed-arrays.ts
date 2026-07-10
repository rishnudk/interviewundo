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

const arrayProblems: ProblemSeed[] = [
  {
    title: 'Average of Even Numbers',
    slug: 'average-of-even-numbers',
    description: `Given an array of numbers, return the average of all even numbers. If there are no even numbers, return 0.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5, 6]  
**Output:** 4  
**Explanation:** The even numbers are 2, 4, and 6. Their average is (2 + 4 + 6) / 3 = 4.

### Example 2:
**Input:** nums = [1, 3, 5]  
**Output:** 0  
**Explanation:** There are no even numbers, so the output is 0.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'math'],
    starterCode: `function averageOfEvenNumbers(arr) {
  // Write your code here
}`,
    solutionCode: `function averageOfEvenNumbers(arr) {
  const evens = arr.filter(x => x % 2 === 0);
  if (evens.length === 0) return 0;
  return evens.reduce((sum, x) => sum + x, 0) / evens.length;
}`,
    order: 101,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5, 6]]', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '[[1, 3, 5]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[10, 20, 30, 41]]', expectedOutput: '20', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum of Odd Numbers',
    slug: 'sum-of-odd-numbers',
    description: `Given an array of numbers, return the sum of all odd numbers.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** 9  
**Explanation:** The odd numbers are 1, 3, and 5. Their sum is 1 + 3 + 5 = 9.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'math'],
    starterCode: `function sumOfOddNumbers(arr) {
  // Write your code here
}`,
    solutionCode: `function sumOfOddNumbers(arr) {
  return arr.filter(x => Math.abs(x) % 2 === 1).reduce((sum, x) => sum + x, 0);
}`,
    order: 102,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '9', isHidden: false, order: 1 },
      { input: '[[2, 4, 6]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[-1, -2, -3]]', expectedOutput: '-4', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum of Prime Numbers',
    slug: 'sum-of-prime-numbers',
    description: `Given an array of numbers, return the sum of all prime numbers in the array. A prime number is a number greater than 1 with no positive divisors other than 1 and itself.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5, 6, 7]  
**Output:** 14  
**Explanation:** The prime numbers are 2, 3, 5, and 7. Their sum is 2 + 3 + 5 + 7 = 14.`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'math'],
    starterCode: `function sumOfPrimes(arr) {
  // Write your code here
}`,
    solutionCode: `function sumOfPrimes(arr) {
  const isPrime = num => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  return arr.filter(isPrime).reduce((sum, x) => sum + x, 0);
}`,
    order: 103,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5, 6, 7]]', expectedOutput: '14', isHidden: false, order: 1 },
      { input: '[[4, 6, 8, 9]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[11, 13, 17]]', expectedOutput: '41', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum of Positive Numbers',
    slug: 'sum-of-positive-numbers',
    description: `Given an array of numbers, return the sum of all positive numbers (numbers strictly greater than 0).

### Example 1:
**Input:** nums = [1, -2, 3, -4, 5]  
**Output:** 9  
**Explanation:** The positive numbers are 1, 3, and 5. Their sum is 9.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'math'],
    starterCode: `function sumOfPositive(arr) {
  // Write your code here
}`,
    solutionCode: `function sumOfPositive(arr) {
  return arr.filter(x => x > 0).reduce((sum, x) => sum + x, 0);
}`,
    order: 104,
    isPublished: true,
    testCases: [
      { input: '[[1, -2, 3, -4, 5]]', expectedOutput: '9', isHidden: false, order: 1 },
      { input: '[[-1, -2, -3]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[10, 0, 20]]', expectedOutput: '30', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum of Array Elements',
    slug: 'sum-of-array-elements',
    description: `Given an array of numbers, calculate and return the sum of all elements.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** 15`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sumArray(arr) {
  // Write your code here
}`,
    solutionCode: `function sumArray(arr) {
  return arr.reduce((sum, x) => sum + x, 0);
}`,
    order: 105,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '15', isHidden: false, order: 1 },
      { input: '[[-1, 2, -3]]', expectedOutput: '-2', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Calculate Array Sum',
    slug: 'calculate-array-sum',
    description: `Given an array of numbers, return the sum of all numbers using a loop.

### Example 1:
**Input:** nums = [5, 10, 15]  
**Output:** 30`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function calculateSum(arr) {
  // Write your code here
}`,
    solutionCode: `function calculateSum(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}`,
    order: 106,
    isPublished: true,
    testCases: [
      { input: '[[5, 10, 15]]', expectedOutput: '30', isHidden: false, order: 1 },
      { input: '[[0, -5, 5]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Reverse an Array',
    slug: 'reverse-an-array',
    description: `Given an array, return a new array with the elements in reverse order. Do not modify the original array.

### Example 1:
**Input:** nums = [1, 2, 3, 4]  
**Output:** [4, 3, 2, 1]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function reverseArray(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseArray(arr) {
  return arr.slice().reverse();
}`,
    order: 107,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4]]', expectedOutput: '[4,3,2,1]', isHidden: false, order: 1 },
      { input: '[[5]]', expectedOutput: '[5]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Reverse Array In-Place',
    slug: 'reverse-array-in-place',
    description: `Given an array, reverse the elements in-place. Modify the original array and return it.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** [5, 4, 3, 2, 1]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'two-pointers'],
    starterCode: `function reverseInPlace(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseInPlace(arr) {
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
    order: 108,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '[5,4,3,2,1]', isHidden: false, order: 1 },
      { input: '[["a", "b"]]', expectedOutput: '["b","a"]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Reverse Array Without Built-ins',
    slug: 'reverse-array-without-builtins',
    description: `Given an array, return a reversed version of it without using any built-in array methods like \`.reverse()\`, \`.slice()\`, or \`.splice()\`.

### Example 1:
**Input:** nums = [10, 20, 30]  
**Output:** [30, 20, 10]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function reverseWithoutBuiltins(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseWithoutBuiltins(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}`,
    order: 109,
    isPublished: true,
    testCases: [
      { input: '[[10, 20, 30]]', expectedOutput: '[30,20,10]', isHidden: false, order: 1 },
      { input: '[[1]]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Reverse Array Without Second Array',
    slug: 'reverse-array-no-second-array',
    description: `Given an array, reverse the elements in-place without creating a second array. Modify the original array and return it.

### Example 1:
**Input:** nums = [1, 2, 3, 4]  
**Output:** [4, 3, 2, 1]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function reverseNoSecondArray(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseNoSecondArray(arr) {
  for (let i = 0; i < Math.floor(arr.length / 2); i++) {
    const temp = arr[i];
    arr[i] = arr[arr.length - 1 - i];
    arr[arr.length - 1 - i] = temp;
  }
  return arr;
}`,
    order: 110,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4]]', expectedOutput: '[4,3,2,1]', isHidden: false, order: 1 },
      { input: '[[7, 8, 9]]', expectedOutput: '[9,8,7]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Reverse and Multiply Halves',
    slug: 'reverse-and-multiply-halves',
    description: `Given an array, reverse it and then multiply all elements in the first half of the reversed array by 2, and all elements in the second half by 5.
For arrays with odd lengths, the middle element belongs to the first half (and is multiplied by 2).
Return the resulting array.

### Example 1:
**Input:** nums = [1, 2, 3, 4]  
**Output:** [8, 6, 10, 5]  
**Explanation:** Reversing [1, 2, 3, 4] yields [4, 3, 2, 1]. The first half [4, 3] multiplied by 2 is [8, 6]. The second half [2, 1] multiplied by 5 is [10, 5]. Combined result is [8, 6, 10, 5].`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function reverseAndMultiply(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseAndMultiply(arr) {
  const rev = arr.slice().reverse();
  const mid = Math.ceil(rev.length / 2);
  for (let i = 0; i < rev.length; i++) {
    if (i < mid) {
      rev[i] *= 2;
    } else {
      rev[i] *= 5;
    }
  }
  return rev;
}`,
    order: 111,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4]]', expectedOutput: '[8,6,10,5]', isHidden: false, order: 1 },
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '[10,8,6,10,5]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Second Largest Element',
    slug: 'second-largest-element',
    description: `Given an array of numbers, find and return the second largest unique element. If the array contains fewer than two unique elements, return \`null\`.

### Example 1:
**Input:** nums = [12, 35, 1, 10, 34, 1]  
**Output:** 34`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function secondLargest(arr) {
  // Write your code here
}`,
    solutionCode: `function secondLargest(arr) {
  let max = -Infinity;
  let secondMax = -Infinity;
  for (const num of arr) {
    if (num > max) {
      secondMax = max;
      max = num;
    } else if (num > secondMax && num < max) {
      secondMax = num;
    }
  }
  return secondMax === -Infinity ? null : secondMax;
}`,
    order: 112,
    isPublished: true,
    testCases: [
      { input: '[[12, 35, 1, 10, 34, 1]]', expectedOutput: '34', isHidden: false, order: 1 },
      { input: '[[10, 10, 10]]', expectedOutput: 'null', isHidden: false, order: 2 },
      { input: '[[5, 10]]', expectedOutput: '5', isHidden: true, order: 3 },
      { input: '[[1]]', expectedOutput: 'null', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Highest Even with Reduce',
    slug: 'highest-even-with-reduce',
    description: `Given an array of numbers, find the highest even number using the \`.reduce()\` method. If no even numbers exist, return \`null\`.

### Example 1:
**Input:** nums = [1, 12, 3, 4, 15, 6, 7]  
**Output:** 12`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'reduce'],
    starterCode: `function highestEven(arr) {
  // Write your code here
}`,
    solutionCode: `function highestEven(arr) {
  return arr.reduce((max, val) => {
    if (val % 2 === 0) {
      return max === null ? val : Math.max(max, val);
    }
    return max;
  }, null);
}`,
    order: 113,
    isPublished: true,
    testCases: [
      { input: '[[1, 12, 3, 4, 15, 6, 7]]', expectedOutput: '12', isHidden: false, order: 1 },
      { input: '[[1, 3, 5]]', expectedOutput: 'null', isHidden: false, order: 2 },
      { input: '[[2]]', expectedOutput: '2', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Highest Odd Number',
    slug: 'highest-odd-number',
    description: `Given an array of numbers, find and return the highest odd number. If no odd numbers exist in the array, return \`null\`.

### Example 1:
**Input:** nums = [2, 4, 7, 10, 15, 8]  
**Output:** 15`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function highestOdd(arr) {
  // Write your code here
}`,
    solutionCode: `function highestOdd(arr) {
  let maxOdd = -Infinity;
  for (const num of arr) {
    if (Math.abs(num) % 2 === 1 && num > maxOdd) {
      maxOdd = num;
    }
  }
  return maxOdd === -Infinity ? null : maxOdd;
}`,
    order: 114,
    isPublished: true,
    testCases: [
      { input: '[[2, 4, 7, 10, 15, 8]]', expectedOutput: '15', isHidden: false, order: 1 },
      { input: '[[2, 4, 6]]', expectedOutput: 'null', isHidden: false, order: 2 },
      { input: '[[-3, -5, -1]]', expectedOutput: '-1', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Find and Remove Duplicates',
    slug: 'find-and-remove-duplicates',
    description: `Given an array, return a new array with all duplicate elements removed. The unique elements must appear in their original order.

### Example 1:
**Input:** nums = [1, 2, 2, 3, 4, 4, 5]  
**Output:** [1, 2, 3, 4, 5]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeDuplicates(arr) {
  // Write your code here
}`,
    solutionCode: `function removeDuplicates(arr) {
  return [...new Set(arr)];
}`,
    order: 115,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 2, 3, 4, 4, 5]]',
        expectedOutput: '[1,2,3,4,5]',
        isHidden: false,
        order: 1,
      },
      {
        input: '[["a", "b", "a", "c"]]',
        expectedOutput: '["a","b","c"]',
        isHidden: false,
        order: 2,
      },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Remove Duplicate Even Numbers',
    slug: 'remove-duplicate-even-numbers',
    description: `Given an array of numbers, filter the array such that all duplicate even numbers are removed, keeping only their first occurrence. All odd numbers must remain in the array in their original places.

### Example 1:
**Input:** nums = [1, 2, 2, 3, 4, 4, 2, 5]  
**Output:** [1, 2, 3, 4, 5]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeDuplicateEvens(arr) {
  // Write your code here
}`,
    solutionCode: `function removeDuplicateEvens(arr) {
  const seenEvens = new Set();
  return arr.filter(x => {
    if (x % 2 === 0) {
      if (seenEvens.has(x)) return false;
      seenEvens.add(x);
    }
    return true;
  });
}`,
    order: 116,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 2, 3, 4, 4, 2, 5]]',
        expectedOutput: '[1,2,3,4,5]',
        isHidden: false,
        order: 1,
      },
      { input: '[[2, 4, 6, 2, 4, 6]]', expectedOutput: '[2,4,6]', isHidden: false, order: 2 },
      { input: '[[1, 3, 5]]', expectedOutput: '[1,3,5]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Remove Multiples of Three',
    slug: 'remove-multiples-of-three',
    description: `Given an array of numbers, return a new array with all multiples of 3 removed.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]  
**Output:** [1, 2, 4, 5, 7, 8]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeMultiplesOfThree(arr) {
  // Write your code here
}`,
    solutionCode: `function removeMultiplesOfThree(arr) {
  return arr.filter(x => x % 3 !== 0);
}`,
    order: 117,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 3, 4, 5, 6, 7, 8, 9]]',
        expectedOutput: '[1,2,4,5,7,8]',
        isHidden: false,
        order: 1,
      },
      { input: '[[3, 6, 9]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Remove Odd Numbers',
    slug: 'remove-odd-numbers',
    description: `Given an array of numbers, return a new array with all odd numbers removed.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** [2, 4]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeOdds(arr) {
  // Write your code here
}`,
    solutionCode: `function removeOdds(arr) {
  return arr.filter(x => x % 2 === 0);
}`,
    order: 118,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '[2,4]', isHidden: false, order: 1 },
      { input: '[[1, 3, 5]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Remove Adjacent Odd Numbers',
    slug: 'remove-adjacent-odd-numbers',
    description: `Given an array of numbers, remove all odd numbers that are adjacent to another odd number in the input array. Odd numbers that are adjacent to only even numbers (or are at the boundaries with no adjacent odds) should be kept.

### Example 1:
**Input:** nums = [1, 3, 2, 5, 4, 7, 9, 11]  
**Output:** [2, 5, 4]  
**Explanation:** 
- 1 and 3 are adjacent odds, so both are removed.
- 2 and 4 are even, so they are kept.
- 5 is adjacent to 2 (even) and 4 (even), so it is kept.
- 7, 9, and 11 are adjacent odds, so all are removed.`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeAdjacentOdds(arr) {
  // Write your code here
}`,
    solutionCode: `function removeAdjacentOdds(arr) {
  return arr.filter((x, i) => {
    if (Math.abs(x) % 2 === 0) return true;
    const prevOdd = i > 0 && Math.abs(arr[i-1]) % 2 === 1;
    const nextOdd = i < arr.length - 1 && Math.abs(arr[i+1]) % 2 === 1;
    return !(prevOdd || nextOdd);
  });
}`,
    order: 119,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 3, 2, 5, 4, 7, 9, 11]]',
        expectedOutput: '[2,5,4]',
        isHidden: false,
        order: 1,
      },
      { input: '[[1, 2, 3]]', expectedOutput: '[1,2,3]', isHidden: false, order: 2 },
      { input: '[[1, 3]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[1, 2, 3, 5, 7, 8, 9]]', expectedOutput: '[1,2,8,9]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Replace Odd Numbers with Squares',
    slug: 'replace-odds-with-squares',
    description: `Given an array of numbers, return a new array where all odd numbers are replaced with their square values, while even numbers remain unchanged.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5]  
**Output:** [1, 2, 9, 4, 25]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function replaceOddsWithSquares(arr) {
  // Write your code here
}`,
    solutionCode: `function replaceOddsWithSquares(arr) {
  return arr.map(x => Math.abs(x) % 2 === 1 ? x * x : x);
}`,
    order: 120,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '[1,2,9,4,25]', isHidden: false, order: 1 },
      { input: '[[2, 4, 6]]', expectedOutput: '[2,4,6]', isHidden: false, order: 2 },
      { input: '[[-3, 0]]', expectedOutput: '[9,0]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Common Elements from Two Arrays',
    slug: 'common-elements-two-arrays',
    description: `Given two arrays, find and return all common elements (elements present in both arrays). The result should contain unique elements and maintain the order of their first appearance in the first array.

### Example 1:
**Input:** arr1 = [1, 2, 2, 3, 4], arr2 = [2, 3, 5]  
**Output:** [2, 3]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function commonElements(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function commonElements(arr1, arr2) {
  const set2 = new Set(arr2);
  const seen = new Set();
  return arr1.filter(x => {
    if (set2.has(x) && !seen.has(x)) {
      seen.add(x);
      return true;
    }
    return false;
  });
}`,
    order: 121,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 2, 3, 4], [2, 3, 5]]', expectedOutput: '[2,3]', isHidden: false, order: 1 },
      { input: '[[1, 2], [3, 4]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[["a", "b"], ["b", "c"]]', expectedOutput: '["b"]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Concatenate Two Arrays',
    slug: 'concatenate-two-arrays',
    description: `Given two arrays, return a new array containing the elements of the first array followed by the elements of the second array. Do not modify the original arrays.

### Example 1:
**Input:** arr1 = [1, 2], arr2 = [3, 4]  
**Output:** [1, 2, 3, 4]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function concatArrays(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function concatArrays(arr1, arr2) {
  return arr1.concat(arr2);
}`,
    order: 122,
    isPublished: true,
    testCases: [
      { input: '[[1, 2], [3, 4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[], [1]]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[[1], []]', expectedOutput: '[1]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Merge Two Arrays Manually',
    slug: 'merge-two-arrays-manually',
    description: `Given two arrays, merge them into a single new array manually without using the built-in \`.concat()\` method or the spread operator (\`...\`).

### Example 1:
**Input:** arr1 = [1, 2], arr2 = [3, 4]  
**Output:** [1, 2, 3, 4]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function mergeManually(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function mergeManually(arr1, arr2) {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i]);
  }
  for (let i = 0; i < arr2.length; i++) {
    result.push(arr2[i]);
  }
  return result;
}`,
    order: 123,
    isPublished: true,
    testCases: [
      { input: '[[1, 2], [3, 4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[5], []]', expectedOutput: '[5]', isHidden: false, order: 2 },
      { input: '[[] , [6]]', expectedOutput: '[6]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Merge Two Arrays with Apply',
    slug: 'merge-arrays-with-apply',
    description: `Given two arrays, merge the elements of the second array into the first array in-place using \`Array.prototype.push.apply()\`. Modify and return the first array.

### Example 1:
**Input:** arr1 = [1, 2], arr2 = [3, 4]  
**Output:** [1, 2, 3, 4]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function mergeWithApply(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function mergeWithApply(arr1, arr2) {
  Array.prototype.push.apply(arr1, arr2);
  return arr1;
}`,
    order: 124,
    isPublished: true,
    testCases: [
      { input: '[[1, 2], [3, 4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[], [5]]', expectedOutput: '[5]', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Add Element Without Push/Unshift',
    slug: 'add-element-without-push-unshift',
    description: `Given an array and an element, add the element to the end of the array without using the built-in \`.push()\` or \`.unshift()\` methods. Modify the array in-place and return it.

### Example 1:
**Input:** arr = [1, 2], element = 3  
**Output:** [1, 2, 3]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function addElement(arr, element) {
  // Write your code here
}`,
    solutionCode: `function addElement(arr, element) {
  arr[arr.length] = element;
  return arr;
}`,
    order: 125,
    isPublished: true,
    testCases: [
      { input: '[[1, 2], 3]', expectedOutput: '[1,2,3]', isHidden: false, order: 1 },
      { input: '[[], "a"]', expectedOutput: '["a"]', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Remove Last Without Pop',
    slug: 'remove-last-without-pop',
    description: `Given an array, remove the last element of the array without using the built-in \`.pop()\` method. Modify the array in-place and return it. If the array is empty, return it unchanged.

### Example 1:
**Input:** arr = [1, 2, 3]  
**Output:** [1, 2]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeLast(arr) {
  // Write your code here
}`,
    solutionCode: `function removeLast(arr) {
  if (arr.length > 0) {
    arr.length = arr.length - 1;
  }
  return arr;
}`,
    order: 126,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3]]', expectedOutput: '[1,2]', isHidden: false, order: 1 },
      { input: '[[5]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Shift Array Elements Left',
    slug: 'shift-elements-left',
    description: `Given an array, shift all elements one position to the left. The first element should wrap around to the end of the array (circular shift). Modify the array in-place and return it.

### Example 1:
**Input:** arr = [1, 2, 3, 4]  
**Output:** [2, 3, 4, 1]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function shiftLeft(arr) {
  // Write your code here
}`,
    solutionCode: `function shiftLeft(arr) {
  if (arr.length <= 1) return arr;
  const first = arr.shift();
  arr.push(first);
  return arr;
}`,
    order: 127,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4]]', expectedOutput: '[2,3,4,1]', isHidden: false, order: 1 },
      { input: '[[5]]', expectedOutput: '[5]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Rotate Array N Times',
    slug: 'rotate-array-n-times',
    description: `Given an array, rotate the elements \`n\` times to the right. Rotation is in-place.
If \`n\` is positive, rotate right. If \`n\` is negative, rotate left.
\`n\` can be larger than the array length.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5], n = 2  
**Output:** [4, 5, 1, 2, 3]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function rotateArray(arr, n) {
  // Write your code here
}`,
    solutionCode: `function rotateArray(arr, n) {
  if (arr.length <= 1) return arr;
  const len = arr.length;
  let k = n % len;
  if (k < 0) k += len;
  if (k === 0) return arr;
  const popped = arr.splice(len - k, k);
  arr.unshift(...popped);
  return arr;
}`,
    order: 128,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5], 2]', expectedOutput: '[4,5,1,2,3]', isHidden: false, order: 1 },
      { input: '[[1, 2, 3], -1]', expectedOutput: '[2,3,1]', isHidden: false, order: 2 },
      { input: '[[1, 2], 5]', expectedOutput: '[2,1]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Sort Array Manually',
    slug: 'sort-array-manually',
    description: `Given an array of numbers, sort the elements in ascending order in-place without using the built-in \`.sort()\` method. Return the sorted array.

### Example 1:
**Input:** arr = [5, 3, 8, 1, 2]  
**Output:** [1, 2, 3, 5, 8]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sortManually(arr) {
  // Write your code here
}`,
    solutionCode: `function sortManually(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    order: 129,
    isPublished: true,
    testCases: [
      { input: '[[5, 3, 8, 1, 2]]', expectedOutput: '[1,2,3,5,8]', isHidden: false, order: 1 },
      { input: '[[1]]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Check Element Without Includes',
    slug: 'check-element-without-includes',
    description: `Given an array and a target value, check if the target element exists in the array. Do not use the built-in \`.includes()\` or \`.indexOf()\` methods. Return \`true\` if it exists, and \`false\` otherwise.

### Example 1:
**Input:** arr = [1, 2, 3], target = 2  
**Output:** true`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function checkElement(arr, target) {
  // Write your code here
}`,
    solutionCode: `function checkElement(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return true;
  }
  return false;
}`,
    order: 130,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3], 2]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '[[1, 2, 3], 5]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[["a", "b"], "b"]', expectedOutput: 'true', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Find First Occurrence',
    slug: 'find-first-occurrence',
    description: `Given an array and a target, find and return the index of the first occurrence of the target in the array. Do not use the built-in \`.indexOf()\` method. Return \`-1\` if the target is not found.

### Example 1:
**Input:** arr = [1, 2, 3, 2], target = 2  
**Output:** 1`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function findFirstOccurrence(arr, target) {
  // Write your code here
}`,
    solutionCode: `function findFirstOccurrence(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
    order: 131,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 2], 2]', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '[[1, 2, 3], 5]', expectedOutput: '-1', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Find All Occurrences',
    slug: 'find-all-occurrences',
    description: `Given an array and a target, find and return an array containing all indices where the target occurs in the array. If the target is not found, return an empty array.

### Example 1:
**Input:** arr = [1, 2, 3, 2, 4, 2], target = 2  
**Output:** [1, 3, 5]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function findAllOccurrences(arr, target) {
  // Write your code here
}`,
    solutionCode: `function findAllOccurrences(arr, target) {
  const indices = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i);
    }
  }
  return indices;
}`,
    order: 132,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 2, 4, 2], 2]', expectedOutput: '[1,3,5]', isHidden: false, order: 1 },
      { input: '[[1, 2, 3], 5]', expectedOutput: '[]', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Find Max and Min Without Math',
    slug: 'find-max-min-without-math',
    description: `Given an array of numbers, find the maximum and minimum elements in the array without using \`Math.max()\` or \`Math.min()\`. Return an object \`{ max: number, min: number }\`. If the array is empty, return \`{ max: null, min: null }\`.

### Example 1:
**Input:** arr = [5, 2, 9, 1, 7]  
**Output:** {"max": 9, "min": 1}`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findMaxMin(arr) {
  // Write your code here
}`,
    solutionCode: `function findMaxMin(arr) {
  if (arr.length === 0) return { max: null, min: null };
  let max = arr[0];
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }
  return { max, min };
}`,
    order: 133,
    isPublished: true,
    testCases: [
      {
        input: '[[5, 2, 9, 1, 7]]',
        expectedOutput: '{"max":9,"min":1}',
        isHidden: false,
        order: 1,
      },
      { input: '[[1]]', expectedOutput: '{"max":1,"min":1}', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '{"max":null,"min":null}', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Frequency of Elements',
    slug: 'frequency-of-elements',
    description: `Given an array, find the frequency of each element in the array. Return an object where the keys are the elements and the values are their counts (frequencies).

### Example 1:
**Input:** arr = [1, 2, 2, 3, 3, 3]  
**Output:** {"1": 1, "2": 2, "3": 3}`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'objects'],
    starterCode: `function getFrequency(arr) {
  // Write your code here
}`,
    solutionCode: `function getFrequency(arr) {
  const freq = {};
  for (const item of arr) {
    freq[item] = (freq[item] || 0) + 1;
  }
  return freq;
}`,
    order: 134,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 2, 3, 3, 3]]',
        expectedOutput: '{"1":1,"2":2,"3":3}',
        isHidden: false,
        order: 1,
      },
      { input: '[["a", "b", "a"]]', expectedOutput: '{"a":2,"b":1}', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '{}', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Count 1s in Numbers',
    slug: 'count-ones-in-numbers',
    description: `Given an array of numbers, count the total number of times the digit \`1\` appears across all numbers. E.g. in the number \`11\`, the digit \`1\` appears twice.

### Example 1:
**Input:** arr = [1, 11, 21, 31, 41]  
**Output:** 6  
**Explanation:** Digit 1 appears once in 1, twice in 11, once in 21, once in 31, and once in 41. Total is 1 + 2 + 1 + 1 + 1 = 6.`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'strings'],
    starterCode: `function countOnes(arr) {
  // Write your code here
}`,
    solutionCode: `function countOnes(arr) {
  let count = 0;
  for (const num of arr) {
    const str = String(num);
    for (const char of str) {
      if (char === '1') count++;
    }
  }
  return count;
}`,
    order: 135,
    isPublished: true,
    testCases: [
      { input: '[[1, 11, 21, 31, 41]]', expectedOutput: '6', isHidden: false, order: 1 },
      { input: '[[2, 3, 4]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[101, 111]]', expectedOutput: '5', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Flip Sign with ForEach',
    slug: 'flip-sign-with-foreach',
    description: `Given an array of numbers, flip the sign of all numbers using the \`.forEach()\` method. The operation must modify the original array in-place and return it. Handle \`0\` such that it remains \`0\` (rather than \`-0\`).

### Example 1:
**Input:** arr = [1, -2, 3]  
**Output:** [-1, 2, -3]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function flipSigns(arr) {
  // Write your code here
}`,
    solutionCode: `function flipSigns(arr) {
  arr.forEach((val, idx) => {
    arr[idx] = val === 0 ? 0 : -val;
  });
  return arr;
}`,
    order: 136,
    isPublished: true,
    testCases: [
      { input: '[[1, -2, 3]]', expectedOutput: '[-1,2,-3]', isHidden: false, order: 1 },
      { input: '[[1, -2, 3, 0]]', expectedOutput: '[-1,2,-3,0]', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Sum Values Multiple Ways',
    slug: 'sum-values-multiple-ways',
    description: `Given an array of numbers, calculate the sum of all elements three different ways. Return an object with three properties: \`{ whileSum: number, forEachSum: number, reduceSum: number }\` indicating the sum computed via a \`while\` loop, \`.forEach()\`, and \`.reduce()\` respectively.

### Example 1:
**Input:** arr = [1, 2, 3, 4]  
**Output:** {"whileSum": 10, "forEachSum": 10, "reduceSum": 10}`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sumMultipleWays(arr) {
  // Write your code here
}`,
    solutionCode: `function sumMultipleWays(arr) {
  let whileSum = 0;
  let i = 0;
  while (i < arr.length) {
    whileSum += arr[i];
    i++;
  }
  let forEachSum = 0;
  arr.forEach(num => { forEachSum += num; });
  const reduceSum = arr.reduce((sum, num) => sum + num, 0);
  return { whileSum, forEachSum, reduceSum };
}`,
    order: 137,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 3, 4]]',
        expectedOutput: '{"whileSum":10,"forEachSum":10,"reduceSum":10}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[[]]',
        expectedOutput: '{"whileSum":0,"forEachSum":0,"reduceSum":0}',
        isHidden: false,
        order: 2,
      },
    ],
  },
  {
    title: 'FizzBuzz Array',
    slug: 'fizzbuzz-array',
    description: `Given an integer \`n\`, return a string array of length \`n\` (1-indexed representation) where:
- \`arr[i - 1] == "FizzBuzz"\` if \`i\` is divisible by 3 and 5.
- \`arr[i - 1] == "Fizz"\` if \`i\` is divisible by 3.
- \`arr[i - 1] == "Buzz"\` if \`i\` is divisible by 5.
- \`arr[i - 1] == String(i)\` if none of the above are true.

### Example 1:
**Input:** n = 5  
**Output:** ["1", "2", "Fizz", "4", "Buzz"]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function fizzBuzzArray(n) {
  // Write your code here
}`,
    solutionCode: `function fizzBuzzArray(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
}`,
    order: 138,
    isPublished: true,
    testCases: [
      { input: '[5]', expectedOutput: '["1","2","Fizz","4","Buzz"]', isHidden: false, order: 1 },
      { input: '[3]', expectedOutput: '["1","2","Fizz"]', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Pairs with Target Sum',
    slug: 'pairs-with-target-sum',
    description: `Given an array of integers and a target sum, find all unique pairs of numbers that add up to the target.
Each pair \`[a, b]\` in the return array should be sorted such that \`a <= b\`.
The list of pairs should be sorted lexicographically by their first element \`a\` to ensure a deterministic output.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5], target = 6  
**Output:** [[1, 5], [2, 4]]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'two-pointers'],
    starterCode: `function findPairs(arr, target) {
  // Write your code here
}`,
    solutionCode: `function findPairs(arr, target) {
  const seen = new Set();
  const pairs = new Map();
  for (const num of arr) {
    const complement = target - num;
    if (seen.has(complement)) {
      const min = Math.min(num, complement);
      const max = Math.max(num, complement);
      pairs.set(min, [min, max]);
    }
    seen.add(num);
  }
  return Array.from(pairs.values()).sort((a, b) => a[0] - b[0]);
}`,
    order: 139,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5], 6]', expectedOutput: '[[1,5],[2,4]]', isHidden: false, order: 1 },
      { input: '[[3, 3, 3], 6]', expectedOutput: '[[3,3]]', isHidden: false, order: 2 },
      { input: '[[1, 2, 3], 7]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Two Numbers Closest to Zero',
    slug: 'two-numbers-closest-to-zero',
    description: `Given an array of numbers, find two numbers whose sum is closest to zero. Return the two numbers as an array \`[a, b]\` sorted in ascending order (\`a <= b\`).
If there are multiple pairs with the same absolute sum, return the one with the smaller first number.
If the array contains fewer than two elements, return an empty array \`[]\`.

### Example 1:
**Input:** arr = [1, 60, -10, 70, -80, 85]  
**Output:** [-80, 85]  
**Explanation:** -80 + 85 = 5, which is closest to 0 among all pairs.`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function closestToZero(arr) {
  // Write your code here
}`,
    solutionCode: `function closestToZero(arr) {
  if (arr.length < 2) return [];
  arr.sort((a, b) => a - b);
  let left = 0;
  let right = arr.length - 1;
  let minSum = Infinity;
  let result = [];
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (Math.abs(sum) < Math.abs(minSum)) {
      minSum = sum;
      result = [arr[left], arr[right]];
    } else if (Math.abs(sum) === Math.abs(minSum)) {
      if (arr[left] < result[0]) {
        result = [arr[left], arr[right]];
      }
    }
    if (sum < 0) left++;
    else right--;
  }
  return result;
}`,
    order: 140,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 60, -10, 70, -80, 85]]',
        expectedOutput: '[-80,85]',
        isHidden: false,
        order: 1,
      },
      { input: '[[-10, 11, 20]]', expectedOutput: '[-10,11]', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Remove the Nth Element',
    slug: 'remove-nth-element',
    description: `Given an array and an index \`n\`, return a new array with the element at index \`n\` removed. Do not modify the original array.
If \`n\` is out of bounds (negative or greater than or equal to the array length), return a copy of the original array.

### Example 1:
**Input:** arr = [1, 2, 3, 4], n = 2  
**Output:** [1, 2, 4]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeNthElement(arr, n) {
  // Write your code here
}`,
    solutionCode: `function removeNthElement(arr, n) {
  if (n < 0 || n >= arr.length) return arr.slice();
  return arr.slice(0, n).concat(arr.slice(n + 1));
}`,
    order: 141,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4], 2]', expectedOutput: '[1,2,4]', isHidden: false, order: 1 },
      { input: '[[1, 2, 3], 5]', expectedOutput: '[1,2,3]', isHidden: false, order: 2 },
      { input: '[[10], 0]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Remove Second-Last Element',
    slug: 'remove-second-last-element',
    description: `Given an array, remove the second-to-last element of the array in-place. Return the modified array.
If the array contains fewer than 2 elements, return the array unmodified.

### Example 1:
**Input:** arr = [1, 2, 3, 4]  
**Output:** [1, 2, 4]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeSecondLast(arr) {
  // Write your code here
}`,
    solutionCode: `function removeSecondLast(arr) {
  if (arr.length < 2) return arr;
  arr.splice(arr.length - 2, 1);
  return arr;
}`,
    order: 142,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4]]', expectedOutput: '[1,2,4]', isHidden: false, order: 1 },
      { input: '[[5, 6]]', expectedOutput: '[6]', isHidden: false, order: 2 },
      { input: '[[9]]', expectedOutput: '[9]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Insert at Specific Index',
    slug: 'insert-at-specific-index',
    description: `Given an array, an element, and an index, return a new array with the element inserted at that specific index. Do not modify the original array.
If the index is negative, insert it at the beginning (index 0). If the index is larger than the array length, insert it at the end.

### Example 1:
**Input:** arr = [1, 2, 4], element = 3, index = 2  
**Output:** [1, 2, 3, 4]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function insertAtIndex(arr, element, index) {
  // Write your code here
}`,
    solutionCode: `function insertAtIndex(arr, element, index) {
  const result = arr.slice();
  const idx = Math.max(0, Math.min(index, arr.length));
  result.splice(idx, 0, element);
  return result;
}`,
    order: 143,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 4], 3, 2]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[1, 2], 9, 5]', expectedOutput: '[1,2,9]', isHidden: false, order: 2 },
      { input: '[[], "a", 0]', expectedOutput: '["a"]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'First 5 Multiples of 3 (while)',
    slug: 'first-five-multiples-of-three',
    description: `Write a function that returns an array containing the first 5 positive multiples of 3 (3, 6, 9, 12, 15) using a \`while\` loop.

### Example:
**Output:** [3, 6, 9, 12, 15]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function firstFiveMultiplesOfThree() {
  // Write your code here
}`,
    solutionCode: `function firstFiveMultiplesOfThree() {
  const result = [];
  let num = 3;
  while (result.length < 5) {
    result.push(num);
    num += 3;
  }
  return result;
}`,
    order: 144,
    isPublished: true,
    testCases: [{ input: '[]', expectedOutput: '[3,6,9,12,15]', isHidden: false, order: 1 }],
  },
  {
    title: 'Even Numbers 20 to 2 (while)',
    slug: 'even-numbers-20-to-2',
    description: `Write a function that returns an array containing all even numbers from 20 down to 2 inclusive in descending order using a \`while\` loop.

### Example:
**Output:** [20, 18, 16, 14, 12, 10, 8, 6, 4, 2]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'loops'],
    starterCode: `function evenNumbers20To2() {
  // Write your code here
}`,
    solutionCode: `function evenNumbers20To2() {
  const result = [];
  let num = 20;
  while (num >= 2) {
    result.push(num);
    num -= 2;
  }
  return result;
}`,
    order: 145,
    isPublished: true,
    testCases: [
      { input: '[]', expectedOutput: '[20,18,16,14,12,10,8,6,4,2]', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Array Length Without .length',
    slug: 'array-length-without-property',
    description: `Given an array, find and return its length without using the \`.length\` property of the array.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** 5`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function getLength(arr) {
  // Write your code here
}`,
    solutionCode: `function getLength(arr) {
  let count = 0;
  for (const _ of arr) {
    count++;
  }
  return count;
}`,
    order: 146,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '5', isHidden: false, order: 1 },
      { input: '[[]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[10, 20]]', expectedOutput: '2', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Remove Duplicates with Reduce',
    slug: 'remove-duplicates-with-reduce',
    description: `Given an array, remove all duplicate elements using the \`.reduce()\` method. Return a new array with the unique values in their original order.

### Example 1:
**Input:** arr = [1, 2, 2, 3, 1, 4]  
**Output:** [1, 2, 3, 4]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'reduce'],
    starterCode: `function removeDuplicatesReduce(arr) {
  // Write your code here
}`,
    solutionCode: `function removeDuplicatesReduce(arr) {
  return arr.reduce((acc, val) => {
    if (!acc.includes(val)) {
      acc.push(val);
    }
    return acc;
  }, []);
}`,
    order: 147,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 2, 3, 1, 4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[["x", "y", "x"]]', expectedOutput: '["x","y"]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Create an Array',
    slug: 'create-array',
    description: `Write a function that creates and returns a new array of a given size, filled with a specified value.

### Example 1:
**Input:** size = 3, value = "a"  
**Output:** ["a", "a", "a"]  
**Explanation:** An array of size 3 is created where every element is "a".

### Example 2:
**Input:** size = 4, value = 0  
**Output:** [0, 0, 0, 0]  
**Explanation:** An array of size 4 is created filled with 0.

### Constraints:
- 0 <= size <= 100`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function createArray(size, value) {
  // Write your code here
}`,
    solutionCode: `function createArray(size, value) {
  return Array(size).fill(value);
}`,
    order: 148,
    isPublished: true,
    testCases: [
      { input: '[3, "a"]', expectedOutput: '["a","a","a"]', isHidden: false, order: 1 },
      { input: '[4, 0]', expectedOutput: '[0,0,0,0]', isHidden: false, order: 2 },
      { input: '[0, "x"]', expectedOutput: '[]', isHidden: true, order: 3 },
      {
        input: '[5, null]',
        expectedOutput: '[null,null,null,null,null]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Largest Element',
    slug: 'find-largest-element',
    description: `Given an array of numbers, find and return the largest element. If the array is empty, return \`null\`.

### Example 1:
**Input:** arr = [1, 5, 3, 9, 2]  
**Output:** 9  

### Example 2:
**Input:** arr = [-5, -2, -10]  
**Output:** -2  

### Constraints:
- 0 <= arr.length <= 10^4
- -10^9 <= arr[i] <= 10^9`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findLargest(arr) {
  // Write your code here
}`,
    solutionCode: `function findLargest(arr) {
  if (arr.length === 0) return null;
  return Math.max(...arr);
}`,
    order: 149,
    isPublished: true,
    testCases: [
      { input: '[[1, 5, 3, 9, 2]]', expectedOutput: '9', isHidden: false, order: 1 },
      { input: '[[-5, -2, -10]]', expectedOutput: '-2', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[[42]]', expectedOutput: '42', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Smallest Element',
    slug: 'find-smallest-element',
    description: `Given an array of numbers, find and return the smallest element. If the array is empty, return \`null\`.

### Example 1:
**Input:** arr = [1, 5, 3, 9, 2]  
**Output:** 1  

### Example 2:
**Input:** arr = [-5, -2, -10]  
**Output:** -10  

### Constraints:
- 0 <= arr.length <= 10^4
- -10^9 <= arr[i] <= 10^9`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findSmallest(arr) {
  // Write your code here
}`,
    solutionCode: `function findSmallest(arr) {
  if (arr.length === 0) return null;
  return Math.min(...arr);
}`,
    order: 150,
    isPublished: true,
    testCases: [
      { input: '[[1, 5, 3, 9, 2]]', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '[[-5, -2, -10]]', expectedOutput: '-10', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[[42]]', expectedOutput: '42', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find First Even Number',
    slug: 'find-first-even-number',
    description: `Given an array of numbers, find and return the first even number. If there is no even number, return \`null\`.

### Example 1:
**Input:** arr = [1, 3, 5, 4, 7, 8]  
**Output:** 4  

### Example 2:
**Input:** arr = [1, 3, 5, 7]  
**Output:** null  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findFirstEven(arr) {
  // Write your code here
}`,
    solutionCode: `function findFirstEven(arr) {
  for (const num of arr) {
    if (num % 2 === 0) return num;
  }
  return null;
}`,
    order: 151,
    isPublished: true,
    testCases: [
      { input: '[[1, 3, 5, 4, 7, 8]]', expectedOutput: '4', isHidden: false, order: 1 },
      { input: '[[1, 3, 5, 7]]', expectedOutput: 'null', isHidden: false, order: 2 },
      { input: '[[2, 4, 6]]', expectedOutput: '2', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: 'null', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Average of Numbers',
    slug: 'find-average-of-numbers',
    description: `Given an array of numbers, find and return their average value. If the array is empty, return 0.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** 3  

### Example 2:
**Input:** arr = [10, 20]  
**Output:** 15  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays', 'math'],
    starterCode: `function findAverage(arr) {
  // Write your code here
}`,
    solutionCode: `function findAverage(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, num) => sum + num, 0) / arr.length;
}`,
    order: 152,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '[[10, 20]]', expectedOutput: '15', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '[[-5, 5]]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Middle Element',
    slug: 'find-middle-element',
    description: `Given an array, return the middle element. For arrays with an even number of elements, return the element at the index \`(length / 2) - 1\` (the left-middle element). If the array is empty, return \`null\`.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** 3  
**Explanation:** The middle element is 3 at index 2.

### Example 2:
**Input:** arr = [10, 20, 30, 40]  
**Output:** 20  
**Explanation:** Even length. The middle elements are 20 and 30. The left-middle element 20 is returned.

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findMiddleElement(arr) {
  // Write your code here
}`,
    solutionCode: `function findMiddleElement(arr) {
  if (arr.length === 0) return null;
  const mid = Math.floor((arr.length - 1) / 2);
  return arr[mid];
}`,
    order: 153,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '[[10, 20, 30, 40]]', expectedOutput: '20', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[["a", "b"]]', expectedOutput: '"a"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Square of Numbers',
    slug: 'find-square-of-numbers',
    description: `Given an array of numbers, return a new array containing the square of each number.

### Example 1:
**Input:** arr = [1, 2, 3]  
**Output:** [1, 4, 9]  

### Example 2:
**Input:** arr = [-2, 0, 4]  
**Output:** [4, 0, 16]  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function squareNumbers(arr) {
  // Write your code here
}`,
    solutionCode: `function squareNumbers(arr) {
  return arr.map(x => x * x);
}`,
    order: 154,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3]]', expectedOutput: '[1,4,9]', isHidden: false, order: 1 },
      { input: '[[-2, 0, 4]]', expectedOutput: '[4,0,16]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[10]]', expectedOutput: '[100]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Unique Elements',
    slug: 'find-unique-elements',
    description: `Given an array, return a new array containing only the unique elements. The elements must appear in the same order as their first appearance in the input array.

### Example 1:
**Input:** arr = [1, 2, 2, 3, 4, 4, 1]  
**Output:** [1, 2, 3, 4]  

### Example 2:
**Input:** arr = ["a", "b", "a", "c"]  
**Output:** ["a", "b", "c"]  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findUniqueElements(arr) {
  // Write your code here
}`,
    solutionCode: `function findUniqueElements(arr) {
  return [...new Set(arr)];
}`,
    order: 155,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 2, 3, 4, 4, 1]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      {
        input: '[["a", "b", "a", "c"]]',
        expectedOutput: '["a","b","c"]',
        isHidden: false,
        order: 2,
      },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[1, 1, 1]]', expectedOutput: '[1]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Unique Number',
    slug: 'find-unique-number',
    description: `Given a non-empty array of integers where every element appears twice except for one, find and return that single unique number.

### Example 1:
**Input:** arr = [2, 2, 1]  
**Output:** 1  

### Example 2:
**Input:** arr = [4, 1, 2, 1, 2]  
**Output:** 4  

### Constraints:
- 1 <= arr.length <= 3 * 10^4
- Each element in the array appears twice except for one element which appears only once.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findUniqueNumber(arr) {
  // Write your code here
}`,
    solutionCode: `function findUniqueNumber(arr) {
  return arr.reduce((acc, num) => acc ^ num, 0);
}`,
    order: 156,
    isPublished: true,
    testCases: [
      { input: '[[2, 2, 1]]', expectedOutput: '1', isHidden: false, order: 1 },
      { input: '[[4, 1, 2, 1, 2]]', expectedOutput: '4', isHidden: false, order: 2 },
      { input: '[[1]]', expectedOutput: '1', isHidden: true, order: 3 },
      { input: '[[10, 20, 30, 20, 10]]', expectedOutput: '30', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Duplicate Elements',
    slug: 'find-duplicate-elements',
    description: `Given an array, find and return all elements that appear more than once. The resulting array should contain unique values and maintain their order of first duplication.

### Example 1:
**Input:** arr = [1, 2, 3, 2, 1, 4]  
**Output:** [2, 1]  

### Example 2:
**Input:** arr = [1, 2, 3, 4]  
**Output:** []  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findDuplicates(arr) {
  // Write your code here
}`,
    solutionCode: `function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  for (const val of arr) {
    if (seen.has(val)) {
      duplicates.add(val);
    } else {
      seen.add(val);
    }
  }
  return [...duplicates];
}`,
    order: 157,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 2, 1, 4]]', expectedOutput: '[2,1]', isHidden: false, order: 1 },
      { input: '[[1, 2, 3, 4]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[1, 1, 1, 1]]', expectedOutput: '[1]', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Missing Numbers in Sorted Array',
    slug: 'find-missing-numbers',
    description: `Given a sorted array of unique integers representing a sequential range with some numbers missing, return a new array containing all the missing numbers.

### Example 1:
**Input:** arr = [1, 2, 4, 6]  
**Output:** [3, 5]  

### Example 2:
**Input:** arr = [10, 11, 15]  
**Output:** [12, 13, 14]  

### Constraints:
- 0 <= arr.length <= 10^3`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function findMissingNumbers(arr) {
  // Write your code here
}`,
    solutionCode: `function findMissingNumbers(arr) {
  if (arr.length <= 1) return [];
  const missing = [];
  for (let i = 0; i < arr.length - 1; i++) {
    let curr = arr[i] + 1;
    while (curr < arr[i + 1]) {
      missing.push(curr);
      curr++;
    }
  }
  return missing;
}`,
    order: 158,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 4, 6]]', expectedOutput: '[3,5]', isHidden: false, order: 1 },
      { input: '[[10, 11, 15]]', expectedOutput: '[12,13,14]', isHidden: false, order: 2 },
      { input: '[[1, 5]]', expectedOutput: '[2,3,4]', isHidden: true, order: 3 },
      { input: '[[1, 2, 3]]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum of Two Numbers Equals Target',
    slug: 'sum-of-two-numbers-equals-target',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`. If no such pair exists, return \`null\`.
Assume each input would have at most one solution. Return indices as \`[index1, index2]\` where \`index1 < index2\`.

### Example 1:
**Input:** nums = [2, 7, 11, 15], target = 9  
**Output:** [0, 1]  
**Explanation:** nums[0] + nums[1] = 2 + 7 = 9.

### Example 2:
**Input:** nums = [3, 2, 4], target = 6  
**Output:** [1, 2]  

### Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i], target <= 10^9`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
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
  return null;
}`,
    order: 159,
    isPublished: true,
    testCases: [
      { input: '[[2, 7, 11, 15], 9]', expectedOutput: '[0,1]', isHidden: false, order: 1 },
      { input: '[[3, 2, 4], 6]', expectedOutput: '[1,2]', isHidden: false, order: 2 },
      { input: '[[3, 3], 6]', expectedOutput: '[0,1]', isHidden: true, order: 3 },
      { input: '[[1, 2, 3], 10]', expectedOutput: 'null', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sort Array Descending',
    slug: 'sort-array-descending',
    description: `Given an array of numbers, return a new array containing the elements sorted in descending order. Do not modify the original array.

### Example 1:
**Input:** arr = [3, 1, 4, 1, 5, 9]  
**Output:** [9, 5, 4, 3, 1, 1]  

### Example 2:
**Input:** arr = [10, -5, 20]  
**Output:** [20, 10, -5]  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sortDescending(arr) {
  // Write your code here
}`,
    solutionCode: `function sortDescending(arr) {
  return arr.slice().sort((a, b) => b - a);
}`,
    order: 160,
    isPublished: true,
    testCases: [
      { input: '[[3, 1, 4, 1, 5, 9]]', expectedOutput: '[9,5,4,3,1,1]', isHidden: false, order: 1 },
      { input: '[[10, -5, 20]]', expectedOutput: '[20,10,-5]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[42]]', expectedOutput: '[42]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sort Using While Loop',
    slug: 'sort-using-while-loop',
    description: `Given an array of numbers, sort the elements in ascending order in-place using a \`while\` loop (instead of a \`for\` loop or the built-in \`.sort()\` method). Return the sorted array.

### Example 1:
**Input:** arr = [5, 3, 8, 1, 2]  
**Output:** [1, 2, 3, 5, 8]  

### Constraints:
- 0 <= arr.length <= 10^3`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sortWithWhile(arr) {
  // Write your code here
}`,
    solutionCode: `function sortWithWhile(arr) {
  let swapped = true;
  while (swapped) {
    swapped = false;
    let i = 0;
    while (i < arr.length - 1) {
      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
      i++;
    }
  }
  return arr;
}`,
    order: 161,
    isPublished: true,
    testCases: [
      { input: '[[5, 3, 8, 1, 2]]', expectedOutput: '[1,2,3,5,8]', isHidden: false, order: 1 },
      { input: '[[10, -2, 5]]', expectedOutput: '[-2,5,10]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[1]]', expectedOutput: '[1]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sort Prime Numbers from an Unsorted Array',
    slug: 'sort-primes-unsorted-array',
    description: `Given an unsorted array of positive integers, return a new array containing only the prime numbers sorted in ascending order. A prime number is a positive integer greater than 1 that has no positive divisors other than 1 and itself.

### Example 1:
**Input:** nums = [10, 3, 7, 1, 4, 5, 2]  
**Output:** [2, 3, 5, 7]  
**Explanation:** The primes in the array are 2, 3, 5, and 7. Sorted ascending: [2, 3, 5, 7].

### Example 2:
**Input:** nums = [4, 6, 8, 9, 10]  
**Output:** []  

### Constraints:
- 0 <= nums.length <= 10^4
- 1 <= nums[i] <= 10^6`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sortPrimes(arr) {
  // Write your code here
}`,
    solutionCode: `function sortPrimes(arr) {
  const isPrime = num => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  return arr.filter(isPrime).sort((a, b) => a - b);
}`,
    order: 162,
    isPublished: true,
    testCases: [
      { input: '[[10, 3, 7, 1, 4, 5, 2]]', expectedOutput: '[2,3,5,7]', isHidden: false, order: 1 },
      { input: '[[4, 6, 8, 9, 10]]', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '[[29, 11, 2, 17, 23, 13]]',
        expectedOutput: '[2,11,13,17,23,29]',
        isHidden: true,
        order: 3,
      },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse Array Using For Loop',
    slug: 'reverse-array-using-for-loop',
    description: `Given an array, return a new array with elements in reverse order. You must construct the reversed array using a \`for\` loop (do not use the built-in \`.reverse()\` method). Do not modify the original array.

### Example 1:
**Input:** arr = [1, 2, 3]  
**Output:** [3, 2, 1]  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function reverseWithFor(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseWithFor(arr) {
  const result = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  return result;
}`,
    order: 163,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3]]', expectedOutput: '[3,2,1]', isHidden: false, order: 1 },
      { input: '[["a", "b"]]', expectedOutput: '["b","a"]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[100]]', expectedOutput: '[100]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse Array Using While Loop',
    slug: 'reverse-array-using-while-loop',
    description: `Given an array, return a new array with elements in reverse order. You must construct the reversed array using a \`while\` loop (do not use the built-in \`.reverse()\` method). Do not modify the original array.

### Example 1:
**Input:** arr = [1, 2, 3]  
**Output:** [3, 2, 1]  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function reverseWithWhile(arr) {
  // Write your code here
}`,
    solutionCode: `function reverseWithWhile(arr) {
  const result = [];
  let i = arr.length - 1;
  while (i >= 0) {
    result.push(arr[i]);
    i--;
  }
  return result;
}`,
    order: 164,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3]]', expectedOutput: '[3,2,1]', isHidden: false, order: 1 },
      { input: '[["a", "b"]]', expectedOutput: '["b","a"]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[100]]', expectedOutput: '[100]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Swap Two Arrays Without Extra Array',
    slug: 'swap-two-arrays-without-extra-array',
    description: `Given two arrays of the same length \`arr1\` and \`arr2\`, swap all their elements in-place without creating a new helper array (i.e. you can swap index-by-index in-place). Return a 2D array \`[arr1, arr2]\` representing the modified arrays.

### Example 1:
**Input:** arr1 = [1, 2, 3], arr2 = [4, 5, 6]  
**Output:** [[4, 5, 6], [1, 2, 3]]  

### Constraints:
- arr1.length === arr2.length
- 0 <= arr1.length <= 10^3`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function swapWithoutExtraArray(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function swapWithoutExtraArray(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    const temp = arr1[i];
    arr1[i] = arr2[i];
    arr2[i] = temp;
  }
  return [arr1, arr2];
}`,
    order: 165,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 3], [4, 5, 6]]',
        expectedOutput: '[[4,5,6],[1,2,3]]',
        isHidden: false,
        order: 1,
      },
      { input: '[["a"], ["b"]]', expectedOutput: '[["b"],["a"]]', isHidden: false, order: 2 },
      { input: '[[], []]', expectedOutput: '[[],[]]', isHidden: true, order: 3 },
      { input: '[[1, 1], [2, 2]]', expectedOutput: '[[2,2],[1,1]]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Swap All Elements Between Two Arrays',
    slug: 'swap-all-elements-between-two-arrays',
    description: `Given two arrays of potentially different lengths \`arr1\` and \`arr2\`, swap their entire contents in-place so that \`arr1\` gets the original contents of \`arr2\` and vice versa. Modify the original arrays in-place and return a 2D array \`[arr1, arr2]\` containing the modified arrays.
Note: You can use array manipulation methods like \`.splice()\` to change the lengths of the arrays in-place.

### Example 1:
**Input:** arr1 = [1, 2, 3], arr2 = [4, 5]  
**Output:** [[4, 5], [1, 2, 3]]  

### Constraints:
- 0 <= arr1.length, arr2.length <= 10^3`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function swapAllElements(arr1, arr2) {
  // Write your code here
}`,
    solutionCode: `function swapAllElements(arr1, arr2) {
  const temp = arr1.slice();
  arr1.length = 0;
  arr1.push(...arr2);
  arr2.length = 0;
  arr2.push(...temp);
  return [arr1, arr2];
}`,
    order: 166,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 3], [4, 5]]',
        expectedOutput: '[[4,5],[1,2,3]]',
        isHidden: false,
        order: 1,
      },
      { input: '[[10], []]', expectedOutput: '[[],[10]]', isHidden: false, order: 2 },
      { input: '[[], []]', expectedOutput: '[[],[]]', isHidden: true, order: 3 },
      {
        input: '[["x","y"], ["z"]]',
        expectedOutput: '[["z"],["x","y"]]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Store Odd Numbers in One Array and Even Numbers in Another Without New Array',
    slug: 'store-odd-even-without-new-array',
    description: `Given a source array \`arr\` and two target arrays \`odds\` and \`evens\`, distribute the odd and even numbers from \`arr\` into \`odds\` and \`evens\` respectively in-place without declaring any new arrays inside the function. Modify \`odds\` and \`evens\` and return a 2D array \`[odds, evens]\`.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5], odds = [], evens = []  
**Output:** [[1, 3, 5], [2, 4]]  

### Constraints:
- 0 <= arr.length <= 10^3`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function storeOddEven(arr, odds, evens) {
  // Write your code here
}`,
    solutionCode: `function storeOddEven(arr, odds, evens) {
  for (const num of arr) {
    if (num % 2 === 0) {
      evens.push(num);
    } else {
      odds.push(num);
    }
  }
  return [odds, evens];
}`,
    order: 167,
    isPublished: true,
    testCases: [
      {
        input: '[[1, 2, 3, 4, 5], [], []]',
        expectedOutput: '[[1,3,5],[2,4]]',
        isHidden: false,
        order: 1,
      },
      { input: '[[2, 4, 6], [], []]', expectedOutput: '[[],[2,4,6]]', isHidden: false, order: 2 },
      {
        input: '[[1, 3], [10], [20]]',
        expectedOutput: '[[10,1,3],[20]]',
        isHidden: true,
        order: 3,
      },
      { input: '[[], [], []]', expectedOutput: '[[],[]]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Delete Duplicate Without Built-in Methods',
    slug: 'delete-duplicate-without-builtin-methods',
    description: `Given an array, remove all duplicate elements in-place and return the modified array. You must do this manually without using built-in methods like \`Set\`, \`filter\`, \`indexOf\`, \`includes\`, or allocating a new array.

### Example 1:
**Input:** arr = [1, 2, 2, 3, 1, 4]  
**Output:** [1, 2, 3, 4]  

### Constraints:
- 0 <= arr.length <= 10^3`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function deleteDuplicatesManual(arr) {
  // Write your code here
}`,
    solutionCode: `function deleteDuplicatesManual(arr) {
  let uniqueCount = 0;
  for (let i = 0; i < arr.length; i++) {
    let isDuplicate = false;
    for (let j = 0; j < uniqueCount; j++) {
      if (arr[i] === arr[j]) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      arr[uniqueCount] = arr[i];
      uniqueCount++;
    }
  }
  arr.length = uniqueCount;
  return arr;
}`,
    order: 168,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 2, 3, 1, 4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[1, 1, 1]]', expectedOutput: '[1]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[["a", "b", "a"]]', expectedOutput: '["a","b"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Delete Odd Numbers Without New Array',
    slug: 'delete-odd-numbers-without-new-array',
    description: `Given an array of numbers, remove all odd numbers in-place (modifying the array directly) without allocating a new array or using \`.filter()\`. Return the modified array.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** [2, 4]  

### Constraints:
- 0 <= arr.length <= 10^3`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function deleteOddsInPlace(arr) {
  // Write your code here
}`,
    solutionCode: `function deleteOddsInPlace(arr) {
  let writePointer = 0;
  for (let readPointer = 0; readPointer < arr.length; readPointer++) {
    if (arr[readPointer] % 2 === 0) {
      arr[writePointer] = arr[readPointer];
      writePointer++;
    }
  }
  arr.length = writePointer;
  return arr;
}`,
    order: 169,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '[2,4]', isHidden: false, order: 1 },
      { input: '[[1, 3, 5]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[2, 4, 6]]', expectedOutput: '[2,4,6]', isHidden: true, order: 3 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Remove Elements Between Two Indexes',
    slug: 'remove-elements-between-indexes',
    description: `Given an array, a start index \`start\`, and an end index \`end\`, return a new array with all elements between \`start\` and \`end\` inclusive removed. Do not modify the original array.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5], start = 1, end = 3  
**Output:** [1, 5]  
**Explanation:** Elements at index 1, 2, and 3 (2, 3, and 4) are removed.

### Constraints:
- 0 <= start <= end < arr.length`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function removeBetweenIndexes(arr, start, end) {
  // Write your code here
}`,
    solutionCode: `function removeBetweenIndexes(arr, start, end) {
  const result = arr.slice();
  result.splice(start, end - start + 1);
  return result;
}`,
    order: 170,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5], 1, 3]', expectedOutput: '[1,5]', isHidden: false, order: 1 },
      { input: '[[10, 20], 0, 0]', expectedOutput: '[20]', isHidden: false, order: 2 },
      { input: '[[1, 2], 0, 1]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[["a", "b", "c"], 1, 1]', expectedOutput: '["a","c"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Delete Middle Element',
    slug: 'delete-middle-element',
    description: `Given an array, remove the middle element of the array in-place. If the array has an even number of elements, remove the left-middle element (at index \`(length / 2) - 1\`). Return the modified array.
If the array is empty, return it unchanged.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5]  
**Output:** [1, 2, 4, 5]  
**Explanation:** Middle element is 3 (index 2), which is removed.

### Example 2:
**Input:** arr = [10, 20, 30, 40]  
**Output:** [10, 30, 40]  
**Explanation:** Even length. The left-middle element is 20 (index 1), which is removed.

### Constraints:
- 0 <= arr.length <= 10^3`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function deleteMiddle(arr) {
  // Write your code here
}`,
    solutionCode: `function deleteMiddle(arr) {
  if (arr.length === 0) return arr;
  const mid = Math.floor((arr.length - 1) / 2);
  arr.splice(mid, 1);
  return arr;
}`,
    order: 171,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5]]', expectedOutput: '[1,2,4,5]', isHidden: false, order: 1 },
      { input: '[[10, 20, 30, 40]]', expectedOutput: '[10,30,40]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[42]]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Insert into Same Array Without Built-in Methods',
    slug: 'insert-into-same-array-without-builtins',
    description: `Given an array, a target index, and an element, insert the element at the specified index in-place (modifying the original array) without using any built-in array methods (like \`.splice()\`, \`.push()\`, or \`.unshift()\`). Return the modified array.
If the index is out of bounds (negative or greater than array length), you should cap it to 0 or array length.

### Example 1:
**Input:** arr = [1, 2, 4], index = 2, element = 3  
**Output:** [1, 2, 3, 4]  

### Constraints:
- 0 <= arr.length <= 1000`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function insertInPlaceManual(arr, index, element) {
  // Write your code here
}`,
    solutionCode: `function insertInPlaceManual(arr, index, element) {
  const cappedIndex = Math.max(0, Math.min(index, arr.length));
  for (let i = arr.length; i > cappedIndex; i--) {
    arr[i] = arr[i - 1];
  }
  arr[cappedIndex] = element;
  return arr;
}`,
    order: 172,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 4], 2, 3]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[10, 20], 0, 5]', expectedOutput: '[5,10,20]', isHidden: false, order: 2 },
      { input: '[[], 5, "a"]', expectedOutput: '["a"]', isHidden: true, order: 3 },
      { input: '[[1, 2], 2, 3]', expectedOutput: '[1,2,3]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Push Elements into Another Array Without push()',
    slug: 'push-elements-without-push-method',
    description: `Given two arrays \`arr\` and \`elements\`, append all elements from the \`elements\` array to the end of \`arr\` in-place without using the built-in \`.push()\` method. Return the modified \`arr\`.

### Example 1:
**Input:** arr = [1, 2], elements = [3, 4]  
**Output:** [1, 2, 3, 4]  

### Constraints:
- 0 <= arr.length, elements.length <= 10^3`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function pushManual(arr, elements) {
  // Write your code here
}`,
    solutionCode: `function pushManual(arr, elements) {
  for (let i = 0; i < elements.length; i++) {
    arr[arr.length] = elements[i];
  }
  return arr;
}`,
    order: 173,
    isPublished: true,
    testCases: [
      { input: '[[1, 2], [3, 4]]', expectedOutput: '[1,2,3,4]', isHidden: false, order: 1 },
      { input: '[[], ["a"]]', expectedOutput: '["a"]', isHidden: false, order: 2 },
      { input: '[[10], []]', expectedOutput: '[10]', isHidden: true, order: 3 },
      { input: '[[], []]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Multiply Every Element by 2',
    slug: 'multiply-every-element-by-two',
    description: `Given an array of numbers, return a new array containing each element multiplied by 2. Do not modify the original array.

### Example 1:
**Input:** arr = [1, 2, 3]  
**Output:** [2, 4, 6]  

### Constraints:
- 0 <= arr.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function multiplyByTwo(arr) {
  // Write your code here
}`,
    solutionCode: `function multiplyByTwo(arr) {
  return arr.map(x => x * 2);
}`,
    order: 174,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3]]', expectedOutput: '[2,4,6]', isHidden: false, order: 1 },
      { input: '[[-2, 0, 4]]', expectedOutput: '[-4,0,8]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[1.5]]', expectedOutput: '[3]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Multiply Even Numbers and Store in Another Array',
    slug: 'multiply-evens-and-store',
    description: `Given an array of numbers \`arr\` and a target array \`target\`, multiply all even numbers in \`arr\` by 2 and store them at the end of the \`target\` array in-place. Return the modified \`target\` array. Do not allocate any new arrays.

### Example 1:
**Input:** arr = [1, 2, 3, 4], target = [10]  
**Output:** [10, 4, 8]  
**Explanation:** Even numbers in arr are 2 and 4. Multiplied by 2: 4 and 8. Appended to [10]: [10, 4, 8].

### Constraints:
- 0 <= arr.length, target.length <= 10^3`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function multiplyEvens(arr, target) {
  // Write your code here
}`,
    solutionCode: `function multiplyEvens(arr, target) {
  for (const num of arr) {
    if (num % 2 === 0) {
      target.push(num * 2);
    }
  }
  return target;
}`,
    order: 175,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4], [10]]', expectedOutput: '[10,4,8]', isHidden: false, order: 1 },
      { input: '[[1, 3], []]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[2], [5, 6]]', expectedOutput: '[5,6,4]', isHidden: true, order: 3 },
      { input: '[[], []]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Filter Prime Numbers',
    slug: 'filter-prime-numbers',
    description: `Given an array of numbers, return a new array containing only the prime numbers. A prime number is a positive integer greater than 1 that has no positive divisors other than 1 and itself.

### Example 1:
**Input:** arr = [1, 2, 3, 4, 5, 6, 7]  
**Output:** [2, 3, 5, 7]  

### Constraints:
- 0 <= arr.length <= 10^4
- -10^6 <= arr[i] <= 10^6`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function filterPrimes(arr) {
  // Write your code here
}`,
    solutionCode: `function filterPrimes(arr) {
  const isPrime = num => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  return arr.filter(isPrime);
}`,
    order: 176,
    isPublished: true,
    testCases: [
      { input: '[[1, 2, 3, 4, 5, 6, 7]]', expectedOutput: '[2,3,5,7]', isHidden: false, order: 1 },
      { input: '[[4, 6, 8, 9, 10]]', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '[[29, 11, 2, 17, 23, 13]]',
        expectedOutput: '[29,11,2,17,23,13]',
        isHidden: true,
        order: 3,
      },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting array problems seeding...');

  for (const problemData of arrayProblems) {
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

  console.log('🎉 Database seeding complete for array problems!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
