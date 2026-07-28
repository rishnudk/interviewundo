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

export const functionProblems: ProblemSeed[] = [
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
    tags: ['functions', 'async'],
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
    order: 601,
    isPublished: true,
    testCases: [
      {
        input: '["debounce-test-simple"]',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
    ],
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
    tags: ['functions', 'caching'],
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
    order: 602,
    isPublished: true,
    testCases: [
      {
        input: '["memoize-test-simple"]',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
    ],
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
    tags: ['functions'],
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
    order: 603,
    isPublished: true,
    testCases: [
      { input: '["curry-test-simple"]', expectedOutput: '"passed"', isHidden: false, order: 1 },
    ],
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
    category: 'JAVASCRIPT',
    tags: ['react', 'reducer', 'state'],
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
    order: 604,
    isPublished: true,
    testCases: [
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
    category: 'JAVASCRIPT',
    tags: ['react', 'state', 'derived-state'],
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
    order: 605,
    isPublished: true,
    testCases: [
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
];

async function main() {
  console.log('🌱 Starting function problems seeding...');

  for (const problemData of functionProblems) {
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

  console.log('🎉 Database seeding complete for function problems!');
}

if (process.env.SKIP_SEED_DB !== 'true') {
  main()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
