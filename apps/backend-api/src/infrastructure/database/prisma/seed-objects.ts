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

const objectProblems: ProblemSeed[] = [
  {
    title: 'Remove Last Property',
    slug: 'objects-remove-last-property',
    description: `Given an object, remove the last property from it in-place and return the modified object. The last property is defined by the order returned by \`Object.keys()\`. If the object is empty, return it unchanged.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 1 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function removeLastProperty(obj) {
  // Write your code here
}`,
    solutionCode: `function removeLastProperty(obj) {
  const keys = Object.keys(obj);
  if (keys.length > 0) {
    delete obj[keys[keys.length - 1]];
  }
  return obj;
}`,
    order: 401,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '{"a":1}', isHidden: false, order: 1 },
      { input: '[{"x":10}]', expectedOutput: '{}', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"a":1,"b":2,"c":3}]', expectedOutput: '{"a":1,"b":2}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Add Field to Object',
    slug: 'add-field-to-object',
    description: `Given an object, a key, and a value, add the key-value pair to the object in-place and return the modified object.

### Example 1:
**Input:** obj = { "name": "Alice" }, key = "age", value = 25  
**Output:** { "name": "Alice", "age": 25 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function addField(obj, key, value) {
  // Write your code here
}`,
    solutionCode: `function addField(obj, key, value) {
  obj[key] = value;
  return obj;
}`,
    order: 402,
    isPublished: true,
    testCases: [
      {
        input: '[{"name":"Alice"}, "age", 25]',
        expectedOutput: '{"name":"Alice","age":25}',
        isHidden: false,
        order: 1,
      },
      { input: '[{}, "id", 1]', expectedOutput: '{"id":1}', isHidden: false, order: 2 },
      { input: '[{"a":1}, "a", 2]', expectedOutput: '{"a":2}', isHidden: true, order: 3 },
      { input: '[{}, "x", null]', expectedOutput: '{"x":null}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Object Manipulation',
    slug: 'objects-manipulation-basic',
    description: `Given an object representing a user, update their \`role\` to \`"admin"\` and add a boolean field \`verified\` set to \`true\`. Do this in-place and return the modified object.

### Example 1:
**Input:** user = { "name": "Bob", "role": "user" }  
**Output:** { "name": "Bob", "role": "admin", "verified": true }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function manipulateUser(user) {
  // Write your code here
}`,
    solutionCode: `function manipulateUser(user) {
  user.role = "admin";
  user.verified = true;
  return user;
}`,
    order: 403,
    isPublished: true,
    testCases: [
      {
        input: '[{"name":"Bob","role":"user"}]',
        expectedOutput: '{"name":"Bob","role":"admin","verified":true}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{"name":"Alice"}]',
        expectedOutput: '{"name":"Alice","role":"admin","verified":true}',
        isHidden: false,
        order: 2,
      },
      {
        input: '[{}]',
        expectedOutput: '{"role":"admin","verified":true}',
        isHidden: true,
        order: 3,
      },
      {
        input: '[{"role":"admin","verified":false}]',
        expectedOutput: '{"role":"admin","verified":true}',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Check if Object is Empty',
    slug: 'check-if-object-is-empty',
    description: `Given an object, return \`true\` if it contains no properties, and \`false\` otherwise.

### Example 1:
**Input:** obj = {}  
**Output:** true  

### Example 2:
**Input:** obj = { "a": 1 }  
**Output:** false`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function isObjectEmpty(obj) {
  // Write your code here
}`,
    solutionCode: `function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}`,
    order: 404,
    isPublished: true,
    testCases: [
      { input: '[{}]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '[{"a":1}]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[{"a":null}]', expectedOutput: 'false', isHidden: true, order: 3 },
      { input: '[{"length":0}]', expectedOutput: 'false', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Sum of Keys',
    slug: 'find-sum-of-keys',
    description: `Given an object where all keys represent numbers (as strings), return the sum of all keys as numbers. If the object has no keys, return 0.

### Example 1:
**Input:** obj = { "10": "apple", "20": "banana" }  
**Output:** 30`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function sumKeys(obj) {
  // Write your code here
}`,
    solutionCode: `function sumKeys(obj) {
  return Object.keys(obj).reduce((sum, key) => sum + Number(key), 0);
}`,
    order: 405,
    isPublished: true,
    testCases: [
      { input: '[{"10":"apple","20":"banana"}]', expectedOutput: '30', isHidden: false, order: 1 },
      { input: '[{"1.5":"a","2.5":"b"}]', expectedOutput: '4', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '[{"-5":"x","5":"y"}]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Sum of Values',
    slug: 'find-sum-of-values',
    description: `Given an object containing numeric values, return the sum of all its values. Ignore any values that are not numbers.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": "ignore" }  
**Output:** 30`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function sumValues(obj) {
  // Write your code here
}`,
    solutionCode: `function sumValues(obj) {
  return Object.values(obj).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0);
}`,
    order: 406,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":20,"c":"ignore"}]', expectedOutput: '30', isHidden: false, order: 1 },
      { input: '[{"x":-5,"y":5}]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '[{"a":1.5,"b":2.5}]', expectedOutput: '4', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Average of Values',
    slug: 'find-average-of-values',
    description: `Given an object with numeric values, return the average of all its values. Ignore any non-numeric values. If the object contains no numeric values, return 0.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": 30 }  
**Output:** 20`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function averageValues(obj) {
  // Write your code here
}`,
    solutionCode: `function averageValues(obj) {
  const nums = Object.values(obj).filter(val => typeof val === 'number');
  if (nums.length === 0) return 0;
  return nums.reduce((sum, val) => sum + val, 0) / nums.length;
}`,
    order: 407,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":20,"c":30}]', expectedOutput: '20', isHidden: false, order: 1 },
      { input: '[{"a":10,"b":"x"}]', expectedOutput: '10', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '[{"a":5,"b":15,"c":25}]', expectedOutput: '15', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Total Price of Products',
    slug: 'find-total-price-of-products',
    description: `Given an object representing products where the keys are product names and the values are objects containing \`price\` (number) and \`quantity\` (number), calculate and return the total price of all items (sum of price * quantity for each item).

### Example 1:
**Input:** products = { "apple": { "price": 1.5, "quantity": 4 }, "banana": { "price": 0.8, "quantity": 10 } }  
**Output:** 14  
**Explanation:** (1.5 * 4) + (0.8 * 10) = 6 + 8 = 14.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function totalProductPrice(products) {
  // Write your code here
}`,
    solutionCode: `function totalProductPrice(products) {
  let total = 0;
  for (const key in products) {
    const item = products[key];
    if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
      total += item.price * item.quantity;
    }
  }
  return total;
}`,
    order: 408,
    isPublished: true,
    testCases: [
      {
        input: '[{"apple":{"price":1.5,"quantity":4},"banana":{"price":0.8,"quantity":10}}]',
        expectedOutput: '14',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{"pen":{"price":2,"quantity":5}}]',
        expectedOutput: '10',
        isHidden: false,
        order: 2,
      },
      { input: '[{}]', expectedOutput: '0', isHidden: true, order: 3 },
      {
        input: '[{"a":{"price":10,"quantity":0},"b":{"price":5,"quantity":5}}]',
        expectedOutput: '25',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Largest Value',
    slug: 'find-largest-value',
    description: `Given an object with numeric values, find and return the largest value. If the object has no numeric values, return \`null\`.

### Example 1:
**Input:** obj = { "a": 5, "b": 12, "c": 3 }  
**Output:** 12`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function findLargestValue(obj) {
  // Write your code here
}`,
    solutionCode: `function findLargestValue(obj) {
  const nums = Object.values(obj).filter(val => typeof val === 'number');
  if (nums.length === 0) return null;
  return Math.max(...nums);
}`,
    order: 409,
    isPublished: true,
    testCases: [
      { input: '[{"a":5,"b":12,"c":3}]', expectedOutput: '12', isHidden: false, order: 1 },
      { input: '[{"x":-5,"y":-10}]', expectedOutput: '-5', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[{"a":100}]', expectedOutput: '100', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Second Largest Value',
    slug: 'find-second-largest-value',
    description: `Given an object with numeric values, find and return the second largest unique value. If there are fewer than 2 unique numeric values, return \`null\`.

### Example 1:
**Input:** obj = { "a": 10, "b": 25, "c": 25, "d": 5 }  
**Output:** 10  
**Explanation:** Unique values are 25, 10, 5. The second largest is 10.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function findSecondLargestValue(obj) {
  // Write your code here
}`,
    solutionCode: `function findSecondLargestValue(obj) {
  const nums = Object.values(obj).filter(val => typeof val === 'number');
  const unique = [...new Set(nums)].sort((a, b) => b - a);
  return unique.length >= 2 ? unique[1] : null;
}`,
    order: 410,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":25,"c":25,"d":5}]', expectedOutput: '10', isHidden: false, order: 1 },
      { input: '[{"a":10,"b":10}]', expectedOutput: 'null', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[{"x":-1,"y":0,"z":1}]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Largest Value and Key',
    slug: 'find-largest-value-and-key',
    description: `Given an object with numeric values, find the property with the largest value. Return an object with the format \`{ key: string, value: number }\`. If the object has no numeric values, return \`{ key: null, value: null }\`.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": 5 }  
**Output:** { "key": "b", "value": 20 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function findLargestKeyVal(obj) {
  // Write your code here
}`,
    solutionCode: `function findLargestKeyVal(obj) {
  let maxKey = null;
  let maxVal = -Infinity;
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] > maxVal) {
      maxVal = obj[key];
      maxKey = key;
    }
  }
  return maxKey === null ? { key: null, value: null } : { key: maxKey, value: maxVal };
}`,
    order: 411,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":10,"b":20,"c":5}]',
        expectedOutput: '{"key":"b","value":20}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{"x":-5,"y":-10}]',
        expectedOutput: '{"key":"x","value":-5}',
        isHidden: false,
        order: 2,
      },
      { input: '[{}]', expectedOutput: '{"key":null,"value":null}', isHidden: true, order: 3 },
      {
        input: '[{"a":"str"}]',
        expectedOutput: '{"key":null,"value":null}',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Find Keys Where Value is Greater Than 10',
    slug: 'find-keys-value-greater-than-ten',
    description: `Given an object with numeric values, return an array of all keys whose values are strictly greater than 10. The keys should be returned in their original order.

### Example 1:
**Input:** obj = { "a": 5, "b": 12, "c": 8, "d": 15 }  
**Output:** [ "b", "d" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getKeysGreaterThanTen(obj) {
  // Write your code here
}`,
    solutionCode: `function getKeysGreaterThanTen(obj) {
  const result = [];
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] > 10) {
      result.push(key);
    }
  }
  return result;
}`,
    order: 412,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":5,"b":12,"c":8,"d":15}]',
        expectedOutput: '["b","d"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":10,"y":9}]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":11,"b":20}]', expectedOutput: '["a","b"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Check if Key Exists',
    slug: 'check-if-key-exists',
    description: `Given an object and a key string, return \`true\` if the key exists as a direct property of the object, and \`false\` otherwise. Do not use built-in search methods; check using the \`in\` operator or \`hasOwnProperty\`.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }, key = "b"  
**Output:** true  

### Example 2:
**Input:** obj = { "a": 1 }, key = "z"  
**Output:** false`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function checkKeyExists(obj, key) {
  // Write your code here
}`,
    solutionCode: `function checkKeyExists(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}`,
    order: 413,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}, "b"]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '[{"a":1}, "z"]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[{}, "toString"]', expectedOutput: 'false', isHidden: true, order: 3 },
      { input: '[{"x":undefined}, "x"]', expectedOutput: 'true', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Check if Value Exists',
    slug: 'check-if-value-exists',
    description: `Given an object and a target value, return \`true\` if the value exists in the object, and \`false\` otherwise.

### Example 1:
**Input:** obj = { "a": 10, "b": 20 }, value = 20  
**Output:** true`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function checkValueExists(obj, value) {
  // Write your code here
}`,
    solutionCode: `function checkValueExists(obj, value) {
  return Object.values(obj).includes(value);
}`,
    order: 414,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":20}, 20]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '[{"a":10}, 30]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[{}, 5]', expectedOutput: 'false', isHidden: true, order: 3 },
      { input: '[{"x":"test"}, "test"]', expectedOutput: 'true', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Double Every Value',
    slug: 'double-every-value',
    description: `Given an object with numeric values, double all of its values in-place and return the modified object.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 2, "b": 4 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function doubleValues(obj) {
  // Write your code here
}`,
    solutionCode: `function doubleValues(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      obj[key] *= 2;
    }
  }
  return obj;
}`,
    order: 415,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '{"a":2,"b":4}', isHidden: false, order: 1 },
      { input: '[{"x":0,"y":-5}]', expectedOutput: '{"x":0,"y":-10}', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"a":1.5}]', expectedOutput: '{"a":3}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Delete Keys Where Value is Less Than 15',
    slug: 'delete-keys-less-than-fifteen',
    description: `Given an object with numeric values, delete all properties whose values are strictly less than 15 in-place. Return the updated object.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": 15 }  
**Output:** { "b": 20, "c": 15 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function deleteKeysLessThanFifteen(obj) {
  // Write your code here
}`,
    solutionCode: `function deleteKeysLessThanFifteen(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] < 15) {
      delete obj[key];
    }
  }
  return obj;
}`,
    order: 416,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":10,"b":20,"c":15}]',
        expectedOutput: '{"b":20,"c":15}',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":5,"y":12}]', expectedOutput: '{}', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"a":30}]', expectedOutput: '{"a":30}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Merge Two Objects',
    slug: 'objects-merge-two-objects',
    description: `Given two objects \`obj1\` and \`obj2\`, return a new object containing all properties of both. If there are duplicate keys, properties from \`obj2\` should overwrite those in \`obj1\`. Do not modify the original objects.

### Example 1:
**Input:** obj1 = { "a": 1 }, obj2 = { "b": 2 }  
**Output:** { "a": 1, "b": 2 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function mergeObjects(obj1, obj2) {
  // Write your code here
}`,
    solutionCode: `function mergeObjects(obj1, obj2) {
  return { ...obj1, ...obj2 };
}`,
    order: 417,
    isPublished: true,
    testCases: [
      { input: '[{"a":1}, {"b":2}]', expectedOutput: '{"a":1,"b":2}', isHidden: false, order: 1 },
      {
        input: '[{"a":1,"b":2}, {"b":3,"c":4}]',
        expectedOutput: '{"a":1,"b":3,"c":4}',
        isHidden: false,
        order: 2,
      },
      { input: '[{}, {}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"x":1}, {}]', expectedOutput: '{"x":1}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Swap Keys and Values',
    slug: 'swap-keys-and-values',
    description: `Given an object, return a new object where the keys and values are swapped (the original values become the new keys, and original keys become the new values). Assume all values are unique and can be converted to strings.

### Example 1:
**Input:** obj = { "a": "x", "b": "y" }  
**Output:** { "x": "a", "y": "b" }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function swapKeysAndValues(obj) {
  // Write your code here
}`,
    solutionCode: `function swapKeysAndValues(obj) {
  const swapped = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      swapped[obj[key]] = key;
    }
  }
  return swapped;
}`,
    order: 418,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":"x","b":"y"}]',
        expectedOutput: '{"x":"a","y":"b"}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{"1":"a","2":"b"}]',
        expectedOutput: '{"a":"1","b":"2"}',
        isHidden: false,
        order: 2,
      },
      { input: '[{}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"key":"val"}]', expectedOutput: '{"val":"key"}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse Object Order',
    slug: 'reverse-object-order',
    description: `Given an object, return a new object containing the same key-value pairs but in reverse property insertion order (based on \`Object.keys()\`).

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "b": 2, "a": 1 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function reverseObject(obj) {
  // Write your code here
}`,
    solutionCode: `function reverseObject(obj) {
  const reversed = {};
  const keys = Object.keys(obj).reverse();
  for (const key of keys) {
    reversed[key] = obj[key];
  }
  return reversed;
}`,
    order: 419,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '{"b":2,"a":1}', isHidden: false, order: 1 },
      {
        input: '[{"x":10,"y":20,"z":30}]',
        expectedOutput: '{"z":30,"y":20,"x":10}',
        isHidden: false,
        order: 2,
      },
      { input: '[{}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"a":1}]', expectedOutput: '{"a":1}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Convert Array of Objects into Object',
    slug: 'convert-array-of-objects-into-object',
    description: `Given an array of objects and a key name \`keyField\`, convert the array into a single object where the keys are the values of \`keyField\` from each object, and the values are the objects themselves (excluding the \`keyField\` property). Assume \`keyField\` value is unique across objects.

### Example 1:
**Input:** arr = [ { "id": "1", "name": "Alice" }, { "id": "2", "name": "Bob" } ], keyField = "id"  
**Output:** { "1": { "name": "Alice" }, "2": { "name": "Bob" } }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function arrayToObject(arr, keyField) {
  // Write your code here
}`,
    solutionCode: `function arrayToObject(arr, keyField) {
  const result = {};
  for (const item of arr) {
    const key = item[keyField];
    const copy = { ...item };
    delete copy[keyField];
    result[key] = copy;
  }
  return result;
}`,
    order: 420,
    isPublished: true,
    testCases: [
      {
        input: '[[{"id":"1","name":"Alice"},{"id":"2","name":"Bob"}], "id"]',
        expectedOutput: '{"1":{"name":"Alice"},"2":{"name":"Bob"}}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[[{"code":"us","lang":"Eng"}], "code"]',
        expectedOutput: '{"us":{"lang":"Eng"}}',
        isHidden: false,
        order: 2,
      },
      { input: '[[], "id"]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[[{"id":10}], "id"]', expectedOutput: '{"10":{}}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Count Keys',
    slug: 'count-keys',
    description: `Given an object, return the total count of keys present in the object.

### Example 1:
**Input:** obj = { "a": 1, "b": 2, "c": 3 }  
**Output:** 3`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function countKeys(obj) {
  // Write your code here
}`,
    solutionCode: `function countKeys(obj) {
  return Object.keys(obj).length;
}`,
    order: 421,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2,"c":3}]', expectedOutput: '3', isHidden: false, order: 1 },
      { input: '[{}]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[{"x":10}]', expectedOutput: '1', isHidden: true, order: 3 },
      { input: '[{"a":1,"b":null,"c":undefined}]', expectedOutput: '3', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Print Keys and Values',
    slug: 'print-keys-and-values',
    description: `Given an object, return an array of strings formatted as \`"key: value"\` for each property in the object.

### Example 1:
**Input:** obj = { "name": "Alice", "age": 25 }  
**Output:** [ "name: Alice", "age: 25" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function printKeysValues(obj) {
  // Write your code here
}`,
    solutionCode: `function printKeysValues(obj) {
  return Object.entries(obj).map(([key, val]) => \`\${key}: \${val}\`);
}`,
    order: 422,
    isPublished: true,
    testCases: [
      {
        input: '[{"name":"Alice","age":25}]',
        expectedOutput: '["name: Alice","age: 25"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"a":1}]', expectedOutput: '["a: 1"]', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"x":true}]', expectedOutput: '["x: true"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Object Keys Demystified',
    slug: 'object-keys-demo',
    description: `Given an object, return an array containing all of its key names. Do not use built-in loops; use \`Object.keys()\`.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ "a", "b" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getKeys(obj) {
  // Write your code here
}`,
    solutionCode: `function getKeys(obj) {
  return Object.keys(obj);
}`,
    order: 423,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '["a","b"]', isHidden: false, order: 1 },
      { input: '[{}]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{"x":10}]', expectedOutput: '["x"]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Object Values Demystified',
    slug: 'object-values-demo',
    description: `Given an object, return an array containing all of its property values. Use \`Object.values()\`.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ 1, 2 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getValues(obj) {
  // Write your code here
}`,
    solutionCode: `function getValues(obj) {
  return Object.values(obj);
}`,
    order: 424,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '[1,2]', isHidden: false, order: 1 },
      { input: '[{}]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{"x":"hello"}]', expectedOutput: '["hello"]', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Find Keys Where Value is a String',
    slug: 'find-keys-value-is-string',
    description: `Given an object, return an array of all keys whose values are of type string. The keys should be returned in their original order.

### Example 1:
**Input:** obj = { "a": 1, "b": "hello", "c": true, "d": "world" }  
**Output:** [ "b", "d" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getStringKeys(obj) {
  // Write your code here
}`,
    solutionCode: `function getStringKeys(obj) {
  const result = [];
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result.push(key);
    }
  }
  return result;
}`,
    order: 425,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":"hello","c":true,"d":"world"}]',
        expectedOutput: '["b","d"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":10,"y":false}]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":"","b":"abc"}]', expectedOutput: '["a","b"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Sort Object by Values',
    slug: 'sort-object-by-values',
    description: `Given an object with numeric values, return a 2D array representing the key-value entries sorted in ascending order by their values.

### Example 1:
**Input:** obj = { "a": 10, "b": 5, "c": 20 }  
**Output:** [ [ "b", 5 ], [ "a", 10 ], [ "c", 20 ] ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function sortObjectByValues(obj) {
  // Write your code here
}`,
    solutionCode: `function sortObjectByValues(obj) {
  return Object.entries(obj).sort((a, b) => a[1] - b[1]);
}`,
    order: 426,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":10,"b":5,"c":20}]',
        expectedOutput: '[["b",5],["a",10],["c",20]]',
        isHidden: false,
        order: 1,
      },
      {
        input: '[{"x":-1,"y":-10}]',
        expectedOutput: '[["y",-10],["x",-1]]',
        isHidden: false,
        order: 2,
      },
      { input: '[{}]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":42}]', expectedOutput: '[["a",42]]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Remove Keys with Duplicate Values',
    slug: 'remove-keys-with-duplicate-values',
    description: `Given an object, remove all properties with duplicate values in-place so that only their first occurrence is kept. Return the updated object.

### Example 1:
**Input:** obj = { "a": 1, "b": 2, "c": 1, "d": 2 }  
**Output:** { "a": 1, "b": 2 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function removeDuplicateValues(obj) {
  // Write your code here
}`,
    solutionCode: `function removeDuplicateValues(obj) {
  const seen = new Set();
  for (const key in obj) {
    const val = obj[key];
    if (seen.has(val)) {
      delete obj[key];
    } else {
      seen.add(val);
    }
  }
  return obj;
}`,
    order: 427,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":2,"c":1,"d":2}]',
        expectedOutput: '{"a":1,"b":2}',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":10,"y":10,"z":10}]', expectedOutput: '{"x":10}', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '[{"a":1,"b":2}]', expectedOutput: '{"a":1,"b":2}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Group by Key',
    slug: 'group-by-key',
    description: `Given an array of objects and a key name \`key\`, group the objects by their value for that key. Return an object where the keys are the unique values, and the values are arrays containing all objects matching that value.

### Example 1:
**Input:** arr = [ { "name": "Alice", "role": "admin" }, { "name": "Bob", "role": "user" }, { "name": "Charlie", "role": "admin" } ], key = "role"  
**Output:** { "admin": [ { "name": "Alice", "role": "admin" }, { "name": "Charlie", "role": "admin" } ], "user": [ { "name": "Bob", "role": "user" } ] }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function groupByKey(arr, key) {
  // Write your code here
}`,
    solutionCode: `function groupByKey(arr, key) {
  const grouped = {};
  for (const obj of arr) {
    const groupVal = obj[key];
    if (!grouped[groupVal]) {
      grouped[groupVal] = [];
    }
    grouped[groupVal].push(obj);
  }
  return grouped;
}`,
    order: 428,
    isPublished: true,
    testCases: [
      {
        input:
          '[[{"name":"Alice","role":"admin"},{"name":"Bob","role":"user"},{"name":"Charlie","role":"admin"}], "role"]',
        expectedOutput:
          '{"admin":[{"name":"Alice","role":"admin"},{"name":"Charlie","role":"admin"}],"user":[{"name":"Bob","role":"user"}]}',
        isHidden: false,
        order: 1,
      },
      {
        input: '[[{"val":10,"x":"a"},{"val":20,"x":"a"}], "x"]',
        expectedOutput: '{"a":[{"val":10,"x":"a"},{"val":20,"x":"a"}]}',
        isHidden: false,
        order: 2,
      },
      { input: '[[], "id"]', expectedOutput: '{}', isHidden: true, order: 3 },
    ],
  },
  {
    title: 'Find Keys with Odd Values',
    slug: 'find-keys-with-odd-values',
    description: `Given an object with numeric values, return an array of all keys whose values are odd numbers. The keys should be returned in their original order.

### Example 1:
**Input:** obj = { "a": 2, "b": 3, "c": 4, "d": 5 }  
**Output:** [ "b", "d" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getOddValueKeys(obj) {
  // Write your code here
}`,
    solutionCode: `function getOddValueKeys(obj) {
  const result = [];
  for (const key in obj) {
    if (typeof obj[key] === 'number' && Math.abs(obj[key]) % 2 === 1) {
      result.push(key);
    }
  }
  return result;
}`,
    order: 429,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":2,"b":3,"c":4,"d":5}]',
        expectedOutput: '["b","d"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":2,"y":4}]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":-3}]', expectedOutput: '["a"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Keys with Even Values',
    slug: 'find-keys-with-even-values',
    description: `Given an object with numeric values, return an array of all keys whose values are even numbers. The keys should be returned in their original order.

### Example 1:
**Input:** obj = { "a": 2, "b": 3, "c": 4, "d": 5 }  
**Output:** [ "a", "c" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getEvenValueKeys(obj) {
  // Write your code here
}`,
    solutionCode: `function getEvenValueKeys(obj) {
  const result = [];
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] % 2 === 0) {
      result.push(key);
    }
  }
  return result;
}`,
    order: 430,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":2,"b":3,"c":4,"d":5}]',
        expectedOutput: '["a","c"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":1,"y":3}]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{}]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":0,"b":-2}]', expectedOutput: '["a","b"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Keys with Values Greater Than a Number',
    slug: 'find-keys-with-values-greater-than',
    description: `Given an object with numeric values and a limit number \`limit\`, return an array of all keys whose values are strictly greater than \`limit\`.

### Example 1:
**Input:** obj = { "a": 5, "b": 15, "c": 10 }, limit = 9  
**Output:** [ "b", "c" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getKeysGreaterThan(obj, limit) {
  // Write your code here
}`,
    solutionCode: `function getKeysGreaterThan(obj, limit) {
  const result = [];
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] > limit) {
      result.push(key);
    }
  }
  return result;
}`,
    order: 431,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":5,"b":15,"c":10}, 9]',
        expectedOutput: '["b","c"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":10}, 20]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{}, 0]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":0,"b":-5}, -10]', expectedOutput: '["a","b"]', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Keys with Values Less Than a Number',
    slug: 'find-keys-with-values-less-than',
    description: `Given an object with numeric values and a limit number \`limit\`, return an array of all keys whose values are strictly less than \`limit\`.

### Example 1:
**Input:** obj = { "a": 5, "b": 15, "c": 10 }, limit = 11  
**Output:** [ "a", "c" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getKeysLessThan(obj, limit) {
  // Write your code here
}`,
    solutionCode: `function getKeysLessThan(obj, limit) {
  const result = [];
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] < limit) {
      result.push(key);
    }
  }
  return result;
}`,
    order: 432,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":5,"b":15,"c":10}, 11]',
        expectedOutput: '["a","c"]',
        isHidden: false,
        order: 1,
      },
      { input: '[{"x":10}, 5]', expectedOutput: '[]', isHidden: false, order: 2 },
      { input: '[{}, 0]', expectedOutput: '[]', isHidden: true, order: 3 },
      { input: '[{"a":0,"b":-5}, 0]', expectedOutput: '["b"]', isHidden: true, order: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting object problems seeding...');

  for (const problemData of objectProblems) {
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

  console.log('🎉 Database seeding complete for object problems!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
