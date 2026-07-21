import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 30000,
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

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

const mongodbProblems: ProblemSeed[] = [
  {
    title: 'Find Active Users Over 18',
    slug: 'mongodb-active-users-over-18',
    description: `Write a query to find all documents in the \`users\` collection where \`active\` is \`true\` and \`age\` is greater than or equal to 18.
Return the results projected with only the fields \`name\` and \`age\` (exclude \`_id\` from the output).
Sort the results by \`age\` in ascending order, and then by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alice", "age": 17, "active": true },
  { "name": "Bob", "age": 19, "active": true },
  { "name": "Charlie", "age": 20, "active": false }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Bob", "age": 19 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'filtering'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ active: true, age: { $gte: 18 } }, { _id: 0, name: 1, age: 1 }).sort({ age: 1, name: 1 })`,
    order: 719,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"_id":1,"name":"Alice","age":17,"active":true},{"_id":2,"name":"Bob","age":19,"active":true},{"_id":3,"name":"Charlie","age":20,"active":false}]}',
        expectedOutput: '[{"name":"Bob","age":19}]',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '{"users":[{"_id":1,"name":"Zack","age":25,"active":true},{"_id":2,"name":"Abby","age":25,"active":true}]}',
        expectedOutput: '[{"name":"Abby","age":25},{"name":"Zack","age":25}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Count Users by City',
    slug: 'mongodb-count-users-by-city',
    description: `Write a query to group the documents in the \`users\` collection by the \`city\` field and return the total count of users in each city.
The output documents should have fields \`city\` (representing the city name) and \`totalUsers\` (representing the count). Exclude the \`_id\` field.
Sort the output alphabetically by \`city\`.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "A", "city": "NY" },
  { "name": "B", "city": "LA" },
  { "name": "C", "city": "NY" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "city": "LA", "totalUsers": 1 },
  { "city": "NY", "totalUsers": 2 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'group'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.aggregate(...)`,
    solutionCode: `db.users.aggregate([
  { $group: { _id: "$city", totalUsers: { $sum: 1 } } },
  { $project: { city: "$_id", totalUsers: 1, _id: 0 } },
  { $sort: { city: 1 } }
])`,
    order: 720,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"A","city":"NY"},{"name":"B","city":"LA"},{"name":"C","city":"NY"}]}',
        expectedOutput: '[{"city":"LA","totalUsers":1},{"city":"NY","totalUsers":2}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Filter Products by Multiple Tags',
    slug: 'mongodb-filter-products-by-tags',
    description: `Write a query to find all products in the \`products\` collection that contain both \`"electronics"\` and \`"wireless"\` in their \`tags\` array.
Return only the \`name\` and \`tags\` fields, excluding the \`_id\` field.
Sort the results alphabetically by product \`name\`.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "Phone", "tags": ["electronics", "wireless"] },
  { "name": "TV", "tags": ["electronics", "cable"] },
  { "name": "Mouse", "tags": ["wireless", "computer"] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Phone", "tags": ["electronics", "wireless"] }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'array'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.find(...)`,
    solutionCode: `db.products.find({ tags: { $all: ["electronics", "wireless"] } }, { _id: 0, name: 1, tags: 1 }).sort({ name: 1 })`,
    order: 721,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"Phone","tags":["electronics","wireless"]},{"name":"TV","tags":["electronics","cable"]},{"name":"Mouse","tags":["wireless","computer"]}]}',
        expectedOutput: '[{"name":"Phone","tags":["electronics","wireless"]}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Highest Priced Product per Category',
    slug: 'mongodb-highest-price-per-category',
    description: `Write a query to group products in the \`products\` collection by \`category\` and find the highest product price in each category.
The output documents should contain the fields \`category\` and \`maxPrice\` (representing the maximum price). Exclude the \`_id\` field.
Sort the results by \`maxPrice\` in descending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "A", "category": "Books", "price": 10 },
  { "name": "B", "category": "Books", "price": 20 },
  { "name": "C", "category": "Toys", "price": 15 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "category": "Books", "maxPrice": 20 },
  { "category": "Toys", "maxPrice": 15 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'max'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $group: { _id: "$category", maxPrice: { $max: "$price" } } },
  { $project: { category: "$_id", maxPrice: 1, _id: 0 } },
  { $sort: { maxPrice: -1 } }
])`,
    order: 722,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"A","category":"Books","price":10},{"name":"B","category":"Books","price":20},{"name":"C","category":"Toys","price":15}]}',
        expectedOutput: '[{"category":"Books","maxPrice":20},{"category":"Toys","maxPrice":15}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Concatenate First and Last Name',
    slug: 'mongodb-concat-first-last-name',
    description: `Write a query to project the \`firstName\` and \`lastName\` fields in the \`users\` collection as a single concatenated field named \`fullName\`, separated by a space (e.g. \`"John Doe"\`).
Exclude the \`_id\` field.
Sort the results by \`fullName\` alphabetically in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "firstName": "John", "lastName": "Doe" },
  { "firstName": "Jane", "lastName": "Smith" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "fullName": "Jane Smith" },
  { "fullName": "John Doe" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'projection', 'string'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.aggregate(...)`,
    solutionCode: `db.users.aggregate([
  { $project: { fullName: { $concat: ["$firstName", " ", "$lastName"] }, _id: 0 } },
  { $sort: { fullName: 1 } }
])`,
    order: 723,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"firstName":"John","lastName":"Doe"},{"firstName":"Jane","lastName":"Smith"}]}',
        expectedOutput: '[{"fullName":"Jane Smith"},{"fullName":"John Doe"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Find Older Employees',
    slug: 'mongodb-older-employees',
    description: `Write a query to find all employees in the \`employees\` collection whose \`age\` is strictly greater than 50, OR who have been with the company for at least 25 years (\`yearsOfService >= 25\`).
Return only the \`name\` field of matching employees (exclude the \`_id\` field from results).
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`employees\` collection:
\`\`\`json
[
  { "name": "Alice", "age": 45, "yearsOfService": 26 },
  { "name": "Bob", "age": 52, "yearsOfService": 10 },
  { "name": "Charlie", "age": 30, "yearsOfService": 5 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice" },
  { "name": "Bob" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'filtering'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.employees.find(...)`,
    solutionCode: `db.employees.find({ $or: [ { age: { $gt: 50 } }, { yearsOfService: { $gte: 25 } } ] }, { _id: 0, name: 1 }).sort({ name: 1 })`,
    order: 724,
    isPublished: true,
    testCases: [
      {
        input:
          '{"employees":[{"name":"Alice","age":45,"yearsOfService":26},{"name":"Bob","age":52,"yearsOfService":10},{"name":"Charlie","age":30,"yearsOfService":5}]}',
        expectedOutput: '[{"name":"Alice"},{"name":"Bob"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"employees":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Calculate Total Inventory Value',
    slug: 'mongodb-total-inventory-value',
    description: `Write a query to calculate the total value of all items in the \`inventory\` collection.
The value of an item is calculated as \`price * quantity\`.
The result should be returned as a single document with the field \`totalValue\` representing the sum of all item values.
If the collection is empty, return an empty array.

### Example:
**Input:**
\`inventory\` collection:
\`\`\`json
[
  { "item": "A", "price": 10, "quantity": 5 },
  { "item": "B", "price": 20, "quantity": 3 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "totalValue": 110 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'multiply'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.inventory.aggregate(...)`,
    solutionCode: `db.inventory.aggregate([
  { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$quantity"] } } } },
  { $project: { _id: 0, totalValue: 1 } }
])`,
    order: 725,
    isPublished: true,
    testCases: [
      {
        input:
          '{"inventory":[{"item":"A","price":10,"quantity":5},{"item":"B","price":20,"quantity":3}]}',
        expectedOutput: '[{"totalValue":110}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"inventory":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Filter Orders by Year',
    slug: 'mongodb-filter-orders-by-year',
    description: `Write a query to find all orders in the \`orders\` collection that were placed in the year 2023.
Return the \`orderId\` and \`date\` fields, excluding the \`_id\` field from results.
Sort the results by \`date\` in ascending order.

### Example:
**Input:**
\`orders\` collection:
\`\`\`json
[
  { "orderId": "101", "date": "2023-05-15T00:00:00Z" },
  { "orderId": "102", "date": "2022-12-31T23:59:59Z" },
  { "orderId": "103", "date": "2023-01-01T00:00:00Z" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "orderId": "103", "date": "2023-01-01T00:00:00Z" },
  { "orderId": "101", "date": "2023-05-15T00:00:00Z" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'date'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.orders.aggregate(...)`,
    solutionCode: `db.orders.aggregate([
  { $project: { orderId: 1, date: 1, year: { $year: "$date" }, _id: 0 } },
  { $match: { year: 2023 } },
  { $project: { year: 0 } },
  { $sort: { date: 1 } }
])`,
    order: 726,
    isPublished: true,
    testCases: [
      {
        input:
          '{"orders":[{"orderId":"101","date":{"$date":"2023-05-15T00:00:00Z"}},{"orderId":"102","date":{"$date":"2022-12-31T23:59:59Z"}},{"orderId":"103","date":{"$date":"2023-01-01T00:00:00Z"}}]}',
        expectedOutput:
          '[{"orderId":"103","date":"2023-01-01T00:00:00Z"},{"orderId":"101","date":"2023-05-15T00:00:00Z"}]',
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
    title: 'Average Rating of Reviews',
    slug: 'mongodb-average-review-rating',
    description: `Each document in the \`products\` collection contains a nested array of \`reviews\`, where each review has a numeric \`rating\`.
Write a query to calculate the average rating for each product.
Return documents with the product \`name\` and a new field \`averageRating\`. Exclude the \`_id\` field.
Sort the results by \`averageRating\` in descending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "Product A", "reviews": [{ "rating": 5 }, { "rating": 4 }] },
  { "name": "Product B", "reviews": [{ "rating": 3 }, { "rating": 3 }] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Product A", "averageRating": 4.5 },
  { "name": "Product B", "averageRating": 3 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'average'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $project: { name: 1, averageRating: { $avg: "$reviews.rating" }, _id: 0 } },
  { $sort: { averageRating: -1 } }
])`,
    order: 727,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"Product A","reviews":[{"rating":5},{"rating":4}]},{"name":"Product B","reviews":[{"rating":3},{"rating":3}]}]}',
        expectedOutput:
          '[{"name":"Product A","averageRating":4.5},{"name":"Product B","averageRating":3}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Find Books with Multiple Authors',
    slug: 'mongodb-books-multiple-authors',
    description: `Write a query to find all books in the \`books\` collection where the size of the \`authors\` array is strictly greater than 3.
Return only the \`title\` and \`authors\` fields, excluding the \`_id\` field.
Sort the results alphabetically by book \`title\` in ascending order.

### Example:
**Input:**
\`books\` collection:
\`\`\`json
[
  { "title": "Book A", "authors": ["A1", "A2", "A3", "A4"] },
  { "title": "Book B", "authors": ["A1", "A2"] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "title": "Book A", "authors": ["A1", "A2", "A3", "A4"] }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'array-size'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.books.aggregate(...)`,
    solutionCode: `db.books.aggregate([
  { $project: { title: 1, authors: 1, numAuthors: { $size: { $ifNull: ["$authors", []] } }, _id: 0 } },
  { $match: { numAuthors: { $gt: 3 } } },
  { $project: { numAuthors: 0 } },
  { $sort: { title: 1 } }
])`,
    order: 728,
    isPublished: true,
    testCases: [
      {
        input:
          '{"books":[{"title":"Book A","authors":["A1","A2","A3","A4"]},{"title":"Book B","authors":["A1","A2"]}]}',
        expectedOutput: '[{"title":"Book A","authors":["A1","A2","A3","A4"]}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"books":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Retrieve Out of Stock Items',
    slug: 'mongodb-out-of-stock-items',
    description: `Write a query to find all products in the \`products\` collection where the \`stock\` field is either \`0\`, \`null\`, or does not exist at all.
Return only the \`name\` and \`stock\` fields, excluding the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "Pen", "stock": 0 },
  { "name": "Pencil", "stock": 5 },
  { "name": "Notebook" },
  { "name": "Eraser", "stock": null }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Eraser", "stock": null },
  { "name": "Notebook" },
  { "name": "Pen", "stock": 0 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'null-handling'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.find(...)`,
    solutionCode: `db.products.find({ $or: [ { stock: 0 }, { stock: null }, { stock: { $exists: false } } ] }, { _id: 0, name: 1, stock: 1 }).sort({ name: 1 })`,
    order: 729,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"Pen","stock":0},{"name":"Pencil","stock":5},{"name":"Notebook"},{"name":"Eraser","stock":null}]}',
        expectedOutput:
          '[{"name":"Eraser","stock":null},{"name":"Notebook"},{"name":"Pen","stock":0}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Calculate Discounted Price',
    slug: 'mongodb-discounted-price',
    description: `Project a new field \`discountedPrice\` for each product in the \`products\` collection. The \`discountedPrice\` should be calculated as the original \`price\` minus 15% (i.e. \`price * 0.85\`).
Return the fields \`name\`, \`price\`, and \`discountedPrice\`. Exclude the \`_id\` field from results.
Sort the results by product \`name\` alphabetically in ascending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "Shoes", "price": 100 },
  { "name": "Socks", "price": 10 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Shoes", "price": 100, "discountedPrice": 85 },
  { "name": "Socks", "price": 10, "discountedPrice": 8.5 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'math'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $project: { name: 1, price: 1, discountedPrice: { $multiply: ["$price", 0.85] }, _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 730,
    isPublished: true,
    testCases: [
      {
        input: '{"products":[{"name":"Shoes","price":100},{"name":"Socks","price":10}]}',
        expectedOutput:
          '[{"name":"Shoes","price":100,"discountedPrice":85},{"name":"Socks","price":10,"discountedPrice":8.5}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Get List of Unique Categories',
    slug: 'mongodb-unique-categories',
    description: `Write a query to find all unique categories in the \`products\` collection.
The results should be returned as documents containing only the field \`category\` (excluding \`_id\` and any null values).
Sort the output alphabetically by \`category\` in ascending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "A", "category": "Toys" },
  { "name": "B", "category": "Electronics" },
  { "name": "C", "category": "Toys" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "category": "Electronics" },
  { "category": "Toys" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'group', 'unique'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $group: { _id: "$category" } },
  { $match: { _id: { $ne: null } } },
  { $project: { category: "$_id", _id: 0 } },
  { $sort: { category: 1 } }
])`,
    order: 731,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"A","category":"Toys"},{"name":"B","category":"Electronics"},{"name":"C","category":"Toys"}]}',
        expectedOutput: '[{"category":"Electronics"},{"category":"Toys"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Find Top 3 Highest Earners',
    slug: 'mongodb-top-three-earners',
    description: `Write a query to find the top 3 employees in the \`employees\` collection who have the highest \`salary\`.
Return their \`name\` and \`salary\` fields, excluding the \`_id\` field from results.
Sort the results by \`salary\` in descending order, and then by \`name\` alphabetically in ascending order.

### Example:
**Input:**
\`employees\` collection:
\`\`\`json
[
  { "name": "John", "salary": 80000 },
  { "name": "Jane", "salary": 95000 },
  { "name": "Bob", "salary": 70000 },
  { "name": "Alice", "salary": 110000 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "salary": 110000 },
  { "name": "Jane", "salary": 95000 },
  { "name": "John", "salary": 80000 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'sort', 'limit'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.employees.find(...)`,
    solutionCode: `db.employees.find({}, { _id: 0, name: 1, salary: 1 }).sort({ salary: -1, name: 1 }).limit(3)`,
    order: 732,
    isPublished: true,
    testCases: [
      {
        input:
          '{"employees":[{"name":"John","salary":80000},{"name":"Jane","salary":95000},{"name":"Bob","salary":70000},{"name":"Alice","salary":110000}]}',
        expectedOutput:
          '[{"name":"Alice","salary":110000},{"name":"Jane","salary":95000},{"name":"John","salary":80000}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"employees":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Filter by Nested Address Country',
    slug: 'mongodb-filter-nested-country',
    description: `Write a query to find all users in the \`users\` collection whose nested field \`address.country\` is exactly \`"Canada"\`.
Return their \`name\` and the nested \`address\` field (exclude the \`_id\` field from results).
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alex", "address": { "city": "Toronto", "country": "Canada" } },
  { "name": "Brad", "address": { "city": "Seattle", "country": "USA" } }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alex", "address": { "city": "Toronto", "country": "Canada" } }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'nested-objects'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ "address.country": "Canada" }, { _id: 0, name: 1, address: 1 }).sort({ name: 1 })`,
    order: 733,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alex","address":{"city":"Toronto","country":"Canada"}},{"name":"Brad","address":{"city":"Seattle","country":"USA"}}]}',
        expectedOutput: '[{"name":"Alex","address":{"city":"Toronto","country":"Canada"}}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Rename Age Field to Years',
    slug: 'mongodb-rename-age-field',
    description: `Write a query to retrieve all documents from the \`users\` collection, projecting the field \`age\` renamed to \`years\`, and including the field \`name\`.
Exclude the \`_id\` field from the results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Zack", "age": 30 },
  { "name": "Ana", "age": 25 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Ana", "years": 25 },
  { "name": "Zack", "years": 30 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'rename', 'projection'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.aggregate(...)`,
    solutionCode: `db.users.aggregate([
  { $project: { name: 1, years: "$age", _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 734,
    isPublished: true,
    testCases: [
      {
        input: '{"users":[{"name":"Zack","age":30},{"name":"Ana","age":25}]}',
        expectedOutput: '[{"name":"Ana","years":25},{"name":"Zack","years":30}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Calculate Order Quantity Stats',
    slug: 'mongodb-order-quantity-stats',
    description: `Write a query to find the minimum, maximum, and average value of the \`quantity\` field across all documents in the \`orders\` collection.
The result should be returned as a single document containing fields \`minQty\`, \`maxQty\`, and \`avgQty\`. Exclude the \`_id\` field.
If the collection is empty, return an empty array.

### Example:
**Input:**
\`orders\` collection:
\`\`\`json
[
  { "orderId": 1, "quantity": 10 },
  { "orderId": 2, "quantity": 20 },
  { "orderId": 3, "quantity": 30 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "minQty": 10, "maxQty": 30, "avgQty": 20 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'statistics'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.orders.aggregate(...)`,
    solutionCode: `db.orders.aggregate([
  { $group: { _id: null, minQty: { $min: "$quantity" }, maxQty: { $max: "$quantity" }, avgQty: { $avg: "$quantity" } } },
  { $project: { _id: 0, minQty: 1, maxQty: 1, avgQty: 1 } }
])`,
    order: 735,
    isPublished: true,
    testCases: [
      {
        input:
          '{"orders":[{"orderId":1,"quantity":10},{"orderId":2,"quantity":20},{"orderId":3,"quantity":30}]}',
        expectedOutput: '[{"minQty":10,"maxQty":30,"avgQty":20}]',
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
    title: 'Find Tasks with High Priority',
    slug: 'mongodb-high-priority-tasks',
    description: `Write a query to find all tasks in the \`tasks\` collection where the \`priority\` is \`"High"\` AND the \`status\` is NOT \`"Completed"\`.
Return only the fields \`title\` and \`priority\`, excluding the \`_id\` field from results.
Sort the results alphabetically by \`title\` in ascending order.

### Example:
**Input:**
\`tasks\` collection:
\`\`\`json
[
  { "title": "Task 1", "priority": "High", "status": "In Progress" },
  { "title": "Task 2", "priority": "High", "status": "Completed" },
  { "title": "Task 3", "priority": "Low", "status": "In Progress" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "title": "Task 1", "priority": "High" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'filtering'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.tasks.find(...)`,
    solutionCode: `db.tasks.find({ priority: "High", status: { $ne: "Completed" } }, { _id: 0, title: 1, priority: 1 }).sort({ title: 1 })`,
    order: 736,
    isPublished: true,
    testCases: [
      {
        input:
          '{"tasks":[{"title":"Task 1","priority":"High","status":"In Progress"},{"title":"Task 2","priority":"High","status":"Completed"},{"title":"Task 3","priority":"Low","status":"In Progress"}]}',
        expectedOutput: '[{"title":"Task 1","priority":"High"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"tasks":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Get Character Length of Description',
    slug: 'mongodb-description-character-length',
    description: `For each product in the \`products\` collection, calculate the character length of its \`description\` field.
Return documents with fields \`name\` and \`descLength\` (representing the character count of \`description\`). If \`description\` is null or missing, treat the length as 0. Exclude the \`_id\` field from results.
Sort the results by \`descLength\` in descending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "A", "description": "Short" },
  { "name": "B", "description": "A bit longer" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "B", "descLength": 12 },
  { "name": "A", "descLength": 5 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'string-length'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $project: { name: 1, descLength: { $strLenCP: { $ifNull: ["$description", ""] } }, _id: 0 } },
  { $sort: { descLength: -1 } }
])`,
    order: 737,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"A","description":"Short"},{"name":"B","description":"A bit longer"}]}',
        expectedOutput: '[{"name":"B","descLength":12},{"name":"A","descLength":5}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Users with Null or Missing Emails',
    slug: 'mongodb-users-null-emails',
    description: `Write a query to find all users in the \`users\` collection who have a \`null\` email OR are missing the \`email\` field entirely.
Return only their \`name\` field, excluding the \`_id\` field.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alice", "email": null },
  { "name": "Bob", "email": "bob@example.com" },
  { "name": "Charlie" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice" },
  { "name": "Charlie" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'null-handling'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ $or: [ { email: null }, { email: { $exists: false } } ] }, { _id: 0, name: 1 }).sort({ name: 1 })`,
    order: 738,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","email":null},{"name":"Bob","email":"bob@example.com"},{"name":"Charlie"}]}',
        expectedOutput: '[{"name":"Alice"},{"name":"Charlie"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Unwind and Count Tag Frequency',
    slug: 'mongodb-tag-frequency',
    description: `Using the \`products\` collection, unwind the \`tags\` array and calculate the frequency/count of each tag across all products.
Return documents containing fields \`tag\` (representing the tag name) and \`frequency\` (the count of its occurrences). Exclude the \`_id\` field.
Sort the results by \`frequency\` in descending order, and then by \`tag\` alphabetically in ascending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "A", "tags": ["tech", "home"] },
  { "name": "B", "tags": ["tech", "office"] },
  { "name": "C", "tags": ["home"] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "tag": "home", "frequency": 2 },
  { "tag": "tech", "frequency": 2 },
  { "tag": "office", "frequency": 1 }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'unwind', 'group'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", frequency: { $sum: 1 } } },
  { $project: { tag: "$_id", frequency: 1, _id: 0 } },
  { $sort: { frequency: -1, tag: 1 } }
])`,
    order: 739,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"A","tags":["tech","home"]},{"name":"B","tags":["tech","office"]},{"name":"C","tags":["home"]}]}',
        expectedOutput:
          '[{"tag":"home","frequency":2},{"tag":"tech","frequency":2},{"tag":"office","frequency":1}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Filter Array Elements using $filter',
    slug: 'mongodb-filter-array-elements',
    description: `In the \`students\` collection, each document contains an array of \`scores\` (integers).
Write a query using the \`$filter\` operator to return only the scores that are greater than or equal to 80.
The output should project the \`name\` of the student and a new field \`highScores\` containing the filtered array. Exclude the \`_id\` field from results.
Sort the results by \`name\` alphabetically in ascending order.

### Example:
**Input:**
\`students\` collection:
\`\`\`json
[
  { "name": "Alice", "scores": [90, 75, 85] },
  { "name": "Bob", "scores": [60, 70, 50] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "highScores": [90, 85] },
  { "name": "Bob", "highScores": [] }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'filter-array'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.students.aggregate(...)`,
    solutionCode: `db.students.aggregate([
  { $project: { name: 1, highScores: { $filter: { input: { $ifNull: ["$scores", []] }, as: "score", cond: { $gte: ["$$score", 80] } } }, _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 740,
    isPublished: true,
    testCases: [
      {
        input:
          '{"students":[{"name":"Alice","scores":[90,75,85]},{"name":"Bob","scores":[60,70,50]}]}',
        expectedOutput: '[{"name":"Alice","highScores":[90,85]},{"name":"Bob","highScores":[]}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"students":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Calculate Salary Grade',
    slug: 'mongodb-calculate-salary-grade',
    description: `For each employee in the \`employees\` collection, determine their salary grade using a conditional expression:
- Grade \`"A"\` if \`salary\` is 100,000 or more.
- Grade \`"B"\` if \`salary\` is between 50,000 (inclusive) and 100,000 (exclusive).
- Grade \`"C"\` otherwise.
Return the fields \`name\`, \`salary\`, and a new field \`grade\`. Exclude the \`_id\` field from results.
Sort the results by \`salary\` in descending order, and then by \`name\` alphabetically in ascending order.

### Example:
**Input:**
\`employees\` collection:
\`\`\`json
[
  { "name": "Joe", "salary": 45000 },
  { "name": "Max", "salary": 120000 },
  { "name": "Sam", "salary": 85000 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Max", "salary": 120000, "grade": "A" },
  { "name": "Sam", "salary": 85000, "grade": "B" },
  { "name": "Joe", "salary": 45000, "grade": "C" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'conditional'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.employees.aggregate(...)`,
    solutionCode: `db.employees.aggregate([
  { $project: {
    name: 1,
    salary: 1,
    grade: {
      $cond: {
        if: { $gte: ["$salary", 100000] },
        then: "A",
        else: {
          $cond: {
            if: { $gte: ["$salary", 50000] },
            then: "B",
            else: "C"
          }
        }
      }
    },
    _id: 0
  } },
  { $sort: { salary: -1, name: 1 } }
])`,
    order: 741,
    isPublished: true,
    testCases: [
      {
        input:
          '{"employees":[{"name":"Joe","salary":45000},{"name":"Max","salary":120000},{"name":"Sam","salary":85000}]}',
        expectedOutput:
          '[{"name":"Max","salary":120000,"grade":"A"},{"name":"Sam","salary":85000,"grade":"B"},{"name":"Joe","salary":45000,"grade":"C"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"employees":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Group Orders by Month',
    slug: 'mongodb-orders-by-month',
    description: `Group all orders in the \`orders\` collection by the month they were placed.
The \`date\` field is stored as a Date object.
Return the fields \`month\` (numeric month value from 1 to 12) and \`totalSales\` (the sum of \`amount\` for that month). Exclude the \`_id\` field from results.
Sort the results by \`month\` in ascending order.

### Example:
**Input:**
\`orders\` collection:
\`\`\`json
[
  { "amount": 100, "date": "2023-01-15T00:00:00Z" },
  { "amount": 200, "date": "2023-02-10T00:00:00Z" },
  { "amount": 150, "date": "2023-01-20T00:00:00Z" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "month": 1, "totalSales": 250 },
  { "month": 2, "totalSales": 200 }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'date-group'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.orders.aggregate(...)`,
    solutionCode: `db.orders.aggregate([
  { $project: { month: { $month: "$date" }, amount: 1 } },
  { $group: { _id: "$month", totalSales: { $sum: "$amount" } } },
  { $project: { month: "$_id", totalSales: 1, _id: 0 } },
  { $sort: { month: 1 } }
])`,
    order: 742,
    isPublished: true,
    testCases: [
      {
        input:
          '{"orders":[{"amount":100,"date":{"$date":"2023-01-15T00:00:00Z"}},{"amount":200,"date":{"$date":"2023-02-10T00:00:00Z"}},{"amount":150,"date":{"$date":"2023-01-20T00:00:00Z"}}]}',
        expectedOutput: '[{"month":1,"totalSales":250},{"month":2,"totalSales":200}]',
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
    title: 'Join Customers and Orders',
    slug: 'mongodb-join-customers-orders',
    description: `Perform a join between the \`customers\` and \`orders\` collections using the \`$lookup\` operator.
Match the \`customers.id\` field with the \`orders.customer_id\` field.
Return documents containing the customer's \`name\` and a new field \`orderCount\` representing the total number of orders placed by this customer. Exclude \`_id\`.
Sort the results by \`orderCount\` in descending order, and then by \`name\` alphabetically in ascending order.

### Example:
**Input:**
\`customers\` collection:
\`\`\`json
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
\`\`\`
\`orders\` collection:
\`\`\`json
[
  { "id": 101, "customer_id": 1 },
  { "id": 102, "customer_id": 1 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "orderCount": 2 },
  { "name": "Bob", "orderCount": 0 }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'lookup', 'join'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.customers.aggregate(...)`,
    solutionCode: `db.customers.aggregate([
  { $lookup: {
    from: "orders",
    localField: "id",
    foreignField: "customer_id",
    as: "customerOrders"
  } },
  { $project: { name: 1, orderCount: { $size: "$customerOrders" }, _id: 0 } },
  { $sort: { orderCount: -1, name: 1 } }
])`,
    order: 743,
    isPublished: true,
    testCases: [
      {
        input:
          '{"customers":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"orders":[{"id":101,"customer_id":1},{"id":102,"customer_id":1}]}',
        expectedOutput: '[{"name":"Alice","orderCount":2},{"name":"Bob","orderCount":0}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"customers":[],"orders":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Highest Scored Subject per Student',
    slug: 'mongodb-highest-scored-subject',
    description: `Each document in the \`students\` collection contains an array of \`scores\` objects, where each object has fields \`subject\` (string) and \`score\` (integer).
Write a query to find the highest scoring subject and its score for each student.
Return documents with the \`name\` of the student, and fields \`subject\` and \`score\` representing their highest scored subject. Exclude the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`students\` collection:
\`\`\`json
[
  { "name": "Alice", "scores": [{ "subject": "Math", "score": 90 }, { "subject": "English", "score": 95 }] },
  { "name": "Bob", "scores": [{ "subject": "Math", "score": 85 }, { "subject": "English", "score": 80 }] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "subject": "English", "score": 95 },
  { "name": "Bob", "subject": "Math", "score": 85 }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'unwind', 'group'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.students.aggregate(...)`,
    solutionCode: `db.students.aggregate([
  { $unwind: "$scores" },
  { $sort: { "scores.score": -1 } },
  { $group: {
    _id: "$name",
    topSubject: { $first: "$scores" }
  } },
  { $project: { name: "$_id", subject: "$topSubject.subject", score: "$topSubject.score", _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 744,
    isPublished: true,
    testCases: [
      {
        input:
          '{"students":[{"name":"Alice","scores":[{"subject":"Math","score":90},{"subject":"English","score":95}]},{"name":"Bob","scores":[{"subject":"Math","score":85},{"subject":"English","score":80}]}]}',
        expectedOutput:
          '[{"name":"Alice","subject":"English","score":95},{"name":"Bob","subject":"Math","score":85}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"students":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Common Tags Between Preferences',
    slug: 'mongodb-common-tags',
    description: `In the \`users\` collection, each document contains two arrays: \`likes\` and \`recommended\`.
Write a query to find the intersection (common items) between these two arrays.
Project the user \`name\` and a new field \`common\` containing the array of common items. Exclude the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alice", "likes": ["apple", "banana"], "recommended": ["banana", "orange"] },
  { "name": "Bob", "likes": ["grape"], "recommended": ["pear"] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "common": ["banana"] },
  { "name": "Bob", "common": [] }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'set-operators'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.aggregate(...)`,
    solutionCode: `db.users.aggregate([
  { $project: { name: 1, common: { $setIntersection: ["$likes", "$recommended"] }, _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 745,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","likes":["apple","banana"],"recommended":["banana","orange"]},{"name":"Bob","likes":["grape"],"recommended":["pear"]}]}',
        expectedOutput: '[{"name":"Alice","common":["banana"]},{"name":"Bob","common":[]}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Extract Area Code from Phone',
    slug: 'mongodb-extract-area-code',
    description: `In the \`contacts\` collection, each document contains a string field \`phone\` in the format \`XXX-XXX-XXXX\`.
Write a query to extract the area code (the first 3 characters) and return it in a new field named \`areaCode\`, along with the contact \`name\`.
Exclude the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`contacts\` collection:
\`\`\`json
[
  { "name": "Alice", "phone": "123-456-7890" },
  { "name": "Bob", "phone": "987-654-3210" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "areaCode": "123" },
  { "name": "Bob", "areaCode": "987" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'substring'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.contacts.aggregate(...)`,
    solutionCode: `db.contacts.aggregate([
  { $project: { name: 1, areaCode: { $substrCP: ["$phone", 0, 3] }, _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 746,
    isPublished: true,
    testCases: [
      {
        input:
          '{"contacts":[{"name":"Alice","phone":"123-456-7890"},{"name":"Bob","phone":"987-654-3210"}]}',
        expectedOutput: '[{"name":"Alice","areaCode":"123"},{"name":"Bob","areaCode":"987"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"contacts":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Total Transaction Amount by User',
    slug: 'mongodb-total-transactions',
    description: `In the \`accounts\` collection, each document represents a user account and contains a nested array \`transactions\` where each transaction document has a field \`type\` (\`"deposit"\` or \`"withdrawal"\`) and \`amount\` (positive integer).
Write a query to calculate the net balance for each user by adding deposits and subtracting withdrawals.
Return documents with the user's \`name\` and their net \`balance\`. Exclude \`_id\`.
Sort the results by \`balance\` in descending order, and then by \`name\` alphabetically in ascending order.

### Example:
**Input:**
\`accounts\` collection:
\`\`\`json
[
  { "name": "Alice", "transactions": [{ "type": "deposit", "amount": 100 }, { "type": "withdrawal", "amount": 30 }] },
  { "name": "Bob", "transactions": [{ "type": "deposit", "amount": 50 }] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "balance": 70 },
  { "name": "Bob", "balance": 50 }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'unwind', 'conditional-sum'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.accounts.aggregate(...)`,
    solutionCode: `db.accounts.aggregate([
  { $unwind: { path: "$transactions", preserveNullAndEmptyArrays: true } },
  { $project: {
    name: 1,
    netAmount: {
      $cond: {
        if: { $eq: ["$transactions.type", "deposit"] },
        then: "$transactions.amount",
        else: {
          $cond: {
            if: { $eq: ["$transactions.type", "withdrawal"] },
            then: { $multiply: ["$transactions.amount", -1] },
            else: 0
          }
        }
      }
    }
  } },
  { $group: { _id: "$name", balance: { $sum: "$netAmount" } } },
  { $project: { name: "$_id", balance: 1, _id: 0 } },
  { $sort: { balance: -1, name: 1 } }
])`,
    order: 747,
    isPublished: true,
    testCases: [
      {
        input:
          '{"accounts":[{"name":"Alice","transactions":[{"type":"deposit","amount":100},{"type":"withdrawal","amount":30}]},{"name":"Bob","transactions":[{"type":"deposit","amount":50}]}]}',
        expectedOutput: '[{"name":"Alice","balance":70},{"name":"Bob","balance":50}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"accounts":[{"name":"Charlie","transactions":[]}]}',
        expectedOutput: '[{"name":"Charlie","balance":0}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Filter Tasks Overdue',
    slug: 'mongodb-overdue-tasks',
    description: `Each document in the \`projects\` collection represents a project and contains a nested array \`tasks\` where each task has a \`title\` (string), a \`dueDate\` (Date object), and a \`completed\` (boolean) status.
Write a query to find all projects that have at least one uncompleted task with a \`dueDate\` before \`2023-06-01T00:00:00Z\`.
Return only the project \`name\` field, excluding the \`_id\` field.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`projects\` collection:
\`\`\`json
[
  { "name": "Project Alpha", "tasks": [{ "title": "Task 1", "dueDate": "2023-05-15T00:00:00Z", "completed": false }] },
  { "name": "Project Beta", "tasks": [{ "title": "Task 2", "dueDate": "2023-07-01T00:00:00Z", "completed": false }] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Project Alpha" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'date-comparison', 'unwind'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.projects.aggregate(...)`,
    solutionCode: `db.projects.aggregate([
  { $unwind: "$tasks" },
  { $match: { "tasks.completed": false, "tasks.dueDate": { $lt: new Date("2023-06-01T00:00:00Z") } } },
  { $group: { _id: "$name" } },
  { $project: { name: "$_id", _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 748,
    isPublished: true,
    testCases: [
      {
        input:
          '{"projects":[{"name":"Project Alpha","tasks":[{"title":"Task 1","dueDate":{"$date":"2023-05-15T00:00:00Z"},"completed":false}]},{"name":"Project Beta","tasks":[{"title":"Task 2","dueDate":{"$date":"2023-07-01T00:00:00Z"},"completed":false}]}]}',
        expectedOutput: '[{"name":"Project Alpha"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"projects":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Average Age of Active Customers',
    slug: 'mongodb-avg-age-active-customers',
    description: `Write a query to find the average age of active customers in the \`customers\` collection (where \`status\` is \`"active"\`).
Return the result as a single document with the field \`avgAge\`. Exclude \`_id\`.
If there are no active customers, return an empty array.

### Example:
**Input:**
\`customers\` collection:
\`\`\`json
[
  { "name": "Alice", "age": 30, "status": "active" },
  { "name": "Bob", "age": 40, "status": "active" },
  { "name": "Charlie", "age": 25, "status": "inactive" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "avgAge": 35 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'match', 'average'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.customers.aggregate(...)`,
    solutionCode: `db.customers.aggregate([
  { $match: { status: "active" } },
  { $group: { _id: null, avgAge: { $avg: "$age" } } },
  { $project: { avgAge: 1, _id: 0 } }
])`,
    order: 749,
    isPublished: true,
    testCases: [
      {
        input:
          '{"customers":[{"name":"Alice","age":30,"status":"active"},{"name":"Bob","age":40,"status":"active"},{"name":"Charlie","age":25,"status":"inactive"}]}',
        expectedOutput: '[{"avgAge":35}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"customers":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Match Products with Price Limits',
    slug: 'mongodb-products-price-limits',
    description: `Write a query to find all products in the \`products\` collection whose \`price\` is between \`50\` (inclusive) and \`150\` (inclusive), AND whose \`inStock\` status is \`true\`.
Return the \`name\` and \`price\` fields, excluding the \`_id\` field from results.
Sort the results by \`price\` in ascending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "A", "price": 40, "inStock": true },
  { "name": "B", "price": 100, "inStock": true },
  { "name": "C", "price": 150, "inStock": true },
  { "name": "D", "price": 120, "inStock": false }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "B", "price": 100 },
  { "name": "C", "price": 150 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'filtering'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.find(...)`,
    solutionCode: `db.products.find({ price: { $gte: 50, $lte: 150 }, inStock: true }, { _id: 0, name: 1, price: 1 }).sort({ price: 1 })`,
    order: 750,
    isPublished: true,
    testCases: [
      {
        input:
          '{"products":[{"name":"A","price":40,"inStock":true},{"name":"B","price":100,"inStock":true},{"name":"C","price":150,"inStock":true},{"name":"D","price":120,"inStock":false}]}',
        expectedOutput: '[{"name":"B","price":100},{"name":"C","price":150}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Find Top 2 Rated Books',
    slug: 'mongodb-top-rated-books',
    description: `Write a query to find the top 2 books in the \`books\` collection with the highest \`rating\`.
Return their \`title\` and \`rating\` fields, excluding the \`_id\` field from results.
Sort the results by \`rating\` in descending order, then alphabetically by \`title\` in ascending order.

### Example:
**Input:**
\`books\` collection:
\`\`\`json
[
  { "title": "Book 1", "rating": 4.5 },
  { "title": "Book 2", "rating": 4.9 },
  { "title": "Book 3", "rating": 4.7 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "title": "Book 2", "rating": 4.9 },
  { "title": "Book 3", "rating": 4.7 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'sort', 'limit'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.books.find(...)`,
    solutionCode: `db.books.find({}, { _id: 0, title: 1, rating: 1 }).sort({ rating: -1, title: 1 }).limit(2)`,
    order: 751,
    isPublished: true,
    testCases: [
      {
        input:
          '{"books":[{"title":"Book 1","rating":4.5},{"title":"Book 2","rating":4.9},{"title":"Book 3","rating":4.7}]}',
        expectedOutput: '[{"title":"Book 2","rating":4.9},{"title":"Book 3","rating":4.7}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"books":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Count Employees in Department',
    slug: 'mongodb-employees-in-department',
    description: `Group employees in the \`employees\` collection by the \`department\` field, and count the total number of employees in each department.
Return the fields \`department\` and \`count\`. Exclude \`_id\`.
Sort the results alphabetically by \`department\` in ascending order.

### Example:
**Input:**
\`employees\` collection:
\`\`\`json
[
  { "name": "Alice", "department": "HR" },
  { "name": "Bob", "department": "IT" },
  { "name": "Charlie", "department": "HR" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "department": "HR", "count": 2 },
  { "department": "IT", "count": 1 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'group'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.employees.aggregate(...)`,
    solutionCode: `db.employees.aggregate([
  { $group: { _id: "$department", count: { $sum: 1 } } },
  { $project: { department: "$_id", count: 1, _id: 0 } },
  { $sort: { department: 1 } }
])`,
    order: 752,
    isPublished: true,
    testCases: [
      {
        input:
          '{"employees":[{"name":"Alice","department":"HR"},{"name":"Bob","department":"IT"},{"name":"Charlie","department":"HR"}]}',
        expectedOutput: '[{"department":"HR","count":2},{"department":"IT","count":1}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"employees":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Match Authors by Country',
    slug: 'mongodb-authors-by-country',
    description: `Write a query to find all authors in the \`authors\` collection whose \`country\` is either \`"USA"\` or \`"UK"\`.
Return only the \`name\` and \`country\` fields, excluding the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`authors\` collection:
\`\`\`json
[
  { "name": "Author 1", "country": "USA" },
  { "name": "Author 2", "country": "France" },
  { "name": "Author 3", "country": "UK" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Author 1", "country": "USA" },
  { "name": "Author 3", "country": "UK" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'filtering'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.authors.find(...)`,
    solutionCode: `db.authors.find({ country: { $in: ["USA", "UK"] } }, { _id: 0, name: 1, country: 1 }).sort({ name: 1 })`,
    order: 753,
    isPublished: true,
    testCases: [
      {
        input:
          '{"authors":[{"name":"Author 1","country":"USA"},{"name":"Author 2","country":"France"},{"name":"Author 3","country":"UK"}]}',
        expectedOutput: '[{"name":"Author 1","country":"USA"},{"name":"Author 3","country":"UK"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"authors":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Find Products with Tag Count',
    slug: 'mongodb-products-tag-count',
    description: `For each product in the \`products\` collection, calculate the number of tags in the \`tags\` array.
Return documents containing fields \`name\` and a new field \`tagCount\` (representing the size of the \`tags\` array). Exclude the \`_id\` field from results.
Sort the results by \`tagCount\` in descending order, then alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`products\` collection:
\`\`\`json
[
  { "name": "A", "tags": ["t1", "t2"] },
  { "name": "B", "tags": ["t1"] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "A", "tagCount": 2 },
  { "name": "B", "tagCount": 1 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'array-size'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.products.aggregate(...)`,
    solutionCode: `db.products.aggregate([
  { $project: { name: 1, tagCount: { $size: { $ifNull: ["$tags", []] } }, _id: 0 } },
  { $sort: { tagCount: -1, name: 1 } }
])`,
    order: 754,
    isPublished: true,
    testCases: [
      {
        input: '{"products":[{"name":"A","tags":["t1","t2"]},{"name":"B","tags":["t1"]}]}',
        expectedOutput: '[{"name":"A","tagCount":2},{"name":"B","tagCount":1}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"products":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Get Oldest Registered User',
    slug: 'mongodb-oldest-user',
    description: `Write a query to find the single user in the \`users\` collection who has the minimum/earliest \`registrationDate\`.
Return their \`name\` and \`registrationDate\` fields, excluding the \`_id\` field from results.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alice", "registrationDate": "2023-01-10T00:00:00Z" },
  { "name": "Bob", "registrationDate": "2022-12-05T00:00:00Z" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Bob", "registrationDate": "2022-12-05T00:00:00Z" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'sort', 'limit'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({}, { _id: 0, name: 1, registrationDate: 1 }).sort({ registrationDate: 1 }).limit(1)`,
    order: 755,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","registrationDate":{"$date":"2023-01-10T00:00:00Z"}},{"name":"Bob","registrationDate":{"$date":"2022-12-05T00:00:00Z"}}]}',
        expectedOutput: '[{"name":"Bob","registrationDate":"2022-12-05T00:00:00Z"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Users with Specific Domain',
    slug: 'mongodb-users-specific-domain',
    description: `Write a query to find all users in the \`users\` collection whose \`email\` ends with \`"@example.com"\` (case-insensitive).
Return only the \`name\` and \`email\` fields, excluding the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Bob", "email": "bob@gmail.com" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "email": "alice@example.com" }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'regex'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ email: { $regex: /@example\\.com$/i } }, { _id: 0, name: 1, email: 1 }).sort({ name: 1 })`,
    order: 756,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","email":"alice@example.com"},{"name":"Bob","email":"bob@gmail.com"}]}',
        expectedOutput: '[{"name":"Alice","email":"alice@example.com"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Project String Substring',
    slug: 'mongodb-string-substring',
    description: `For each customer in the \`customers\` collection, extract the first 4 characters of their \`idCard\` string field.
Return a new field named \`idPrefix\` along with their \`name\`. Exclude \`_id\` from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`customers\` collection:
\`\`\`json
[
  { "name": "Alice", "idCard": "AB12345" },
  { "name": "Bob", "idCard": "CD98765" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice", "idPrefix": "AB12" },
  { "name": "Bob", "idPrefix": "CD98" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'string-substring'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.customers.aggregate(...)`,
    solutionCode: `db.customers.aggregate([
  { $project: { name: 1, idPrefix: { $substrCP: ["$idCard", 0, 4] }, _id: 0 } },
  { $sort: { name: 1 } }
])`,
    order: 757,
    isPublished: true,
    testCases: [
      {
        input:
          '{"customers":[{"name":"Alice","idCard":"AB12345"},{"name":"Bob","idCard":"CD98765"}]}',
        expectedOutput: '[{"name":"Alice","idPrefix":"AB12"},{"name":"Bob","idPrefix":"CD98"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"customers":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Calculate Total Sales Value',
    slug: 'mongodb-total-sales-value',
    description: `Write a query to aggregate the \`orders\` collection and return the total value of all sales.
The value of an order is calculated as \`price * quantity\`.
The result should be returned as a single document with the field \`totalSales\`. Exclude \`_id\` from results.
If there are no orders, return an empty array.

### Example:
**Input:**
\`orders\` collection:
\`\`\`json
[
  { "price": 10, "quantity": 2 },
  { "price": 15, "quantity": 3 }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "totalSales": 65 }
]
\`\`\``,
    difficulty: 'EASY',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'math'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.orders.aggregate(...)`,
    solutionCode: `db.orders.aggregate([
  { $group: { _id: null, totalSales: { $sum: { $multiply: ["$price", "$quantity"] } } } },
  { $project: { totalSales: 1, _id: 0 } }
])`,
    order: 758,
    isPublished: true,
    testCases: [
      {
        input: '{"orders":[{"price":10,"quantity":2},{"price":15,"quantity":3}]}',
        expectedOutput: '[{"totalSales":65}]',
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
    title: 'Calculate Order Age in Days',
    slug: 'mongodb-order-age-days',
    description: `Calculate the age in days of each order in the \`orders\` collection as of \`2023-12-01T00:00:00Z\`.
The difference in days is calculated by subtracting the order \`date\` (Date object) from the target date \`2023-12-01T00:00:00Z\` and dividing the milliseconds difference by \`86400000\` (milliseconds in a day).
Return the fields \`orderId\` and a new field \`ageInDays\` (rounded down or truncated to integer using \`$floor\`). Exclude \`_id\`.
Sort the results by \`ageInDays\` in descending order.

### Example:
**Input:**
\`orders\` collection:
\`\`\`json
[
  { "orderId": "1", "date": "2023-11-29T00:00:00Z" },
  { "orderId": "2", "date": "2023-11-01T00:00:00Z" }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "orderId": "2", "ageInDays": 30 },
  { "orderId": "1", "ageInDays": 2 }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'aggregation', 'date-math'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.orders.aggregate(...)`,
    solutionCode: `db.orders.aggregate([
  { $project: {
    orderId: 1,
    ageInDays: {
      $floor: {
        $divide: [
          { $subtract: [new Date("2023-12-01T00:00:00Z"), "$date"] },
          86400000
        ]
      }
    },
    _id: 0
  } },
  { $sort: { ageInDays: -1 } }
])`,
    order: 759,
    isPublished: true,
    testCases: [
      {
        input:
          '{"orders":[{"orderId":"1","date":{"$date":"2023-11-29T00:00:00Z"}},{"orderId":"2","date":{"$date":"2023-11-01T00:00:00Z"}}]}',
        expectedOutput: '[{"orderId":"2","ageInDays":30},{"orderId":"1","ageInDays":2}]',
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
    title: 'Users with Sub-Tasks Accomplished',
    slug: 'mongodb-sub-tasks-accomplished',
    description: `Each document in the \`users\` collection contains a nested array of \`tasks\` where each task document has fields \`title\` (string) and \`done\` (boolean).
Write a query to find all users who have accomplished ALL of their tasks (where every task has \`done: true\`). Users with no tasks should also be included.
Return only their \`name\` field, excluding the \`_id\` field from results.
Sort the results alphabetically by \`name\` in ascending order.

### Example:
**Input:**
\`users\` collection:
\`\`\`json
[
  { "name": "Alice", "tasks": [{ "title": "t1", "done": true }, { "title": "t2", "done": true }] },
  { "name": "Bob", "tasks": [{ "title": "t1", "done": true }, { "title": "t2", "done": false }] },
  { "name": "Charlie", "tasks": [] }
]
\`\`\`
**Output:**
\`\`\`json
[
  { "name": "Alice" },
  { "name": "Charlie" }
]
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'MONGODB',
    tags: ['mongodb', 'find', 'nested-array-matching'],
    starterCode: `// Write your raw MongoDB query or async function here
// e.g. db.users.find(...)`,
    solutionCode: `db.users.find({ "tasks.done": { $ne: false } }, { _id: 0, name: 1 }).sort({ name: 1 })`,
    order: 760,
    isPublished: true,
    testCases: [
      {
        input:
          '{"users":[{"name":"Alice","tasks":[{"title":"t1","done":true},{"title":"t2","done":true}]},{"name":"Bob","tasks":[{"title":"t1","done":true},{"title":"t2","done":false}]},{"name":"Charlie","tasks":[]}]}',
        expectedOutput: '[{"name":"Alice"},{"name":"Charlie"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: '{"users":[]}',
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting MongoDB problems seeding (Part 2)...');

  for (const problemData of mongodbProblems) {
    console.log(`Processing problem: ${problemData.title} (${problemData.slug})`);

    const existing = await prisma.problem.findUnique({
      where: { slug: problemData.slug },
    });

    if (existing) {
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

    // Add a short delay to prevent connection spikes on Neon DB
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log('🎉 Database seeding complete for MongoDB (Part 2) problems!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
