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
    title: 'Sum of Elements Using Reduce',
    slug: 'sum-elements-using-reduce',
    description: `Given an array of numbers, return the sum of all elements using the \`reduce()\` method.

### Example 1:
**Input:** nums = [ 1, 2, 3, 4 ]  
**Output:** 10  

### Constraints:
- 0 <= nums.length <= 10^4
- -10^6 <= nums[i] <= 10^6`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sumWithReduce(nums) {
  // Write your code here
}`,
    solutionCode: `function sumWithReduce(nums) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}`,
    order: 177,
    isPublished: true,
    testCases: [
      { input: '[[1,2,3,4]]', expectedOutput: '10', isHidden: false, order: 1 },
      { input: '[[]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[5]]', expectedOutput: '5', isHidden: true, order: 3 },
      { input: '[[-1,-2,3]]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Highest Even Number Using Reduce',
    slug: 'highest-even-number-using-reduce',
    description: `Given an array of numbers, find and return the highest even number in the array using the \`reduce()\` method. If there are no even numbers, return \`null\`.

### Example 1:
**Input:** nums = [ 1, 5, 8, 3, 10, 2 ]  
**Output:** 10`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function highestEvenWithReduce(nums) {
  // Write your code here
}`,
    solutionCode: `function highestEvenWithReduce(nums) {
  return nums.reduce((max, curr) => {
    if (curr % 2 === 0) {
      return max === null ? curr : Math.max(max, curr);
    }
    return max;
  }, null);
}`,
    order: 178,
    isPublished: true,
    testCases: [
      { input: '[[1,5,8,3,10,2]]', expectedOutput: '10', isHidden: false, order: 1 },
      { input: '[[1,3,5]]', expectedOutput: 'null', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[[-4,-2,-6]]', expectedOutput: '-2', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sum Positive Numbers Using Reduce',
    slug: 'sum-positive-numbers-using-reduce',
    description: `Given an array of numbers, return the sum of all positive numbers (strictly greater than 0) in the array using the \`reduce()\` method. If there are no positive numbers, return 0.

### Example 1:
**Input:** nums = [ 1, -2, 3, 4, -5 ]  
**Output:** 8`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function sumPositiveWithReduce(nums) {
  // Write your code here
}`,
    solutionCode: `function sumPositiveWithReduce(nums) {
  return nums.reduce((sum, curr) => curr > 0 ? sum + curr : sum, 0);
}`,
    order: 179,
    isPublished: true,
    testCases: [
      { input: '[[1,-2,3,4,-5]]', expectedOutput: '8', isHidden: false, order: 1 },
      { input: '[[-1,-2]]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '[[0,5,10]]', expectedOutput: '15', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Double Numbers Using Map',
    slug: 'double-numbers-using-map',
    description: `Given an array of numbers, return a new array where each number is doubled, using the \`map()\` method.

### Example 1:
**Input:** nums = [ 1, 2, 3 ]  
**Output:** [ 2, 4, 6 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function doubleWithMap(nums) {
  // Write your code here
}`,
    solutionCode: `function doubleWithMap(nums) {
  return nums.map(n => n * 2);
}`,
    order: 180,
    isPublished: true,
    testCases: [
      { input: '[[1,2,3]]', expectedOutput: '[2,4,6]', isHidden: false, order: 1 },
      { input: '[[]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[-1,0,5]]', expectedOutput: '[-2,0,10]', isHidden: true, order: 3 },
      { input: '[[1.5]]', expectedOutput: '[3]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Filter Even Numbers',
    slug: 'filter-even-numbers',
    description: `Given an array of numbers, return a new array containing only the even numbers, using the \`filter()\` method.

### Example 1:
**Input:** nums = [ 1, 2, 3, 4, 5, 6 ]  
**Output:** [ 2, 4, 6 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['arrays'],
    starterCode: `function filterEvens(nums) {
  // Write your code here
}`,
    solutionCode: `function filterEvens(nums) {
  return nums.filter(n => n % 2 === 0);
}`,
    order: 181,
    isPublished: true,
    testCases: [
      { input: '[[1,2,3,4,5,6]]', expectedOutput: '[2,4,6]', isHidden: false, order: 1 },
      { input: '[[1,3,5]]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[[-2,0,3,4]]', expectedOutput: '[-2,0,4]', isHidden: true, order: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting array problems part 2 seeding...');

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

  console.log('🎉 Database seeding complete for array problems part 2!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
