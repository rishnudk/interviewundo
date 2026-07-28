import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 5000,
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
  category: 'SQL';
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

export const sqlProblems: ProblemSeed[] = [
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
    order: 801,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER); INSERT INTO employees VALUES (1, 'Alice', 'Engineering', 90000); INSERT INTO employees VALUES (2, 'Bob', 'Sales', 60000); INSERT INTO employees VALUES (3, 'Charlie', 'Engineering', 95000);",
        ),
        expectedOutput: '[{"name":"Charlie","salary":95000},{"name":"Alice","salary":90000}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary INTEGER); INSERT INTO employees VALUES (1, 'Eve', 'Engineering', 80000); INSERT INTO employees VALUES (2, 'Dave', 'Marketing', 70000);",
        ),
        expectedOutput: '[{"name":"Eve","salary":80000}]',
        isHidden: true,
        order: 2,
      },
    ],
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
    order: 802,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER); INSERT INTO users VALUES (1, 'Alice'); INSERT INTO users VALUES (2, 'Bob'); INSERT INTO orders VALUES (101, 1, 250); INSERT INTO orders VALUES (102, 2, 100); INSERT INTO orders VALUES (103, 1, 150);",
        ),
        expectedOutput: '[{"name":"Alice","total_amount":400},{"name":"Bob","total_amount":100}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER); INSERT INTO users VALUES (1, 'Charlie'); INSERT INTO orders VALUES (104, 3, 300);",
        ),
        expectedOutput: '[]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Users Directory Query',
    slug: 'users-directory-query',
    description: `We have a table \`users\` with columns \`id\`, \`name\`, and \`age\`.
      
Write a query to select all users from the \`users\` table.

### Example:
**Input:**
\`users\` table:
| id | name  | age |
|----|-------|-----|
| 1  | Alice | 25  |

**Output:**
| id | name  | age |
|----|-------|-----|
| 1  | Alice | 25  |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: 'SELECT * FROM users;',
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 803,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), age INTEGER); INSERT INTO users (name, age) VALUES ('Alice', 25);",
        ),
        expectedOutput: '[{"id":1,"name":"Alice","age":25}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100), age INTEGER); INSERT INTO users (name, age) VALUES ('John Doe', 30); INSERT INTO users (name, age) VALUES ('Jane Doe', 22);",
        ),
        expectedOutput: '[{"id":1,"name":"John Doe","age":30},{"id":2,"name":"Jane Doe","age":22}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Department Highest Salary',
    slug: 'department-highest-salary',
    description: `We have two tables: \`employees\` (with \`id\`, \`name\`, \`salary\`, \`department_id\`) and \`departments\` (with \`id\`, \`name\`).
      
Write a query to find the employee(s) who have the highest salary in each department.
Return the result table with columns: \`department\` (department name), \`employee\` (employee name), and \`salary\` (employee's salary).
If there is a tie, return all employees with the highest salary for that department.
Sort the results by \`salary\` in descending order.

### Example:
**Input:**
\`departments\` table:
| id | name  |
|----|-------|
| 1  | IT    |
| 2  | Sales |

\`employees\` table:
| id | name  | salary | department_id |
|----|-------|--------|---------------|
| 1  | Joe   | 85000  | 1             |
| 2  | Henry | 80000  | 2             |
| 3  | Sam   | 60000  | 2             |
| 4  | Max   | 90000  | 1             |

**Output:**
| department | employee | salary |
|------------|----------|--------|
| IT         | Max      | 90000  |
| Sales      | Henry    | 80000  |`,
    difficulty: 'MEDIUM',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT d.name AS department, e.name AS employee, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.salary = (SELECT MAX(salary) FROM employees WHERE department_id = e.department_id) ORDER BY e.salary DESC;`,
    tags: ['sql', 'join', 'group-by', 'subquery'],
    isPublished: true,
    order: 804,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, department_id INTEGER); INSERT INTO departments VALUES (1, 'IT'), (2, 'Sales'); INSERT INTO employees VALUES (1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1);",
        ),
        expectedOutput:
          '[{"department":"IT","employee":"Max","salary":90000},{"department":"Sales","employee":"Henry","salary":80000}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE departments (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, department_id INTEGER); INSERT INTO departments VALUES (1, 'IT'), (2, 'HR'); INSERT INTO employees VALUES (1, 'Alice', 95000, 1), (2, 'Bob', 95000, 1), (3, 'Charlie', 50000, 2);",
        ),
        expectedOutput:
          '[{"department":"IT","employee":"Alice","salary":95000},{"department":"IT","employee":"Bob","salary":95000},{"department":"HR","employee":"Charlie","salary":50000}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Customers Who Never Order',
    slug: 'customers-who-never-order',
    description: `We have two tables: \`customers\` (with \`id\`, \`name\`) and \`orders\` (with \`id\`, \`customer_id\`).
      
Write a query to find all customers who never ordered anything.
Return the result table with the column \`name\` representing the customer name.
Sort the results by \`name\` alphabetically.

### Example:
**Input:**
\`customers\` table:
| id | name  |
|----|-------|
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |

\`orders\` table:
| id | customer_id |
|----|-------------|
| 1  | 3           |
| 2  | 1           |

**Output:**
| name  |
|-------|
| Henry |
| Max   |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.customer_id IS NULL ORDER BY c.name ASC;`,
    tags: ['sql', 'join', 'left-join'],
    isPublished: true,
    order: 805,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER); INSERT INTO customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max'); INSERT INTO orders VALUES (1, 3), (2, 1);",
        ),
        expectedOutput: '[{"name":"Henry"},{"name":"Max"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER); INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob');",
        ),
        expectedOutput: '[{"name":"Alice"},{"name":"Bob"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'American Cities High Population',
    slug: 'american-cities-high-population',
    description: `We have a table \`city\` with columns \`id\`, \`name\`, \`country_code\`, and \`population\`.
      
Write a query to select all columns for all American cities in the \`city\` table with a population larger than 100,000. The \`country_code\` for America is 'USA'.

### Example:
**Input:**
\`city\` table:
| id | name     | country_code | population |
|----|----------|--------------|------------|
| 1  | New York | USA          | 8000000    |
| 2  | Paris    | FRA          | 2200000    |
| 3  | Buffalo  | USA          | 90000      |

**Output:**
| id | name     | country_code | population |
|----|----------|--------------|------------|
| 1  | New York | USA          | 8000000    |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT * FROM city WHERE country_code = 'USA' AND population > 100000;`,
    tags: ['sql', 'basic', 'filtering'],
    isPublished: true,
    order: 806,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (1, 'New York', 'USA', 8000000), (2, 'Paris', 'FRA', 2200000), (3, 'Buffalo', 'USA', 90000);",
        ),
        expectedOutput: '[{"id":1,"name":"New York","country_code":"USA","population":8000000}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (4, 'Los Angeles', 'USA', 3900000), (5, 'Boston', 'USA', 670000), (6, 'Victoria', 'CAN', 85000);",
        ),
        expectedOutput:
          '[{"id":4,"name":"Los Angeles","country_code":"USA","population":3900000},{"id":5,"name":"Boston","country_code":"USA","population":670000}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'American City Names',
    slug: 'american-city-names',
    description: `We have a table \`city\` with columns \`id\`, \`name\`, \`country_code\`, and \`population\`.
      
Write a query to select the \`name\` field for all American cities in the \`city\` table with a population larger than 120,000. The \`country_code\` for America is 'USA'.

### Example:
**Input:**
\`city\` table:
| id | name     | country_code | population |
|----|----------|--------------|------------|
| 1  | New York | USA          | 8000000    |
| 2  | Seattle  | USA          | 700000     |
| 3  | Albany   | USA          | 100000     |

**Output:**
| name     |
|----------|
| New York |
| Seattle  |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name FROM city WHERE country_code = 'USA' AND population > 120000;`,
    tags: ['sql', 'basic', 'filtering'],
    isPublished: true,
    order: 807,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (1, 'New York', 'USA', 8000000), (2, 'Seattle', 'USA', 700000), (3, 'Albany', 'USA', 100000);",
        ),
        expectedOutput: '[{"name":"New York"},{"name":"Seattle"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (4, 'Miami', 'USA', 450000), (5, 'Hartford', 'USA', 121000), (6, 'Montpelier', 'USA', 8000);",
        ),
        expectedOutput: '[{"name":"Miami"},{"name":"Hartford"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Select City By ID',
    slug: 'select-city-by-id',
    description: `We have a table \`city\` with columns \`id\`, \`name\`, \`country_code\`, and \`population\`.
      
Write a query to select all columns for a city with the ID \`1661\`.

### Example:
**Input:**
\`city\` table:
| id   | name   | country_code | population |
|------|--------|--------------|------------|
| 1661 | Sayama | JPN          | 162472     |
| 2    | Tokyo  | JPN          | 13000000   |

**Output:**
| id   | name   | country_code | population |
|------|--------|--------------|------------|
| 1661 | Sayama | JPN          | 162472     |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT * FROM city WHERE id = 1661;`,
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 808,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (1661, 'Sayama', 'JPN', 162472), (2, 'Tokyo', 'JPN', 13000000);",
        ),
        expectedOutput: '[{"id":1661,"name":"Sayama","country_code":"JPN","population":162472}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (5, 'Paris', 'FRA', 2200000), (1661, 'Sayama', 'JPN', 162472);",
        ),
        expectedOutput: '[{"id":1661,"name":"Sayama","country_code":"JPN","population":162472}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Japanese Cities Attributes',
    slug: 'japanese-cities-attributes',
    description: `We have a table \`city\` with columns \`id\`, \`name\`, \`country_code\`, and \`population\`.
      
Write a query to select all attributes of every Japanese city in the \`city\` table. The country code for Japan is 'JPN'.

### Example:
**Input:**
\`city\` table:
| id | name     | country_code | population |
|----|----------|--------------|------------|
| 1  | Tokyo    | JPN          | 13000000   |
| 2  | New York | USA          | 8000000    |

**Output:**
| id | name  | country_code | population |
|----|-------|--------------|------------|
| 1  | Tokyo | JPN          | 13000000   |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT * FROM city WHERE country_code = 'JPN';`,
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 809,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (1, 'Tokyo', 'JPN', 13000000), (2, 'New York', 'USA', 8000000);",
        ),
        expectedOutput: '[{"id":1,"name":"Tokyo","country_code":"JPN","population":13000000}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (3, 'Osaka', 'JPN', 2600000), (4, 'Kyoto', 'JPN', 1400000), (5, 'London', 'GBR', 8900000);",
        ),
        expectedOutput:
          '[{"id":3,"name":"Osaka","country_code":"JPN","population":2600000},{"id":4,"name":"Kyoto","country_code":"JPN","population":1400000}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Japanese City Names',
    slug: 'japanese-city-names',
    description: `We have a table \`city\` with columns \`id\`, \`name\`, \`country_code\`, and \`population\`.
      
Write a query to select the \`name\` of all Japanese cities in the \`city\` table. The country code for Japan is 'JPN'.

### Example:
**Input:**
\`city\` table:
| id | name  | country_code | population |
|----|-------|--------------|------------|
| 1  | Tokyo | JPN          | 13000000   |
| 2  | Osaka | JPN          | 2600000    |

**Output:**
| name  |
|-------|
| Tokyo |
| Osaka |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name FROM city WHERE country_code = 'JPN';`,
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 810,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (1, 'Tokyo', 'JPN', 13000000), (2, 'Osaka', 'JPN', 2600000);",
        ),
        expectedOutput: '[{"name":"Tokyo"},{"name":"Osaka"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE city (id INTEGER PRIMARY KEY, name TEXT, country_code TEXT, population INTEGER); INSERT INTO city VALUES (3, 'Hiroshima', 'JPN', 1100000), (4, 'Paris', 'FRA', 2200000);",
        ),
        expectedOutput: '[{"name":"Hiroshima"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Station City and State',
    slug: 'station-city-and-state',
    description: `We have a table \`station\` with columns \`id\`, \`city\`, \`state\`, \`lat_n\`, and \`long_w\`.
      
Write a query to select a list of \`city\` and \`state\` from the \`station\` table.

### Example:
**Input:**
\`station\` table:
| id | city    | state |
|----|---------|-------|
| 1  | Phoenix | AZ    |
| 2  | Denver  | CO    |

**Output:**
| city    | state |
|---------|-------|
| Phoenix | AZ    |
| Denver  | CO    |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT city, state FROM station;`,
    tags: ['sql', 'basic'],
    isPublished: true,
    order: 811,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT, state TEXT); INSERT INTO station VALUES (1, 'Phoenix', 'AZ'), (2, 'Denver', 'CO');",
        ),
        expectedOutput: '[{"city":"Phoenix","state":"AZ"},{"city":"Denver","state":"CO"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT, state TEXT); INSERT INTO station VALUES (3, 'Boston', 'MA'), (4, 'Austin', 'TX'), (5, 'Dallas', 'TX');",
        ),
        expectedOutput:
          '[{"city":"Boston","state":"MA"},{"city":"Austin","state":"TX"},{"city":"Dallas","state":"TX"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Station Even IDs',
    slug: 'station-even-ids',
    description: `We have a table \`station\` with columns \`id\`, \`city\`, \`state\`, \`lat_n\`, and \`long_w\`.
      
Write a query to select a list of unique \`city\` names from the \`station\` table for stations with an even \`id\` number.
Sort the results alphabetically by city name.

### Example:
**Input:**
\`station\` table:
| id | city    | state |
|----|---------|-------|
| 1  | Phoenix | AZ    |
| 2  | Denver  | CO    |
| 4  | Denver  | CO    |
| 6  | Aspen   | CO    |

**Output:**
| city   |
|--------|
| Aspen  |
| Denver |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT DISTINCT city FROM station WHERE id % 2 = 0 ORDER BY city ASC;`,
    tags: ['sql', 'filtering', 'sorting'],
    isPublished: true,
    order: 812,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT, state TEXT); INSERT INTO station VALUES (1, 'Phoenix', 'AZ'), (2, 'Denver', 'CO'), (4, 'Denver', 'CO'), (6, 'Aspen', 'CO');",
        ),
        expectedOutput: '[{"city":"Aspen"},{"city":"Denver"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT, state TEXT); INSERT INTO station VALUES (10, 'Seattle', 'WA'), (15, 'Miami', 'FL'), (20, 'Austin', 'TX'), (22, 'Seattle', 'WA');",
        ),
        expectedOutput: '[{"city":"Austin"},{"city":"Seattle"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Station City Count Difference',
    slug: 'station-city-count-difference',
    description: `We have a table \`station\` with columns \`id\`, \`city\`, \`state\`, \`lat_n\`, and \`long_w\`.
      
Write a query to find the difference between the total number of \`city\` entries in the table and the number of distinct \`city\` entries in the table.

For example, if there are three records with cities 'Denver', 'Denver', 'Phoenix', the total city count is 3, the distinct city count is 2, so the difference is 1.

### Example:
**Input:**
\`station\` table:
| id | city   |
|----|--------|
| 1  | Denver |
| 2  | Denver |
| 3  | Phoenix|

**Output:**
| difference |
|------------|
| 1          |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT COUNT(city) - COUNT(DISTINCT city) AS difference FROM station;`,
    tags: ['sql', 'aggregation'],
    isPublished: true,
    order: 813,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT); INSERT INTO station VALUES (1, 'Denver'), (2, 'Denver'), (3, 'Phoenix');",
        ),
        expectedOutput: '[{"difference":1}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT); INSERT INTO station VALUES (1, 'Denver'), (2, 'Phoenix'), (3, 'Boston');",
        ),
        expectedOutput: '[{"difference":0}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Shortest and Longest City Name',
    slug: 'shortest-and-longest-city-name',
    description: `We have a table \`station\` with columns \`id\`, \`city\`, \`state\`, \`lat_n\`, and \`long_w\`.
      
Write a query to find the two cities in the \`station\` table with the shortest and longest \`city\` names, along with their respective lengths (i.e. number of characters in the name).
If there is more than one shortest or longest city, choose the one that comes first alphabetically.

Return a table with columns \`city\` and \`len\` (length of city name), returning the shortest first, followed by the longest.

### Example:
**Input:**
\`station\` table:
| id | city    |
|----|---------|
| 1  | Lee     |
| 2  | Orlando |
| 3  | Roy     |

**Output:**
| city    | len |
|---------|-----|
| Lee     | 3   |
| Orlando | 7   |

**Explanation:**
'Lee' and 'Roy' both have a length of 3. Since 'Lee' is alphabetically smaller than 'Roy', we choose 'Lee' as the shortest. 'Orlando' is the longest with length 7.`,
    difficulty: 'MEDIUM',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT city, LENGTH(city) AS len FROM (SELECT city FROM station ORDER BY LENGTH(city) ASC, city ASC LIMIT 1) UNION ALL SELECT city, LENGTH(city) AS len FROM (SELECT city FROM station ORDER BY LENGTH(city) DESC, city ASC LIMIT 1);`,
    tags: ['sql', 'subquery', 'sorting', 'union'],
    isPublished: true,
    order: 814,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT); INSERT INTO station VALUES (1, 'Lee'), (2, 'Orlando'), (3, 'Roy');",
        ),
        expectedOutput: '[{"city":"Lee","len":3},{"city":"Orlando","len":7}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE station (id INTEGER PRIMARY KEY, city TEXT); INSERT INTO station VALUES (1, 'Chicago'), (2, 'Paris'), (3, 'Tokyo'), (4, 'Seattle'), (5, 'Erie');",
        ),
        expectedOutput: '[{"city":"Erie","len":4},{"city":"Chicago","len":7}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Employee Salaries Query',
    slug: 'employee-salaries-query',
    description: `We have a table \`employees\` with columns \`employee_id\`, \`name\`, \`months\`, and \`salary\`.
      
Write a query that prints a list of employee names for employees in the \`employees\` table having a salary greater than 2000 per month who have been employed for less than 10 months. Sort by \`employee_id\` ascending.

### Example:
**Input:**
\`employees\` table:
| employee_id | name    | months | salary |
|-------------|---------|--------|--------|
| 1           | Rose    | 15     | 1968   |
| 2           | Angela  | 1      | 3443   |
| 3           | Frank   | 3      | 2000   |
| 4           | Patrick | 9      | 4000   |

**Output:**
| name    |
|---------|
| Angela  |
| Patrick |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name FROM employees WHERE salary > 2000 AND months < 10 ORDER BY employee_id ASC;`,
    tags: ['sql', 'basic', 'filtering', 'sorting'],
    isPublished: true,
    order: 815,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, name TEXT, months INTEGER, salary INTEGER); INSERT INTO employees VALUES (1, 'Rose', 15, 1968), (2, 'Angela', 1, 3443), (3, 'Frank', 3, 2000), (4, 'Patrick', 9, 4000);",
        ),
        expectedOutput: '[{"name":"Angela"},{"name":"Patrick"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, name TEXT, months INTEGER, salary INTEGER); INSERT INTO employees VALUES (1, 'Lisa', 8, 2500), (2, 'Bart', 12, 3000), (3, 'Homer', 5, 1500), (4, 'Marge', 9, 5000);",
        ),
        expectedOutput: '[{"name":"Lisa"},{"name":"Marge"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Higher Than 75 Marks',
    slug: 'higher-than-75-marks',
    description: `We have a table \`students\` with columns \`id\`, \`name\`, and \`marks\`.
      
Write a query to select the \`name\` of any student in the \`students\` table who scored higher than 75 marks.
Sort the results by the last three characters of each name. If two or more students have names ending in the same last three characters (e.g. Bobby, Robby), sort them by ascending \`id\`.

### Example:
**Input:**
\`students\` table:
| id | name     | marks |
|----|----------|-------|
| 1  | Ashley   | 81    |
| 2  | Samantha | 75    |
| 3  | Julia    | 76    |
| 4  | Bobby    | 84    |

**Output:**
| name   |
|--------|
| Bobby  |
| Ashley |
| Julia  |

**Explanation:**
Bobby ends in 'bby', Ashley ends in 'ley', Julia ends in 'lia'. Alphabetically: bby -> ley -> lia. Samantha scored 75 (not strictly > 75).`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name FROM students WHERE marks > 75 ORDER BY SUBSTR(name, -3), id ASC;`,
    tags: ['sql', 'filtering', 'sorting', 'string-functions'],
    isPublished: true,
    order: 816,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, marks INTEGER); INSERT INTO students VALUES (1, 'Ashley', 81), (2, 'Samantha', 75), (3, 'Julia', 76), (4, 'Bobby', 84);",
        ),
        expectedOutput: '[{"name":"Bobby"},{"name":"Ashley"},{"name":"Julia"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, marks INTEGER); INSERT INTO students VALUES (1, 'Billy', 80), (2, 'Willy', 90), (3, 'Jane', 70);",
        ),
        expectedOutput: '[{"name":"Billy"},{"name":"Willy"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Rank Scores',
    slug: 'rank-scores',
    description: `We have a table \`scores\` with columns \`id\` and \`score\`.
      
Write a query to rank the scores. The ranking should be calculated according to the following rules:
- The scores should be ranked from highest to lowest.
- If there is a tie between two scores, both should have the same ranking.
- After a tie, the next ranking number should be the next consecutive integer value (i.e. there should be no holes in the ranking numbers - Dense Rank).

Return a table with columns \`score\` and \`rank\`, ordered by score descending.

### Example:
**Input:**
\`scores\` table:
| id | score |
|----|-------|
| 1  | 3.50  |
| 2  | 3.65  |
| 3  | 4.00  |
| 4  | 3.85  |
| 5  | 4.00  |
| 6  | 3.65  |

**Output:**
| score | rank |
|-------|------|
| 4.00  | 1    |
| 4.00  | 1    |
| 3.85  | 2    |
| 3.65  | 3    |
| 3.65  | 3    |
| 3.50  | 4    |`,
    difficulty: 'MEDIUM',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rank FROM scores;`,
    tags: ['sql', 'window-functions', 'sorting'],
    isPublished: true,
    order: 817,
    testCases: [
      {
        input: JSON.stringify(
          'CREATE TABLE scores (id INTEGER PRIMARY KEY, score REAL); INSERT INTO scores VALUES (1, 3.50), (2, 3.65), (3, 4.00), (4, 3.85), (5, 4.00), (6, 3.65);',
        ),
        expectedOutput:
          '[{"score":4,"rank":1},{"score":4,"rank":1},{"score":3.85,"rank":2},{"score":3.65,"rank":3},{"score":3.65,"rank":3},{"score":3.5,"rank":4}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          'CREATE TABLE scores (id INTEGER PRIMARY KEY, score REAL); INSERT INTO scores VALUES (1, 99.0), (2, 95.0), (3, 99.0), (4, 90.0);',
        ),
        expectedOutput:
          '[{"score":99,"rank":1},{"score":99,"rank":1},{"score":95,"rank":2},{"score":90,"rank":3}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Combine Two Tables',
    slug: 'combine-two-tables',
    description: `We have two tables: \`person\` (with columns \`id\`, \`first_name\`, \`last_name\`) and \`address\` (with columns \`id\`, \`person_id\`, \`city\`, \`state\`).
      
Write a query to report the \`first_name\`, \`last_name\`, \`city\`, and \`state\` for each person in the \`person\` table.
If the address of a person is not present in the \`address\` table, report \`null\` for their city and state.
Sort the results by \`first_name\` alphabetically.

### Example:
**Input:**
\`person\` table:
| id | first_name | last_name |
|----|------------|-----------|
| 1  | Allen      | Wang      |
| 2  | Bob        | Alice     |

\`address\` table:
| id | person_id | city     | state |
|----|-----------|----------|-------|
| 1  | 2         | New York | NY    |

**Output:**
| first_name | last_name | city     | state |
|------------|-----------|----------|-------|
| Allen      | Wang      | null     | null  |
| Bob        | Alice     | New York | NY    |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT p.first_name, p.last_name, a.city, a.state FROM person p LEFT JOIN address a ON p.id = a.person_id ORDER BY p.first_name ASC;`,
    tags: ['sql', 'join', 'left-join'],
    isPublished: true,
    order: 818,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE person (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT); CREATE TABLE address (id INTEGER PRIMARY KEY, person_id INTEGER, city TEXT, state TEXT); INSERT INTO person VALUES (1, 'Allen', 'Wang'), (2, 'Bob', 'Alice'); INSERT INTO address VALUES (1, 2, 'New York', 'NY');",
        ),
        expectedOutput:
          '[{"first_name":"Allen","last_name":"Wang","city":null,"state":null},{"first_name":"Bob","last_name":"Alice","city":"New York","state":"NY"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE person (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT); CREATE TABLE address (id INTEGER PRIMARY KEY, person_id INTEGER, city TEXT, state TEXT); INSERT INTO person VALUES (1, 'Charlie', 'Brown');",
        ),
        expectedOutput: '[{"first_name":"Charlie","last_name":"Brown","city":null,"state":null}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Employees Earning More Than Managers',
    slug: 'employees-earning-more-than-managers',
    description: `We have a table \`employees\` with columns \`id\`, \`name\`, \`salary\`, and \`manager_id\`. Note that \`manager_id\` points to the \`id\` of another employee in the same table.
      
Write a query to find all employees who earn strictly more than their managers.
Return the result table with a single column \`employee\` representing the employee's name.
Sort the results alphabetically by employee name.

### Example:
**Input:**
\`employees\` table:
| id | name  | salary | manager_id |
|----|-------|--------|------------|
| 1  | Joe   | 70000  | 3          |
| 2  | Henry | 80000  | 4          |
| 3  | Sam   | 60000  | null       |
| 4  | Max   | 90000  | null       |

**Output:**
| employee |
|----------|
| Joe      |

**Explanation:**
Joe earns 70,000, and his manager Sam earns 60,000 (Joe earns more). Henry earns 80,000, and his manager Max earns 90,000 (Henry does not earn more).`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT e.name AS employee FROM employees e JOIN employees m ON e.manager_id = m.id WHERE e.salary > m.salary ORDER BY e.name ASC;`,
    tags: ['sql', 'join', 'self-join'],
    isPublished: true,
    order: 819,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, manager_id INTEGER); INSERT INTO employees VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);",
        ),
        expectedOutput: '[{"employee":"Joe"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, manager_id INTEGER); INSERT INTO employees VALUES (1, 'Alex', 50000, 2), (2, 'Bob', 45000, 3), (3, 'Charlie', 40000, NULL);",
        ),
        expectedOutput: '[{"employee":"Alex"},{"employee":"Bob"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Duplicate Emails',
    slug: 'duplicate-emails',
    description: `We have a table \`person\` with columns \`id\` and \`email\`.
      
Write a query to find all duplicate emails in the \`person\` table.
Return the result table with a single column \`email\`.
Sort the results alphabetically by email.

### Example:
**Input:**
\`person\` table:
| id | email   |
|----|---------|
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |

**Output:**
| email   |
|---------|
| a@b.com |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT email FROM person GROUP BY email HAVING COUNT(email) > 1 ORDER BY email ASC;`,
    tags: ['sql', 'group-by', 'aggregation'],
    isPublished: true,
    order: 820,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE person (id INTEGER PRIMARY KEY, email TEXT); INSERT INTO person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');",
        ),
        expectedOutput: '[{"email":"a@b.com"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE person (id INTEGER PRIMARY KEY, email TEXT); INSERT INTO person VALUES (1, 'x@y.com'), (2, 'x@y.com'), (3, 'z@w.com'), (4, 'z@w.com');",
        ),
        expectedOutput: '[{"email":"x@y.com"},{"email":"z@w.com"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Second Highest Salary',
    slug: 'second-highest-salary',
    description: `We have a table \`employees\` with columns \`id\` and \`salary\`.
      
Write a query to find the second highest salary from the \`employees\` table. If there is no second highest salary, return \`null\`.
Return the result table with a single column named \`second_highest_salary\`.

### Example 1:
**Input:**
\`employees\` table:
| id | salary |
|----|--------|
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |

**Output:**
| second_highest_salary |
|-----------------------|
| 200                   |

### Example 2:
**Input:**
\`employees\` table:
| id | salary |
|----|--------|
| 1  | 100    |

**Output:**
| second_highest_salary |
|-----------------------|
| null                  |`,
    difficulty: 'MEDIUM',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1) AS second_highest_salary;`,
    tags: ['sql', 'subquery', 'sorting'],
    isPublished: true,
    order: 821,
    testCases: [
      {
        input: JSON.stringify(
          'CREATE TABLE employees (id INTEGER PRIMARY KEY, salary INTEGER); INSERT INTO employees VALUES (1, 100), (2, 200), (3, 300);',
        ),
        expectedOutput: '[{"second_highest_salary":200}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          'CREATE TABLE employees (id INTEGER PRIMARY KEY, salary INTEGER); INSERT INTO employees VALUES (1, 100);',
        ),
        expectedOutput: '[{"second_highest_salary":null}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Find Customer Referee',
    slug: 'find-customer-referee',
    description: `We have a table \`customer\` with columns \`id\`, \`name\`, and \`referee_id\`.
      
Write a query to find the names of the customers in the \`customer\` table who were not referred by the customer with id = 2.
Exclude customers referred by id = 2 (meaning \`referee_id = 2\`), but include customers who have no referee (i.e. \`referee_id\` is null).
Sort the results alphabetically by name.

### Example:
**Input:**
\`customer\` table:
| id | name | referee_id |
|----|------|------------|
| 1  | Will | null       |
| 2  | Jane | null       |
| 3  | Alex | 2          |
| 4  | Bill | null       |
| 5  | Zack | 1          |
| 6  | Mark | 2          |

**Output:**
| name |
|------|
| Bill |
| Jane |
| Will |
| Zack |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name FROM customer WHERE referee_id IS NULL OR referee_id != 2 ORDER BY name ASC;`,
    tags: ['sql', 'basic', 'filtering'],
    isPublished: true,
    order: 822,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE customer (id INTEGER PRIMARY KEY, name TEXT, referee_id INTEGER); INSERT INTO customer VALUES (1, 'Will', NULL), (2, 'Jane', NULL), (3, 'Alex', 2), (4, 'Bill', NULL), (5, 'Zack', 1), (6, 'Mark', 2);",
        ),
        expectedOutput: '[{"name":"Bill"},{"name":"Jane"},{"name":"Will"},{"name":"Zack"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE customer (id INTEGER PRIMARY KEY, name TEXT, referee_id INTEGER); INSERT INTO customer VALUES (1, 'Amy', 2), (2, 'Ben', NULL);",
        ),
        expectedOutput: '[{"name":"Ben"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Big Countries',
    slug: 'big-countries',
    description: `We have a table \`world\` with columns \`name\`, \`continent\`, \`area\`, \`population\`, and \`gdp\`.
      
A country is considered **big** if:
- It has an area of at least 3 million sq km (i.e. \`area >= 3000000\`), or
- It has a population of at least 25 million (i.e. \`population >= 25000000\`).

Write a query to find the \`name\`, \`population\`, and \`area\` of the big countries.
Sort the results alphabetically by country name.

### Example:
**Input:**
\`world\` table:
| name        | continent | area    | population | gdp          |
|-------------|-----------|---------|------------|--------------|
| Afghanistan | Asia      | 652230  | 25500100   | 20343000     |
| Albania     | Europe    | 28748   | 2831741    | 12960000     |
| Algeria     | Africa    | 2381741 | 37100000   | 188681000    |
| Andorra     | Europe    | 468     | 78115      | 3712000      |
| Angola      | Africa    | 1246700 | 20609294   | 100990000    |

**Output:**
| name        | population | area    |
|-------------|------------|---------|
| Afghanistan | 25500100   | 652230  |
| Algeria     | 37100000   | 2381741 |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT name, population, area FROM world WHERE area >= 3000000 OR population >= 25000000 ORDER BY name ASC;`,
    tags: ['sql', 'basic', 'filtering'],
    isPublished: true,
    order: 823,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE world (name TEXT PRIMARY KEY, continent TEXT, area INTEGER, population INTEGER, gdp INTEGER); INSERT INTO world VALUES ('Afghanistan', 'Asia', 652230, 25500100, 20343000), ('Albania', 'Europe', 28748, 2831741, 12960000), ('Algeria', 'Africa', 2381741, 37100000, 188681000), ('Andorra', 'Europe', 468, 78115, 3712000), ('Angola', 'Africa', 1246700, 20609294, 100990000);",
        ),
        expectedOutput:
          '[{"name":"Afghanistan","population":25500100,"area":652230},{"name":"Algeria","population":37100000,"area":2381741}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE world (name TEXT PRIMARY KEY, continent TEXT, area INTEGER, population INTEGER, gdp INTEGER); INSERT INTO world VALUES ('Canada', 'Americas', 9984670, 35000000, 1800000000), ('Singapore', 'Asia', 710, 5000000, 300000000);",
        ),
        expectedOutput: '[{"name":"Canada","population":35000000,"area":9984670}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Classes More Than 5 Students',
    slug: 'classes-more-than-5-students',
    description: `We have a table \`courses\` with columns \`student\` and \`class\`. Note that the primary key is the pair \`(student, class)\`.
      
Write a query to find all classes in the \`courses\` table that have at least 5 students.
Sort the results alphabetically by class.

### Example:
**Input:**
\`courses\` table:
| student | class    |
|---------|----------|
| A       | Math     |
| B       | English  |
| C       | Math     |
| D       | Biology  |
| E       | Math     |
| F       | Computer |
| G       | Math     |
| H       | Math     |

**Output:**
| class |
|-------|
| Math  |`,
    difficulty: 'EASY',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT class FROM courses GROUP BY class HAVING COUNT(DISTINCT student) >= 5 ORDER BY class ASC;`,
    tags: ['sql', 'group-by', 'aggregation'],
    isPublished: true,
    order: 824,
    testCases: [
      {
        input: JSON.stringify(
          "CREATE TABLE courses (student TEXT, class TEXT, PRIMARY KEY(student, class)); INSERT INTO courses VALUES ('A', 'Math'), ('B', 'English'), ('C', 'Math'), ('D', 'Biology'), ('E', 'Math'), ('F', 'Computer'), ('G', 'Math'), ('H', 'Math');",
        ),
        expectedOutput: '[{"class":"Math"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          "CREATE TABLE courses (student TEXT, class TEXT, PRIMARY KEY(student, class)); INSERT INTO courses VALUES ('A', 'History'), ('B', 'History'), ('C', 'History'), ('D', 'History'), ('E', 'History'), ('F', 'Math');",
        ),
        expectedOutput: '[{"class":"History"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
  {
    title: 'Tree Node Type',
    slug: 'tree-node-type',
    description: `We have a table \`tree\` with columns \`id\` (representing node ID) and \`p_id\` (representing parent ID).
      
Each node in the tree can be one of three types:
- **Root**: If the node is the root of the tree (meaning parent ID is null, \`p_id IS NULL\`).
- **Leaf**: If the node is a leaf node (meaning it is not a parent of any other node, i.e., it has a parent but no children).
- **Inner**: If the node is neither a Root nor a Leaf node (meaning it has a parent and it is also the parent of at least one other node).

Write a query to report the \`id\` and \`type\` of each node in the \`tree\` table.
Sort the results by \`id\` in ascending order.

### Example:
**Input:**
\`tree\` table:
| id | p_id |
|----|------|
| 1  | null |
| 2  | 1    |
| 3  | 1    |
| 4  | 2    |
| 5  | 2    |

**Output:**
| id | type  |
|----|-------|
| 1  | Root  |
| 2  | Inner |
| 3  | Leaf  |
| 4  | Leaf  |
| 5  | Leaf  |`,
    difficulty: 'MEDIUM',
    category: 'SQL',
    starterCode: `-- Write your SQL query here
`,
    solutionCode: `SELECT id, CASE WHEN p_id IS NULL THEN 'Root' WHEN id IN (SELECT p_id FROM tree WHERE p_id IS NOT NULL) THEN 'Inner' ELSE 'Leaf' END AS type FROM tree ORDER BY id ASC;`,
    tags: ['sql', 'conditional', 'subquery'],
    isPublished: true,
    order: 825,
    testCases: [
      {
        input: JSON.stringify(
          'CREATE TABLE tree (id INTEGER PRIMARY KEY, p_id INTEGER); INSERT INTO tree VALUES (1, NULL), (2, 1), (3, 1), (4, 2), (5, 2);',
        ),
        expectedOutput:
          '[{"id":1,"type":"Root"},{"id":2,"type":"Inner"},{"id":3,"type":"Leaf"},{"id":4,"type":"Leaf"},{"id":5,"type":"Leaf"}]',
        isHidden: false,
        order: 1,
      },
      {
        input: JSON.stringify(
          'CREATE TABLE tree (id INTEGER PRIMARY KEY, p_id INTEGER); INSERT INTO tree VALUES (10, NULL), (20, 10), (30, 20);',
        ),
        expectedOutput:
          '[{"id":10,"type":"Root"},{"id":20,"type":"Inner"},{"id":30,"type":"Leaf"}]',
        isHidden: true,
        order: 2,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting SQL problems seeding...');

  for (const problemData of sqlProblems) {
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

    // Add a short delay to prevent connection termination on Neon DB
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log('🎉 Database seeding complete for SQL problems!');
}

if (process.env.SKIP_SEED_DB !== 'true') {
  main()
    .catch((e) => {
      console.error('❌ Seeding failed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
    });
}
