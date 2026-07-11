# Adding Questions to the Platform — Complete Guide

> **Audience**: Any developer, AI agent, or automation that needs to add coding problems to the InterviewUndo platform.
> Reading this file should give you everything you need — the database schema, every field explained, test-case formatting rules, full working examples, seed-file conventions, and the Admin API.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Problem Schema — Every Field Explained](#2-problem-schema--every-field-explained)
3. [Test Case Schema — Every Field Explained](#3-test-case-schema--every-field-explained)
4. [Test Case Input / Output Formatting Rules (CRITICAL)](#4-test-case-input--output-formatting-rules-critical)
5. [Description Writing Guide](#5-description-writing-guide)
6. [Solution Code Writing Guide](#6-solution-code-writing-guide)
7. [Full Working Examples (Copy-Paste Ready)](#7-full-working-examples-copy-paste-ready)
8. [Method 1: Bulk Seeding (Development)](#8-method-1-bulk-seeding-development)
9. [Method 2: Admin API (Production)](#9-method-2-admin-api-production)
10. [Supported Categories & Executor Details](#10-supported-categories--executor-details)
11. [Validation Rules (Zod Schemas)](#11-validation-rules-zod-schemas)
12. [Common Mistakes & Troubleshooting](#12-common-mistakes--troubleshooting)
13. [Checklist for Adding a Question](#13-checklist-for-adding-a-question)

---

## 1. Architecture Overview

When a question is added and a user submits code against it, the following flow occurs:

```
Seed File / Admin API
       │
       ▼
┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│  PostgreSQL  │────▶│  Backend API  │────▶│  BullMQ Queue    │
│  (Prisma)    │     │  (Express)    │     │  submission-queue │
└─────────────┘     └───────────────┘     └──────┬───────────┘
                                                  │
                                                  ▼
                                          ┌──────────────────┐
                                          │  Judge Worker     │
                                          │  (Docker sandbox) │
                                          └──────────────────┘
```

### Key Files

| Purpose                                                      | File Path                                                                                                           |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Prisma Schema (DB models)                                    | [`schema.prisma`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/schema.prisma)       |
| Core Seed (JS, SQL, MongoDB, React)                          | [`seed.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/seed.ts)                   |
| Array Questions Seed                                         | [`seed-arrays.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/seed-arrays.ts)     |
| Other JS Questions Seed (Objects, Strings, Functions, Loops) | [`seed-other-js.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/seed-other-js.ts) |
| JavaScript Executor (runs user code)                         | [`JavascriptExecutor.ts`](file:///d:/interviewUndo/apps/judge-worker/src/executor/JavascriptExecutor.ts)            |
| Submission Worker (orchestrates judging)                     | [`SubmissionWorker.ts`](file:///d:/interviewUndo/apps/judge-worker/src/worker/SubmissionWorker.ts)                  |
| Admin API Routes                                             | [`admin.routes.ts`](file:///d:/interviewUndo/apps/backend-api/src/presentation/routes/admin.routes.ts)              |
| Validation Schemas (Zod)                                     | [`dto/index.ts`](file:///d:/interviewUndo/packages/shared-types/src/dto/index.ts)                                   |

---

## 2. Problem Schema — Every Field Explained

From the Prisma `Problem` model:

| Field          | Type                      | Required | Default | Description                                                                                                                                    |
| -------------- | ------------------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`        | `String`                  | ✅       | —       | Human-readable problem title. E.g., `"Sum of Array Elements"`. Min 3 chars, max 200.                                                           |
| `slug`         | `String` (unique)         | ✅       | —       | URL-friendly identifier. Must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. E.g., `"sum-of-array-elements"`.                                           |
| `description`  | `String` (Text)           | ✅       | —       | Rich Markdown description rendered on the frontend with `react-markdown` + `remark-gfm`. Min 10 chars. See [§5](#5-description-writing-guide). |
| `difficulty`   | `Enum`                    | ✅       | —       | One of: `"EASY"`, `"MEDIUM"`, `"HARD"`.                                                                                                        |
| `category`     | `Enum`                    | ✅       | —       | One of: `"JAVASCRIPT"`, `"REACT"`, `"NODEJS"`, `"TYPESCRIPT"`, `"SQL"`, `"MONGODB"`. Determines which executor judges the code.                |
| `starterCode`  | `String` (Text)           | ✅       | —       | Code template shown to users. **Must contain a function declaration** so the executor can extract the function name.                           |
| `solutionCode` | `String` (Text, nullable) | ❌       | `null`  | The reference solution. Shown to admins and optionally to users who have solved or used hints.                                                 |
| `starterFiles` | `Json` (nullable)         | ❌       | `null`  | Only for `REACT` category. A JSON object mapping filenames to content: `{"App.js": "...", "styles.css": "..."}`.                               |
| `tags`         | `String[]`                | ❌       | `[]`    | Tags for filtering. E.g., `["arrays", "math"]`, `["strings", "two-pointers"]`.                                                                 |
| `order`        | `Int`                     | ❌       | `0`     | Controls display order in listings. Use unique values. Convention: Arrays=101+, Objects=201+, Strings=301+, Core=1-100.                        |
| `isPublished`  | `Boolean`                 | ❌       | `false` | Set to `true` to make visible to students. Set to `false` to keep as draft.                                                                    |
| `solvedCount`  | `Int`                     | —        | `0`     | Auto-incremented by the system. **Do NOT set manually.**                                                                                       |
| `attemptCount` | `Int`                     | —        | `0`     | Auto-incremented by the system. **Do NOT set manually.**                                                                                       |

---

## 3. Test Case Schema — Every Field Explained

From the Prisma `TestCase` model:

| Field            | Type            | Required | Default | Description                                                                                                                  |
| ---------------- | --------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `problemId`      | `String`        | ✅       | —       | The ID of the parent `Problem`. Set automatically during seeding; required for Admin API.                                    |
| `input`          | `String` (Text) | ✅       | —       | JSON string representing the function arguments as an array. See [§4](#4-test-case-input--output-formatting-rules-critical). |
| `expectedOutput` | `String` (Text) | ✅       | —       | JSON string representing the expected return value. See [§4](#4-test-case-input--output-formatting-rules-critical).          |
| `isHidden`       | `Boolean`       | ❌       | `false` | `false` = visible to users (they see the input/output). `true` = hidden (users only see pass/fail).                          |
| `order`          | `Int`           | ❌       | `0`     | Display order. Start from 1.                                                                                                 |

### Test Case Best Practices

- **Minimum 3 test cases per problem** (recommended 4–6).
- At least **2 visible** (`isHidden: false`) so users understand the expected behavior.
- At least **1–2 hidden** (`isHidden: true`) to prevent hardcoded solutions.
- Include **edge cases**: empty inputs, single-element inputs, negative numbers, large values, all-same values.

---

## 4. Test Case Input / Output Formatting Rules (CRITICAL)

> [!CAUTION]
> Getting this wrong is the #1 cause of broken questions. The judge executor literally does `JSON.parse(input)` and then spreads the result as function arguments: `targetFn(...args)`.

### The Rule

- **`input`** must be a **JSON array string** where each element corresponds to one function parameter.
- **`expectedOutput`** must be a **valid JSON string** representing the exact return value.

### How the Judge Runs Your Code

```javascript
// Inside the Docker container (runner.js):
const args = JSON.parse(testCase.input); // Parse the input string into an array
const expected = JSON.parse(testCase.expectedOutput); // Parse expected output
const actual = targetFn(...args); // Spread array as arguments
const passed = deepEqual(actual, expected); // Deep comparison
```

### Examples by Function Signature

| Function Signature     | `input` Value        | `expectedOutput` Value        | Explanation                                                        |
| ---------------------- | -------------------- | ----------------------------- | ------------------------------------------------------------------ |
| `add(a, b)`            | `'[1, 2]'`           | `'3'`                         | Two params → array of 2 elements                                   |
| `sum(arr)`             | `'[[1, 2, 3]]'`      | `'6'`                         | One param (an array) → double brackets                             |
| `merge(arr1, arr2)`    | `'[[1,2], [3,4]]'`   | `'[1,2,3,4]'`                 | Two array params                                                   |
| `greet(name)`          | `'["Alice"]'`        | `'"Hello, Alice"'`            | String param and string output (note the quotes in expectedOutput) |
| `isPrime(n)`           | `'[7]'`              | `'true'`                      | Single number param, boolean output                                |
| `findMax(arr)`         | `'[[5, 3, 9, 1]]'`   | `'9'`                         | Array param, number output                                         |
| `twoSum(nums, target)` | `'[[2,7,11,15], 9]'` | `'[0,1]'`                     | Array + number params, array output                                |
| `reverseString(s)`     | `'["hello"]'`        | `'"olleh"'`                   | String in → string out                                             |
| `createObj(name, age)` | `'["Alice", 25]'`    | `'{"name":"Alice","age":25}'` | Object output — must be valid JSON                                 |

> [!IMPORTANT]
>
> - Strings inside JSON must use double quotes: `'"hello"'` not `"'hello'"`.
> - Objects must have quoted keys: `'{"key":"value"}'`.
> - Booleans are lowercase: `'true'` and `'false'`.
> - `null` is valid: `'null'`.
> - Arrays: `'[1, 2, 3]'`.
> - No trailing commas in JSON.

---

## 5. Description Writing Guide

The `description` field is **Markdown** rendered by `react-markdown` with `remark-gfm`. Write descriptions that clearly explain:

1. **What the function should do** (1–3 sentences)
2. **Input parameters** with types
3. **Return value** with type
4. **At least 2 examples** with Input, Output, and Explanation
5. **Constraints** (optional but recommended for MEDIUM/HARD)

### Template

```markdown
Given [input description], return [output description].

[Additional rules or constraints if needed.]

### Example 1:

**Input:** paramName = [value]  
**Output:** [expected return value]  
**Explanation:** [Step-by-step reasoning of how the output is derived.]

### Example 2:

**Input:** paramName = [value]  
**Output:** [expected return value]  
**Explanation:** [Step-by-step reasoning.]

### Constraints:

- [constraint 1]
- [constraint 2]
```

### Real Example

```markdown
Given an array of numbers, return the sum of all even numbers. If there are no even numbers, return 0.

### Example 1:

**Input:** nums = [1, 2, 3, 4, 5, 6]  
**Output:** 12  
**Explanation:** The even numbers are 2, 4, and 6. Their sum is 2 + 4 + 6 = 12.

### Example 2:

**Input:** nums = [1, 3, 5, 7]  
**Output:** 0  
**Explanation:** There are no even numbers in the array, so return 0.

### Example 3:

**Input:** nums = []  
**Output:** 0  
**Explanation:** An empty array has no elements, so return 0.

### Constraints:

- 0 <= nums.length <= 10^4
- -10^6 <= nums[i] <= 10^6
```

> [!NOTE]
>
> - Use `\\`` backticks to wrap inline code in the description when using template literals in seed files.
> - Use `\\n` for newlines inside template literals.
> - The description supports GFM tables, bold, italic, code blocks, and lists.

---

## 6. Solution Code Writing Guide

The `solutionCode` must:

1. **Use the exact same function name** as `starterCode`.
2. **Accept the same parameters** as `starterCode`.
3. **Return the correct value** for all test cases (visible AND hidden).
4. Be a **clean, readable** reference solution (not just "working" — it should teach good practices).

### Rules

- The function **must be declared** with `function` keyword (not arrow function at top level) because the executor uses regex to extract the function name: `/function\*?\s+([a-zA-Z0-9_]+)\s*\(/`.
- Alternative: `class ClassName` or `const name = ` also work but `function` is preferred.
- The function is auto-exported as `module.exports` by the executor.

### Example

```javascript
// starterCode:
function sumOfEvens(arr) {
  // Write your code here
}

// solutionCode:
function sumOfEvens(arr) {
  return arr.filter((x) => x % 2 === 0).reduce((sum, x) => sum + x, 0);
}
```

---

## 7. Full Working Examples (Copy-Paste Ready)

Below are 3 complete question objects ready to paste into a seed file. They demonstrate EASY, MEDIUM, and HARD difficulties with proper descriptions, solutions, and multiple test cases.

### Example 1: EASY — Find the Largest Element

```typescript
{
  title: 'Find the Largest Element',
  slug: 'find-the-largest-element',
  description: `Given an array of numbers, return the largest element. If the array is empty, return \`-Infinity\`.

### Example 1:
**Input:** nums = [3, 7, 2, 9, 1]
**Output:** 9
**Explanation:** 9 is the largest number in the array.

### Example 2:
**Input:** nums = [-5, -2, -8]
**Output:** -2
**Explanation:** Among negative numbers, -2 is the largest.

### Example 3:
**Input:** nums = [42]
**Output:** 42
**Explanation:** With only one element, that element is the largest.

### Constraints:
- 0 <= nums.length <= 10^4
- -10^6 <= nums[i] <= 10^6`,
  difficulty: 'EASY',
  category: 'JAVASCRIPT',
  tags: ['arrays', 'math'],
  starterCode: `function findLargest(arr) {
  // Write your code here
}`,
  solutionCode: `function findLargest(arr) {
  if (arr.length === 0) return -Infinity;
  return Math.max(...arr);
}`,
  order: 110,  // Unique order number
  isPublished: true,
  testCases: [
    // Visible test cases (users can see input/output)
    { input: '[[3, 7, 2, 9, 1]]', expectedOutput: '9', isHidden: false, order: 1 },
    { input: '[[-5, -2, -8]]', expectedOutput: '-2', isHidden: false, order: 2 },
    // Hidden test cases (users only see pass/fail)
    { input: '[[42]]', expectedOutput: '42', isHidden: true, order: 3 },
    { input: '[[]]', expectedOutput: 'null', isHidden: true, order: 4 },
    // Note: -Infinity is not valid JSON, so use null as the edge case or adjust the problem.
    // If you want to return -Infinity, adjust the test: expectedOutput should match JSON.stringify(-Infinity) which is 'null'.
  ],
},
```

### Example 2: MEDIUM — Find Pairs with Target Sum

```typescript
{
  title: 'Find Pairs with Target Sum',
  slug: 'find-pairs-with-target-sum',
  description: `Given an array of integers \`nums\` and an integer \`target\`, return an array of all unique pairs \`[a, b]\` where \`a + b === target\` and \`a <= b\`. Each pair should appear only once, and the pairs should be sorted in ascending order by their first element.

### Example 1:
**Input:** nums = [1, 2, 3, 4, 5], target = 6
**Output:** [[1, 5], [2, 4]]
**Explanation:** 1+5=6 and 2+4=6 are the valid pairs. [3,3] is not valid since 3 appears only once.

### Example 2:
**Input:** nums = [3, 3, 3], target = 6
**Output:** [[3, 3]]
**Explanation:** 3+3=6 is the only valid pair. Even though there are multiple 3s, the pair appears only once.

### Example 3:
**Input:** nums = [1, 2, 3], target = 10
**Output:** []
**Explanation:** No two numbers sum to 10.

### Constraints:
- 1 <= nums.length <= 10^3
- -10^5 <= nums[i] <= 10^5
- -10^5 <= target <= 10^5`,
  difficulty: 'MEDIUM',
  category: 'JAVASCRIPT',
  tags: ['arrays', 'two-pointers', 'hash-map'],
  starterCode: `function findPairs(nums, target) {
  // Write your code here
}`,
  solutionCode: `function findPairs(nums, target) {
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];
  let left = 0, right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === target) {
      result.push([sorted[left], sorted[right]]);
      const l = sorted[left], r = sorted[right];
      while (left < right && sorted[left] === l) left++;
      while (left < right && sorted[right] === r) right--;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return result;
}`,
  order: 120,
  isPublished: true,
  testCases: [
    { input: '[[1, 2, 3, 4, 5], 6]', expectedOutput: '[[1,5],[2,4]]', isHidden: false, order: 1 },
    { input: '[[3, 3, 3], 6]', expectedOutput: '[[3,3]]', isHidden: false, order: 2 },
    { input: '[[1, 2, 3], 10]', expectedOutput: '[]', isHidden: false, order: 3 },
    { input: '[[-1, 0, 1, 2, -2], 0]', expectedOutput: '[[-2,2],[-1,1]]', isHidden: true, order: 4 },
    { input: '[[1, 1, 1, 1], 2]', expectedOutput: '[[1,1]]', isHidden: true, order: 5 },
  ],
},
```

### Example 3: HARD — Sort Prime Numbers from Unsorted Array

```typescript
{
  title: 'Sort Prime Numbers in Array',
  slug: 'sort-prime-numbers-in-array',
  description: `Given an unsorted array of positive integers, return a new array containing only the prime numbers, sorted in ascending order. A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.

### Example 1:
**Input:** nums = [10, 3, 7, 1, 4, 5, 2]
**Output:** [2, 3, 5, 7]
**Explanation:** The prime numbers are 2, 3, 5, and 7. Sorted in ascending order: [2, 3, 5, 7].

### Example 2:
**Input:** nums = [4, 6, 8, 9, 10]
**Output:** []
**Explanation:** None of the numbers are prime, so return an empty array.

### Example 3:
**Input:** nums = [29, 11, 2, 17, 23, 13]
**Output:** [2, 11, 13, 17, 23, 29]
**Explanation:** All numbers are prime. Sorted in ascending order.

### Constraints:
- 0 <= nums.length <= 10^4
- 1 <= nums[i] <= 10^6`,
  difficulty: 'HARD',
  category: 'JAVASCRIPT',
  tags: ['arrays', 'math', 'sorting'],
  starterCode: `function sortPrimes(arr) {
  // Write your code here
}`,
  solutionCode: `function sortPrimes(arr) {
  const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  };
  return arr.filter(isPrime).sort((a, b) => a - b);
}`,
  order: 130,
  isPublished: true,
  testCases: [
    { input: '[[10, 3, 7, 1, 4, 5, 2]]', expectedOutput: '[2,3,5,7]', isHidden: false, order: 1 },
    { input: '[[4, 6, 8, 9, 10]]', expectedOutput: '[]', isHidden: false, order: 2 },
    { input: '[[29, 11, 2, 17, 23, 13]]', expectedOutput: '[2,11,13,17,23,29]', isHidden: false, order: 3 },
    { input: '[[]]', expectedOutput: '[]', isHidden: true, order: 4 },
    { input: '[[2]]', expectedOutput: '[2]', isHidden: true, order: 5 },
    { input: '[[1]]', expectedOutput: '[]', isHidden: true, order: 6 },
  ],
},
```

---

## 8. Method 1: Bulk Seeding (Development)

Seeding inserts questions directly into the database. Best for local development and staging.

### Which Seed File to Use

| Seed File                                                                                                           | Category                           | Order Range | npm Script                 | Behavior                                                                                        |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| [`seed.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/seed.ts)                   | Core (JS, SQL, MongoDB, React)     | 1–100       | `npm run seed`             | ⚠️ **DESTRUCTIVE** — Deletes ALL problems, users, and submissions first. Re-creates admin user. |
| [`seed-arrays.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/seed-arrays.ts)     | JavaScript Arrays                  | 101–199     | `npm run db:seed:arrays`   | ✅ **Idempotent** — Upserts by slug, clears old test cases per problem. Safe to re-run.         |
| [`seed-other-js.ts`](file:///d:/interviewUndo/apps/backend-api/src/infrastructure/database/prisma/seed-other-js.ts) | Objects, Strings, Functions, Loops | 201+        | `npm run db:seed:other-js` | ✅ **Idempotent** — Same upsert behavior as seed-arrays.                                        |

### Step 1: Add Your Problem to the Correct Seed File

Open the appropriate seed file and add your problem object to the array. Use the format from [§7](#7-full-working-examples-copy-paste-ready).

**For `seed-arrays.ts` and `seed-other-js.ts`** (idempotent seeds), the object shape is:

```typescript
// Required TypeScript interface — your object must match this:
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
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    order: number;
  }[];
}
```

**For `seed.ts`** (core seed), test cases use Prisma's nested `create` syntax:

```typescript
{
  // ... problem fields ...
  testCases: {
    create: [
      { input: '[[1, 2]]', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '[[3, 4]]', expectedOutput: '7', isHidden: true, order: 2 },
    ],
  },
}
```

### Step 2: Run the Seed

From the `apps/backend-api` directory:

```bash
# Run ALL seeds (destructive — rebuilds everything):
npm run seed

# Run only array questions (idempotent):
npm run db:seed:arrays

# Run only other JS questions (idempotent):
npm run db:seed:other-js
```

### Step 3: Verify

Open Prisma Studio to confirm the data was inserted:

```bash
npm run studio
```

---

## 9. Method 2: Admin API (Production)

Use this to add questions to a live production database without restarting the server or wiping data.

### Step 1: Authenticate as Admin

Sign in as an admin user to get a JWT token:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "YourPassword123"
}
```

**Response:**

```json
{
  "user": { "id": "...", "role": "ADMIN" },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "..."
}
```

Use the `accessToken` in all subsequent requests:

```http
Authorization: Bearer <accessToken>
```

### Step 2: Create the Problem (Draft)

```http
POST /api/admin/problems
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "title": "Find the Largest Element",
  "slug": "find-the-largest-element",
  "description": "Given an array of numbers, return the largest element...",
  "difficulty": "EASY",
  "category": "JAVASCRIPT",
  "starterCode": "function findLargest(arr) {\n  // Write your code here\n}",
  "solutionCode": "function findLargest(arr) {\n  return Math.max(...arr);\n}",
  "tags": ["arrays", "math"],
  "isPublished": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cm1abc123def",
    "title": "Find the Largest Element",
    "slug": "find-the-largest-element"
  }
}
```

Save the returned `id` — you'll need it for test cases.

### Step 3: Add Test Cases (one request per test case)

```http
POST /api/admin/test-cases
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "problemId": "cm1abc123def",
  "input": "[[3, 7, 2, 9, 1]]",
  "expectedOutput": "9",
  "isHidden": false,
  "order": 1
}
```

Repeat for each test case (change `input`, `expectedOutput`, `isHidden`, and `order`).

### Step 4: Publish the Problem

```http
PUT /api/admin/problems/cm1abc123def
Content-Type: application/json
Authorization: Bearer <accessToken>

{
  "isPublished": true
}
```

### Other Admin API Endpoints

| Method   | Endpoint                                    | Description                               |
| -------- | ------------------------------------------- | ----------------------------------------- |
| `GET`    | `/api/admin/problems`                       | List all problems (with filtering)        |
| `GET`    | `/api/admin/problems/:problemId/test-cases` | List test cases for a problem             |
| `PUT`    | `/api/admin/problems/:id`                   | Update a problem                          |
| `DELETE` | `/api/admin/problems/:id`                   | Delete a problem (cascades to test cases) |
| `PUT`    | `/api/admin/test-cases/:id`                 | Update a test case                        |
| `DELETE` | `/api/admin/test-cases/:id`                 | Delete a test case                        |
| `GET`    | `/api/admin/stats`                          | Dashboard statistics                      |

---

## 10. Supported Categories & Executor Details

| Category     | Executor             | Docker Image   | How Test Cases Work                                                                                                               |
| ------------ | -------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `JAVASCRIPT` | `JavascriptExecutor` | `node:22-slim` | Spreads `JSON.parse(input)` as args to the function. Compares return value with `JSON.parse(expectedOutput)` using deep equality. |
| `NODEJS`     | `JavascriptExecutor` | `node:22-slim` | Same as JAVASCRIPT.                                                                                                               |
| `REACT`      | `ReactExecutor`      | Custom         | Uses `starterFiles` JSON for multi-file projects. Tests are DOM-based.                                                            |
| `SQL`        | `SqlExecutor`        | Custom         | Input is a SQL setup string. Output is a JSON array of row objects.                                                               |
| `MONGODB`    | `MongodbExecutor`    | Custom         | Input is a JSON object describing collections. The function receives a `db` object.                                               |

> [!WARNING]
> The `TYPESCRIPT` category is defined in the Prisma schema but does **not** have a dedicated executor yet. TypeScript questions currently would fail. Only use the categories with working executors listed above.

---

## 11. Validation Rules (Zod Schemas)

When using the Admin API, requests are validated by these Zod schemas (from [`dto/index.ts`](file:///d:/interviewUndo/packages/shared-types/src/dto/index.ts)):

### CreateProblem

```typescript
{
  title:        string,  min 3 chars, max 200
  slug:         string,  min 3 chars, max 200, regex /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  description:  string,  min 10 chars
  difficulty:   "EASY" | "MEDIUM" | "HARD"
  category:     "JAVASCRIPT" | "REACT" | "NODEJS" | "TYPESCRIPT" | "SQL" | "MONGODB"
  starterCode:  string,  min 1 char
  solutionCode: string   (optional)
  tags:         string[] (default: [])
  isPublished:  boolean  (default: false)
}
```

### CreateTestCase

```typescript
{
  problemId:      string (CUID format)
  input:          string
  expectedOutput: string
  isHidden:       boolean (default: false)
  order:          integer (default: 0)
}
```

---

## 12. Common Mistakes & Troubleshooting

| Mistake                                                 | Symptom                                                      | Fix                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Single brackets for array param: `'[1, 2, 3]'`          | Arguments are spread as 3 separate params instead of 1 array | Use double brackets: `'[[1, 2, 3]]'`                            |
| Unquoted string in expectedOutput: `'hello'`            | `JSON.parse` fails                                           | Use `'"hello"'` (JSON string)                                   |
| Arrow function at top level                             | Executor can't extract function name                         | Use `function name() {}` syntax                                 |
| Wrong slug format: `"My Problem"`                       | Zod validation fails                                         | Use `"my-problem"` (lowercase, hyphenated)                      |
| Duplicate slug                                          | Prisma unique constraint error                               | Check existing slugs before adding                              |
| Missing test cases                                      | Worker throws: `No test cases found for problem ID`          | Always add at least 1 test case                                 |
| Duplicate order number                                  | Problems appear in wrong position                            | Use unique `order` values                                       |
| Running `npm run seed` in production                    | All users, submissions, and problems deleted                 | Use `db:seed:arrays` or `db:seed:other-js` or Admin API instead |
| `expectedOutput` has trailing whitespace                | Deep equality fails silently                                 | Trim whitespace, ensure exact JSON match                        |
| Using `NaN`, `undefined`, `-Infinity` in expectedOutput | Not valid JSON — `JSON.parse` returns `null`                 | Use `null` or restructure the problem to avoid these values     |

---

## 13. Checklist for Adding a Question

Use this checklist every time you add a question:

- [ ] **Title**: Descriptive, 3–200 characters
- [ ] **Slug**: Lowercase, hyphenated, unique, matches `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- [ ] **Description**: Has ≥2 examples with Input/Output/Explanation, clear problem statement
- [ ] **Difficulty**: Set to EASY, MEDIUM, or HARD based on actual complexity
- [ ] **Category**: Matches one of the supported categories with a working executor
- [ ] **Starter Code**: Contains a `function` declaration with correct parameter names
- [ ] **Solution Code**: Uses same function name as starter, passes all test cases
- [ ] **Tags**: At least 1 relevant tag (e.g., `arrays`, `strings`, `objects`)
- [ ] **Order**: Unique integer, follows the convention for the seed file
- [ ] **Test Cases (minimum 3)**:
  - [ ] At least 2 visible (`isHidden: false`)
  - [ ] At least 1 hidden (`isHidden: true`)
  - [ ] Includes edge cases (empty input, single element, negatives)
  - [ ] `input` is a valid JSON array string (outer brackets = parameters)
  - [ ] `expectedOutput` is a valid JSON string matching the exact return value
  - [ ] All test case `order` values are sequential starting from 1
- [ ] **Verified**: Solution code produces the correct output for every test case
- [ ] **isPublished**: Set to `true` when ready, `false` for drafts
