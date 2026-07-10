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
  category: 'NODEJS';
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

const nodejsProblems: ProblemSeed[] = [
  {
    title: 'Extract Parameter Names Middleware',
    slug: 'extract-parameter-names-middleware',
    description: `Write a function \`runParamLogger(req, res)\` that simulates the execution of an Express middleware that logs parameter names.

The middleware should:
1. Extract all key names from the request parameters (\`req.params\`).
2. Store these key names as an array in a new property \`req.paramNames\`.
3. If there are no parameters, \`req.paramNames\` should be an empty array.
4. Call a mock \`next()\` function which adds a boolean property \`req.nextCalled = true\`.

Return the modified \`req\` object.

### Example 1:
**Input:** req = { "params": { "userId": "1", "postId": "2" } }  
**Output:** req.paramNames = [ "userId", "postId" ], req.nextCalled = true`,
    difficulty: 'EASY',
    category: 'NODEJS',
    tags: ['express', 'middleware'],
    starterCode: `function runParamLogger(req, res) {
  // Write your code here
}`,
    solutionCode: `function runParamLogger(req, res) {
  const next = () => {
    req.nextCalled = true;
  };
  
  req.paramNames = Object.keys(req.params || {});
  next();
  
  return req;
}`,
    order: 601,
    isPublished: true,
    testCases: [
      {
        input: '[{"params":{"userId":"1","postId":"2"}}, {}]',
        expectedOutput:
          '{"params":{"userId":"1","postId":"2"},"paramNames":["userId","postId"],"nextCalled":true}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{}, {}]',
        expectedOutput: '{"paramNames":[],"nextCalled":true}',
        isHidden: false,
        order: 2,
      },
      {
        input: '[{"params":{}}, {}]',
        expectedOutput: '{"params":{},"paramNames":[],"nextCalled":true}',
        isHidden: true,
        order: 3,
      },
      {
        input: '[{"params":{"q":"search"}}, {}]',
        expectedOutput: '{"params":{"q":"search"},"paramNames":["q"],"nextCalled":true}',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Express Middleware Pipeline',
    slug: 'express-middleware-pipeline',
    description: `Write a function \`runMiddlewarePipeline(req, res, middlewareNames)\` that simulates an Express middleware pipeline.

The function receives a request object \`req\`, a response object \`res\`, and an array of middleware names \`middlewareNames\`.

You must run the middlewares sequentially in the order they appear in the array. Each middleware is a function taking \`(req, res, next)\`.

Implement the following middlewares:
- \`'logger'\`: Sets \`req.logged = true\` and calls \`next()\`.
- \`'auth'\`: If \`req.token\` equals \`"secret"\`, it calls \`next()\`. Otherwise, it sets \`res.status = 401\`, \`res.body = "Unauthorized"\`, and does **not** call \`next()\` (short-circuits).
- \`'timestamp'\`: Sets \`req.timestamp = 123456789\` and calls \`next()\`.

Return an object containing \`{ req, res }\` after the pipeline executes (or short-circuits).

### Example 1:
**Input:** req = {}, res = {}, middlewareNames = ["logger", "timestamp"]  
**Output:** { "req": { "logged": true, "timestamp": 123456789 }, "res": {} }`,
    difficulty: 'MEDIUM',
    category: 'NODEJS',
    tags: ['express', 'middleware'],
    starterCode: `function runMiddlewarePipeline(req, res, middlewareNames) {
  // Write your code here
}`,
    solutionCode: `function runMiddlewarePipeline(req, res, middlewareNames) {
  const middlewares = {
    logger: (req, res, next) => {
      req.logged = true;
      next();
    },
    auth: (req, res, next) => {
      if (req.token === 'secret') {
        next();
      } else {
        res.status = 401;
        res.body = 'Unauthorized';
      }
    },
    timestamp: (req, res, next) => {
      req.timestamp = 123456789;
      next();
    }
  };

  let index = 0;
  const next = () => {
    if (index < middlewareNames.length) {
      const name = middlewareNames[index++];
      const mw = middlewares[name];
      if (mw) {
        mw(req, res, next);
      } else {
        next();
      }
    }
  };

  next();
  return { req, res };
}`,
    order: 602,
    isPublished: true,
    testCases: [
      {
        input: '[{}, {}, ["logger", "timestamp"]]',
        expectedOutput: '{"req":{"logged":true,"timestamp":123456789},"res":{}}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{"token":"wrong"}, {}, ["auth", "logger"]]',
        expectedOutput: '{"req":{"token":"wrong"},"res":{"status":401,"body":"Unauthorized"}}',
        isHidden: false,
        order: 2,
      },
      {
        input: '[{"token":"secret"}, {}, ["auth", "logger"]]',
        expectedOutput: '{"req":{"token":"secret","logged":true},"res":{}}',
        isHidden: true,
        order: 3,
      },
      { input: '[{}, {}, []]', expectedOutput: '{"req":{},"res":{}}', isHidden: true, order: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting Node.js problems seeding...');

  for (const problemData of nodejsProblems) {
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

  console.log('🎉 Database seeding complete for Node.js problems!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
