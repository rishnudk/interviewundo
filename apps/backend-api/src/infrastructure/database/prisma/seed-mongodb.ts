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
  category: 'MONGODB';
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

export const mongodbProblems: ProblemSeed[] = [
  {
    title: 'Calculate Average Marks',
    slug: 'mongodb-average-marks',
    description: `Write a query to aggregate the \`students\` collection and return the average marks of all students. The result should be returned as an array containing a single document with the field \`avgMarks\`. If there are no students, return an empty array.

You can write this as a raw query (e.g. \`db.students.aggregate(...)\`) or as an asynchronous function (e.g. \`async function getAverageMarks(db) { ... }\`).

### Example 1:
**Collection structure (students):**
\`\`\`json
[
  { "name": "Alice", "marks": 80 },
  { "name": "Bob", "marks": 90 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "avgMarks": 85 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.students.aggregate(...)`,
    solutionCode: `db.students.aggregate([
  { $group: { _id: null, avgMarks: { $avg: "$marks" } } },
  { $project: { _id: 0, avgMarks: 1 } }
])`,
    order: 701,
    isPublished: true,
    testCases: [
      {
        input: '{"students":[{"name":"Alice","marks":80},{"name":"Bob","marks":90}]}',
        expectedOutput: '[{"avgMarks":85}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"students":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"students":[{"name":"C","marks":100}]}',
        expectedOutput: '[{"avgMarks":100}]',
        isHidden: true,
        order: 3,
      },
      {
        input:
          '{"students":[{"name":"A","marks":70},{"name":"B","marks":75},{"name":"C","marks":80}]}',
        expectedOutput: '[{"avgMarks":75}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Second Largest Mark',
    slug: 'mongodb-second-largest-mark',
    description: `Write a query to find the second largest mark among all students in the \`students\` collection. The result should be returned as an array of documents containing the field \`marks\`. If there are fewer than 2 students or fewer than 2 unique marks, return an empty array.

You can write this as a raw query (e.g. \`db.students.aggregate(...)\`) or as an asynchronous function.

### Example 1:
**Collection (students):**
\`\`\`json
[
  { "name": "Alice", "marks": 80 },
  { "name": "Bob", "marks": 95 },
  { "name": "Charlie", "marks": 90 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "marks": 90 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'query'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.students.aggregate(...)`,
    solutionCode: `db.students.aggregate([
  { $group: { _id: "$marks" } },
  { $sort: { _id: -1 } },
  { $skip: 1 },
  { $limit: 1 },
  { $project: { marks: "$_id", _id: 0 } }
])`,
    order: 702,
    isPublished: true,
    testCases: [
      {
        input:
          '{"students":[{"name":"Alice","marks":80},{"name":"Bob","marks":95},{"name":"Charlie","marks":90}]}',
        expectedOutput: '[{"marks":90}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"students":[{"name":"Alice","marks":90},{"name":"Bob","marks":90}]}',
        expectedOutput: '[]',
        isHidden: false,
        order: 2,
      },
      { input: '{"students":[]}', expectedOutput: '[]', isHidden: true, order: 3 },
      {
        input:
          '{"students":[{"name":"A","marks":50},{"name":"B","marks":60},{"name":"C","marks":70}]}',
        expectedOutput: '[{"marks":60}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Increase Marks by 10 Percent',
    slug: 'mongodb-increase-marks-ten-percent',
    description: `Write a query to update the \`marks\` of all students in the \`students\` collection by increasing them by 10%, and then return all documents in the \`students\` collection sorted by name ascending (exclude \`_id\` field from results).

You can write this as a raw multi-statement query or as an asynchronous function.

### Example 1:
**Collection before (students):**
\`\`\`json
[
  { "name": "Alice", "marks": 80 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "marks": 88 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'update'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.students.updateMany(...)`,
    solutionCode: `db.students.updateMany({}, [
  { $set: { marks: { $multiply: ["$marks", 1.1] } } }
]);
db.students.find({}, { projection: { _id: 0 } }).sort({ name: 1 });`,
    order: 703,
    isPublished: true,
    testCases: [
      {
        input: '{"students":[{"name":"Alice","marks":80}]}',
        expectedOutput: '[{"name":"Alice","marks":88}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"students":[{"name":"Bob","marks":100},{"name":"Alice","marks":50}]}',
        expectedOutput: '[{"name":"Alice","marks":55},{"name":"Bob","marks":110}]',
        isHidden: false,
        order: 2,
      },
      { input: '{"students":[]}', expectedOutput: '[]', isHidden: true, order: 3 },
      {
        input: '{"students":[{"name":"A","marks":0}]}',
        expectedOutput: '[{"name":"A","marks":0}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Reduce Salary by 10 Percent',
    slug: 'mongodb-reduce-salary-ten-percent',
    description: `Write a query to update the \`salary\` of all employees in the \`employees\` collection by reducing it by 10%, and then return all documents in the \`employees\` collection sorted by name ascending (exclude \`_id\` field from results).

You can write this as a raw multi-statement query or as an asynchronous function.

### Example 1:
**Collection before (employees):**
\`\`\`json
[
  { "name": "Bob", "salary": 5000 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Bob", "salary": 4500 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'update'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.employees.updateMany({}, [
  { $set: { salary: { $multiply: ["$salary", 0.9] } } }
]);
db.employees.find({}, { projection: { _id: 0 } }).sort({ name: 1 });`,
    order: 704,
    isPublished: true,
    testCases: [
      {
        input: '{"employees":[{"name":"Bob","salary":5000}]}',
        expectedOutput: '[{"name":"Bob","salary":4500}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"employees":[{"name":"Charlie","salary":1000},{"name":"Alice","salary":2000}]}',
        expectedOutput: '[{"name":"Alice","salary":1800},{"name":"Charlie","salary":900}]',
        isHidden: false,
        order: 2,
      },
      { input: '{"employees":[]}', expectedOutput: '[]', isHidden: true, order: 3 },
      {
        input: '{"employees":[{"name":"A","salary":0}]}',
        expectedOutput: '[{"name":"A","salary":0}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Names Ending with J',
    slug: 'mongodb-names-ending-with-j',
    description: `Write a query to find all documents in the \`users\` collection where the \`name\` ends with the letter "j" (case-insensitive). Return the results (excluding \`_id\`) sorted by \`name\` ascending.

You can write this as a raw query or as an asynchronous function.

### Example 1:
**Collection (users):**
\`\`\`json
[
  { "name": "Raj" },
  { "name": "Alice" },
  { "name": "Manoj" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Manoj" },
  { "name": "Raj" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'query'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.users.find({ name: /j$/i }, { projection: { _id: 0 } }).sort({ name: 1 })`,
    order: 705,
    isPublished: true,
    testCases: [
      {
        input: '{"users":[{"name":"Raj"},{"name":"Alice"},{"name":"Manoj"}]}',
        expectedOutput: '[{"name":"Manoj"},{"name":"Raj"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[{"name":"Bob"},{"name":"ALJ"}]}',
        expectedOutput: '[{"name":"ALJ"}]',
        isHidden: false,
        order: 2,
      },
      { input: '{"users":[]}', expectedOutput: '[]', isHidden: true, order: 3 },
      {
        input: '{"users":[{"name":"Jane"},{"name":"Taj Mahal"}]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Group Products by Category',
    slug: 'mongodb-aggregation-group',
    description: `Write a query to aggregate the \`products\` collection, group products by \`category\`, and calculate the total inventory count (sum of \`quantity\`) for each category. Return the grouped results sorted by \`category\` ascending.

Each returned document should be formatted as:
\`\`\`json
{ "_id": "categoryName", "totalQuantity": number }
\`\`\`

### Example 1:
**Collection (products):**
\`\`\`json
[
  { "name": "Laptop", "category": "Electronics", "quantity": 5 },
  { "name": "Phone", "category": "Electronics", "quantity": 10 },
  { "name": "Shirt", "category": "Apparel", "quantity": 15 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "_id": "Apparel", "totalQuantity": 15 },
  { "_id": "Electronics", "totalQuantity": 15 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.products.aggregate([
  { $group: { _id: "$category", totalQuantity: { $sum: "$quantity" } } },
  { $sort: { _id: 1 } }
])`,
    order: 706,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"Laptop","category":"Electronics","quantity":5},{"name":"Phone","category":"Electronics","quantity":10},{"name":"Shirt","category":"Apparel","quantity":15}]}',
        expectedOutput:
          '[{"_id":"Apparel","totalQuantity":15},{"_id":"Electronics","totalQuantity":15}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"products":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"products":[{"name":"A","category":"X","quantity":1}]}',
        expectedOutput: '[{"_id":"X","totalQuantity":1}]',
        isHidden: true,
        order: 3,
      },
      {
        input:
          '{"products":[{"name":"A","category":"X","quantity":2},{"name":"B","category":"Y","quantity":3},{"name":"C","category":"X","quantity":4}]}',
        expectedOutput: '[{"_id":"X","totalQuantity":6},{"_id":"Y","totalQuantity":3}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Maximum Price in Category',
    slug: 'mongodb-aggregation-max',
    description: `Write a query to group documents in the \`products\` collection by \`category\` and find the maximum \`price\` in each category. Return the results sorted by \`_id\` (category name) ascending.

Format:
\`\`\`json
{ "_id": "categoryName", "maxPrice": number }
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.products.aggregate([
  { $group: { _id: "$category", maxPrice: { $max: "$price" } } },
  { $sort: { _id: 1 } }
])`,
    order: 707,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"A","category":"E","price":100},{"name":"B","category":"E","price":200},{"name":"C","category":"H","price":50}]}',
        expectedOutput: '[{"_id":"E","maxPrice":200},{"_id":"H","maxPrice":50}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"products":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"products":[{"name":"A","category":"X","price":10}]}',
        expectedOutput: '[{"_id":"X","maxPrice":10}]',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Find Minimum Age in Department',
    slug: 'mongodb-aggregation-min',
    description: `Write a query to group documents in the \`employees\` collection by \`department\` and find the minimum \`age\` in each department. Return the results sorted by department (\`_id\`) ascending.

Format:
\`\`\`json
{ "_id": "departmentName", "minAge": number }
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.employees.aggregate([
  { $group: { _id: "$department", minAge: { $min: "$age" } } },
  { $sort: { _id: 1 } }
])`,
    order: 708,
    isPublished: true,
    testCases: [
      {
        input:
          '{"employees":[{"name":"A","department":"Sales","age":30},{"name":"B","department":"Sales","age":25},{"name":"C","department":"HR","age":40}]}',
        expectedOutput: '[{"_id":"HR","minAge":40},{"_id":"Sales","minAge":25}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"employees":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"employees":[{"name":"A","department":"IT","age":21}]}',
        expectedOutput: '[{"_id":"IT","minAge":21}]',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Find Documents with Equal Fields',
    slug: 'mongodb-expr-equal-fields',
    description: `Write a query to find all documents in the \`inventory\` collection where the \`spent\` field is greater than or equal to the \`budget\` field. Return the results (excluding \`_id\`) sorted by \`spent\` ascending.

You can write this as a raw query or as an asynchronous function.

### Example 1:
**Collection (inventory):**
\`\`\`json
[
  { "item": "A", "spent": 100, "budget": 80 },
  { "item": "B", "spent": 50, "budget": 60 },
  { "item": "C", "spent": 90, "budget": 90 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "item": "C", "spent": 90, "budget": 90 },
  { "item": "A", "spent": 100, "budget": 80 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'query'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.inventory.find({
  $expr: { $gte: ["$spent", "$budget"] }
}, { projection: { _id: 0 } }).sort({ spent: 1 })`,
    order: 709,
    isPublished: true,
    testCases: [
      {
        input:
          '{"inventory":[{"item":"A","spent":100,"budget":80},{"item":"B","spent":50,"budget":60},{"item":"C","spent":90,"budget":90}]}',
        expectedOutput:
          '[{"item":"C","spent":90,"budget":90},{"item":"A","spent":100,"budget":80}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"inventory":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"inventory":[{"item":"X","spent":10,"budget":20}]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 3,
      },
      {
        input: '{"inventory":[{"item":"X","spent":50,"budget":50}]}',
        expectedOutput: '[{"item":"X","spent":50,"budget":50}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Filter Documents by Array Element Match',
    slug: 'mongodb-elemmatch-query',
    description: `Write a query to find all documents in the \`students\` collection where at least one element in the \`results\` array has a \`grade\` of "A" and a \`score\` greater than or equal to 90. Return the matching documents (excluding \`_id\`) sorted by \`name\` ascending.

You can write this as a raw query or as an asynchronous function.

### Example 1:
**Collection (students):**
\`\`\`json
[
  { "name": "Alice", "results": [ { "grade": "A", "score": 95 }, { "grade": "B", "score": 80 } ] },
  { "name": "Bob", "results": [ { "grade": "A", "score": 85 } ] },
  { "name": "Charlie", "results": [ { "grade": "B", "score": 92 } ] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "results": [ { "grade": "A", "score": 95 }, { "grade": "B", "score": 80 } ] }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'query'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.students.find({
  results: { $elemMatch: { grade: "A", score: { $gte: 90 } } }
}, { projection: { _id: 0 } }).sort({ name: 1 })`,
    order: 710,
    isPublished: true,
    testCases: [
      {
        input:
          '{"students":[{"name":"Alice","results":[{"grade":"A","score":95},{"grade":"B","score":80}]},{"name":"Bob","results":[{"grade":"A","score":85}]},{"name":"Charlie","results":[{"grade":"B","score":92}]}]}',
        expectedOutput:
          '[{"name":"Alice","results":[{"grade":"A","score":95},{"grade":"B","score":80}]}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"students":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"students":[{"name":"X","results":[{"grade":"A","score":90}]}]}',
        expectedOutput: '[{"name":"X","results":[{"grade":"A","score":90}]}]',
        isHidden: true,
        order: 3,
      },
      {
        input: '{"students":[{"name":"X","results":[{"grade":"B","score":95}]}]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Documents with Existing Field',
    slug: 'mongodb-field-exists',
    description: `Write a query to find all documents in the \`users\` collection where the \`checkedIn\` field exists and is not null. Return the results (excluding \`_id\`) sorted by \`name\` ascending.

You can write this as a raw query or as an asynchronous function.

### Example 1:
**Collection (users):**
\`\`\`json
[
  { "name": "Alice", "checkedIn": true },
  { "name": "Bob" },
  { "name": "Charlie", "checkedIn": null }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "checkedIn": true }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'query'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.users.find({
  checkedIn: { $exists: true, $ne: null }
}, { projection: { _id: 0 } }).sort({ name: 1 })`,
    order: 711,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","checkedIn":true},{"name":"Bob"},{"name":"Charlie","checkedIn":null}]}',
        expectedOutput: '[{"name":"Alice","checkedIn":true}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"users":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"users":[{"name":"A","checkedIn":0}]}',
        expectedOutput: '[{"name":"A","checkedIn":0}]',
        isHidden: true,
        order: 3,
      },
      {
        input: '{"users":[{"name":"A","checkedIn":false}]}',
        expectedOutput: '[{"name":"A","checkedIn":false}]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Run Multi-Pipeline Facets',
    slug: 'mongodb-facet-aggregation',
    description: `Write a query to aggregate the \`products\` collection using \`$facet\` to return both a list of unique product categories (grouped and sorted by \`_id\` ascending) and a total product count. The result should be returned as an array containing a single document with fields \`categories\` and \`totalCount\`.

You can write this as a raw query (e.g. \`db.products.aggregate(...)\`) or as an asynchronous function.

The output facet object must be structured exactly like:
\`\`\`json
[
  {
    "categories": [ { "_id": "categoryName" }, ... ],
    "totalCount": [ { "count": number } ]
  }
]
\`\`\`

### Example 1:
**Collection (products):**
\`\`\`json
[
  { "name": "A", "category": "X" },
  { "name": "B", "category": "Y" }
]
\`\`\`
**Output:**
\`\`\`json
[
  {
    "categories": [ { "_id": "X" }, { "_id": "Y" } ],
    "totalCount": [ { "count": 2 } ]
  }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.products.aggregate([
  {
    $facet: {
      categories: [
        { $group: { _id: "$category" } },
        { $sort: { _id: 1 } }
      ],
      totalCount: [
        { $count: "count" }
      ]
    }
  }
])`,
    order: 712,
    isPublished: true,
    testCases: [
      {
        input: '{"products":[{"name":"A","category":"X"},{"name":"B","category":"Y"}]}',
        expectedOutput: '[{"categories":[{"_id":"X"},{"_id":"Y"}],"totalCount":[{"count":2}]}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[{"categories":[],"totalCount":[]}]',
        isHidden: false,
        order: 2,
      },
      {
        input:
          '{"products":[{"name":"A","category":"Z"},{"name":"B","category":"Z"},{"name":"C","category":"X"}]}',
        expectedOutput: '[{"categories":[{"_id":"X"},{"_id":"Z"}],"totalCount":[{"count":3}]}]',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Join Collections Using Lookup',
    slug: 'mongodb-lookup-join',
    description: `Write a query to perform a left outer join from the \`orders\` collection to the \`products\` collection based on the \`productId\` field matching the product's \`_id\`. Return the resulting documents sorted by \`_id\` ascending. Exclude database specific fields if any.

You can write this as a raw query or as an asynchronous function.

### Example 1:
**orders:**
\`\`\`json
[ { "_id": 1, "productId": 101, "quantity": 2 } ]
\`\`\`
**products:**
\`\`\`json
[ { "_id": 101, "name": "Pen", "price": 1.5 } ]
\`\`\`
**Output:**
\`\`\`json
[
  {
    "_id": 1,
    "productId": 101,
    "quantity": 2,
    "productDetails": [ { "_id": 101, "name": "Pen", "price": 1.5 } ]
  }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $sort: { _id: 1 } }
])`,
    order: 713,
    isPublished: true,
    testCases: [
      {
        input:
          '{"orders":[{"_id":1,"productId":101,"quantity":2}],"products":[{"_id":101,"name":"Pen","price":1.5}]}',
        expectedOutput:
          '[{"_id":1,"productId":101,"quantity":2,"productDetails":[{"_id":101,"name":"Pen","price":1.5}]}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"orders":[],"products":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"orders":[{"_id":2,"productId":999}],"products":[{"_id":101,"name":"Pen"}]}',
        expectedOutput: '[{"_id":2,"productId":999,"productDetails":[]}]',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Perform Bulk Write Operations',
    slug: 'mongodb-bulk-write',
    description: `Write a query to execute a \`bulkWrite\` on the \`users\` collection:
1. Inserts a new user \`{ name: "David", role: "guest" }\`.
2. Updates the role of \`name: "Alice"\` to \`"admin"\`.
3. Deletes the user \`name: "Bob"\`.
Then, return all users (excluding \`_id\`) sorted by name ascending.

You can write this as a raw multi-statement query or as an asynchronous function.

### Example 1:
**users before:**
\`\`\`json
[ { "name": "Alice", "role": "user" }, { "name": "Bob", "role": "user" }, { "name": "Charlie", "role": "user" } ]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "role": "admin" },
  { "name": "Charlie", "role": "user" },
  { "name": "David", "role": "guest" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'write'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `db.users.bulkWrite([
  { insertOne: { document: { name: "David", role: "guest" } } },
  { updateOne: { filter: { name: "Alice" }, update: { $set: { role: "admin" } } } },
  { deleteOne: { filter: { name: "Bob" } } }
]);
db.users.find({}, { projection: { _id: 0 } }).sort({ name: 1 });`,
    order: 714,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","role":"user"},{"name":"Bob","role":"user"},{"name":"Charlie","role":"user"}]}',
        expectedOutput:
          '[{"name":"Alice","role":"admin"},{"name":"Charlie","role":"user"},{"name":"David","role":"guest"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[{"name":"Alice","role":"user"}]}',
        expectedOutput: '[{"name":"Alice","role":"admin"},{"name":"David","role":"guest"}]',
        isHidden: false,
        order: 2,
      },
      {
        input: '{"users":[{"name":"Bob","role":"user"}]}',
        expectedOutput: '[{"name":"David","role":"guest"}]',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Create Database View',
    slug: 'mongodb-create-view',
    description: `Write a query to create a database view named \`active_users\` based on the \`users\` collection containing only documents where \`status\` is "active", and then query the new \`active_users\` view to return its documents (excluding \`_id\`) sorted by name.

You can write this as a raw multi-statement query or as an asynchronous function.

### Example 1:
**users:**
\`\`\`json
[
  { "name": "Alice", "status": "active" },
  { "name": "Bob", "status": "inactive" },
  { "name": "Charlie", "status": "active" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "status": "active" },
  { "name": "Charlie", "status": "active" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'views'],
    starterCode: `// Write your raw MongoDB query or async function here`,
    solutionCode: `try {
  db.createCollection("active_users", {
    viewOn: "users",
    pipeline: [
      { $match: { status: "active" } }
    ]
  });
} catch (e) {
  // Suppress error if view already exists
}
db.collection("active_users").find({}, { projection: { _id: 0 } }).sort({ name: 1 });`,
    order: 715,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","status":"active"},{"name":"Bob","status":"inactive"},{"name":"Charlie","status":"active"}]}',
        expectedOutput: '[{"name":"Alice","status":"active"},{"name":"Charlie","status":"active"}]',
        isHidden: false,
        order: 1,
      },
      { input: '{"users":[]}', expectedOutput: '[]', isHidden: false, order: 2 },
      {
        input: '{"users":[{"name":"X","status":"active"}]}',
        expectedOutput: '[{"name":"X","status":"active"}]',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Active Users Query',
    slug: 'active-users-query',
    description: `Write a query to find active users from the \`users\` collection.
      
Return an array of documents for users where \`status\` is 'active'. Only return the \`name\` and \`email\` fields (and exclude the \`_id\` field). Sort the results by \`name\` in ascending order.

You can write this as a raw query (e.g. \`db.users.find(...)\`) or as an asynchronous function.

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
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ status: 'active' }, { projection: { _id: 0, name: 1, email: 1 } }).sort({ name: 1 })`,
    tags: ['mongodb', 'find'],
    isPublished: true,
    order: 716,
    testCases: [
      {
        input:
          '{"users":[{"_id":1,"name":"Alice","email":"alice@test.com","status":"active"},{"_id":2,"name":"Bob","email":"bob@test.com","status":"inactive"},{"_id":3,"name":"Charlie","email":"charlie@test.com","status":"active"}]}',
        expectedOutput:
          '[{"name":"Alice","email":"alice@test.com"},{"name":"Charlie","email":"charlie@test.com"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[{"_id":1,"name":"Dave","email":"dave@test.com","status":"inactive"}]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Total Revenue by Product',
    slug: 'total-revenue-by-product',
    description: `Write an aggregation query to summarize the \`orders\` collection.
      
Use an aggregation pipeline to:
1. Group orders by \`product\`
2. Sum up the total revenue (\`price\` multiplied by \`quantity\`) as \`totalRevenue\`
3. Sort the results by \`totalRevenue\` in descending order.

You can write this as a raw query (e.g. \`db.orders.aggregate(...)\`) or as an asynchronous function.

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
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.orders.aggregate(...)`,
    solutionCode: `db.orders.aggregate([
  {
    $group: {
      _id: '$product',
      totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } }
    }
  },
  {
    $sort: { totalRevenue: -1 }
  }
])`,
    tags: ['mongodb', 'aggregation'],
    isPublished: true,
    order: 717,
    testCases: [
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
  {
    title: 'Query Active Mature Users',
    slug: 'query-active-mature-users',
    description: `Write a query to find users from the \`users\` collection where \`age\` is greater than 25.

You can write this as a raw query (e.g. \`db.users.find(...)\`) or as an asynchronous function.

### Example:
**Input:**
\`users\` collection:
| name     | age |
|----------|-----|
| John Doe | 30  |
| Alice    | 20  |

**Output:**
\`[ { "name": "John Doe", "age": 30 } ]\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ age: { $gt: 25 } })`,
    tags: ['mongodb', 'find'],
    isPublished: true,
    order: 718,
    testCases: [
      {
        input: '{"users":[{"_id":1,"name":"John Doe","age":30},{"_id":2,"name":"Alice","age":20}]}',
        expectedOutput: '[{"_id":1,"name":"John Doe","age":30}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[{"_id":1,"name":"Bob","age":24},{"_id":2,"name":"Charlie","age":28}]}',
        expectedOutput: '[{"_id":2,"name":"Charlie","age":28}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting MongoDB problems seeding...');

  for (const problemData of mongodbProblems) {
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

  console.log('🎉 Database seeding complete for MongoDB problems!');
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
