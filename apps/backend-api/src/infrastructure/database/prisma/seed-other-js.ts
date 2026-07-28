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

export const otherJsProblems: ProblemSeed[] = [
  // ==========================================
  // OBJECTS (1-23)
  // ==========================================
  {
    title: 'Create an Object',
    slug: 'create-an-object',
    description: `Write a function that creates and returns an object with the properties: \`name\` (string), \`age\` (number), and \`isDeveloper\` (boolean) matching the passed arguments.

### Example 1:
**Input:** name = "Alice", age = 25, isDeveloper = true  
**Output:** { "name": "Alice", "age": 25, "isDeveloper": true }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function createObject(name, age, isDeveloper) {
  // Write your code here
}`,
    solutionCode: `function createObject(name, age, isDeveloper) {
  return { name, age, isDeveloper };
}`,
    order: 201,
    isPublished: true,
    testCases: [
      {
        input: '["Alice", 25, true]',
        expectedOutput: '{"name":"Alice","age":25,"isDeveloper":true}',
        isHidden: false,
        order: 1,
      },
      {
        input: '["Bob", 30, false]',
        expectedOutput: '{"name":"Bob","age":30,"isDeveloper":false}',
        isHidden: false,
        order: 2,
      },
    ],
  },
  {
    title: 'Manipulate Objects',
    slug: 'manipulate-objects',
    description: `Given an object with \`name\` and \`age\` properties, update the \`age\` property by adding 1 to it and add a new property \`status\` set to the string \`"active"\`. Return the modified object.

### Example 1:
**Input:** obj = { "name": "Alice", "age": 25 }  
**Output:** { "name": "Alice", "age": 26, "status": "active" }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function manipulateObject(obj) {
  // Write your code here
}`,
    solutionCode: `function manipulateObject(obj) {
  obj.age += 1;
  obj.status = "active";
  return obj;
}`,
    order: 202,
    isPublished: true,
    testCases: [
      {
        input: '[{"name":"Alice","age":25}]',
        expectedOutput: '{"name":"Alice","age":26,"status":"active"}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Check If Object Is Empty',
    slug: 'check-object-empty',
    description: `Write a function that checks whether an object has no keys. Return \`true\` if empty, and \`false\` otherwise.

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
    order: 203,
    isPublished: true,
    testCases: [
      { input: '[{}]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '[{"a":1}]', expectedOutput: 'false', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Deep Copy an Object (JSON)',
    slug: 'deep-copy-object-json',
    description: `Create a deep copy of the passed object using \`JSON.parse(JSON.stringify(obj))\`. Do not modify the original object.

### Example 1:
**Input:** obj = { "a": 1, "b": { "c": 2 } }  
**Output:** { "a": 1, "b": { "c": 2 } }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function deepCopyJSON(obj) {
  // Write your code here
}`,
    solutionCode: `function deepCopyJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}`,
    order: 204,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":{"c":2}}]',
        expectedOutput: '{"a":1,"b":{"c":2}}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Deep Clone Manual',
    slug: 'deep-clone-manual',
    description: `Implement a manual deep clone function that handles nested objects, arrays, and primitive values recursively without using \`structuredClone()\` or \`JSON.parse/stringify\`.

### Example 1:
**Input:** obj = { "a": 1, "b": [2, 3] }  
**Output:** { "a": 1, "b": [2, 3] }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function deepClone(obj) {
  // Write your code here
}`,
    solutionCode: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const clone = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}`,
    order: 205,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":{"c":2}}]',
        expectedOutput: '{"a":1,"b":{"c":2}}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Shallow Copy',
    slug: 'shallow-copy-object',
    description: `Create and return a shallow copy of an object using the spread operator (\`...\`).

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "a": 1, "b": 2 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function shallowCopy(obj) {
  // Write your code here
}`,
    solutionCode: `function shallowCopy(obj) {
  return { ...obj };
}`,
    order: 206,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '{"a":1,"b":2}', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Delete a Property',
    slug: 'delete-object-property',
    description: `Given an object and a key string, delete the property corresponding to the key from the object in-place. Return the updated object.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }, key = "a"  
**Output:** { "b": 2 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function deleteProperty(obj, key) {
  // Write your code here
}`,
    solutionCode: `function deleteProperty(obj, key) {
  delete obj[key];
  return obj;
}`,
    order: 207,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}, "a"]', expectedOutput: '{"b":2}', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Remove the Last Property',
    slug: 'remove-last-property',
    description: `Remove the last property added to an object (based on \`Object.keys()\` property ordering). Return the modified object in-place.

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
    order: 208,
    isPublished: true,
    testCases: [{ input: '[{"a":1,"b":2}]', expectedOutput: '{"a":1}', isHidden: false, order: 1 }],
  },
  {
    title: 'Remove Highest Valued Property',
    slug: 'remove-highest-property',
    description: `Delete the property with the highest numeric value from the object. Return the updated object.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": 5 }  
**Output:** { "a": 10, "c": 5 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function removeHighest(obj) {
  // Write your code here
}`,
    solutionCode: `function removeHighest(obj) {
  let maxKey = null;
  let maxVal = -Infinity;
  for (const key in obj) {
    if (obj[key] > maxVal) {
      maxVal = obj[key];
      maxKey = key;
    }
  }
  if (maxKey) delete obj[maxKey];
  return obj;
}`,
    order: 209,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":10,"b":20,"c":5}]',
        expectedOutput: '{"a":10,"c":5}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Remove Lowest Valued Property',
    slug: 'remove-lowest-property',
    description: `Delete the property with the lowest numeric value from the object. Return the updated object.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": 5 }  
**Output:** { "a": 10, "b": 20 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function removeLowest(obj) {
  // Write your code here
}`,
    solutionCode: `function removeLowest(obj) {
  let minKey = null;
  let minVal = Infinity;
  for (const key in obj) {
    if (obj[key] < minVal) {
      minVal = obj[key];
      minKey = key;
    }
  }
  if (minKey) delete obj[minKey];
  return obj;
}`,
    order: 210,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":10,"b":20,"c":5}]',
        expectedOutput: '{"a":10,"b":20}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Remove Odd Valued Properties',
    slug: 'remove-odd-properties',
    description: `Remove all properties from the passed object where the values are odd integers. Return the updated object.

### Example 1:
**Input:** obj = { "a": 2, "b": 3, "c": 4 }  
**Output:** { "a": 2, "c": 4 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function removeOddValued(obj) {
  // Write your code here
}`,
    solutionCode: `function removeOddValued(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'number' && obj[key] % 2 !== 0) {
      delete obj[key];
    }
  }
  return obj;
}`,
    order: 211,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":2,"b":3,"c":4}]',
        expectedOutput: '{"a":2,"c":4}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Add a New Property',
    slug: 'add-object-property',
    description: `Add a new key-value pair to the given object. Return the updated object.

### Example 1:
**Input:** obj = { "a": 1 }, key = "b", val = 2  
**Output:** { "a": 1, "b": 2 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function addProperty(obj, key, val) {
  // Write your code here
}`,
    solutionCode: `function addProperty(obj, key, val) {
  obj[key] = val;
  return obj;
}`,
    order: 212,
    isPublished: true,
    testCases: [
      { input: '[{"a":1}, "b", 2]', expectedOutput: '{"a":1,"b":2}', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Merge Two Objects',
    slug: 'merge-two-objects',
    description: `Merge the properties of two objects together. Return a new merged object containing properties of both.

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
    order: 213,
    isPublished: true,
    testCases: [
      { input: '[{"a":1}, {"b":2}]', expectedOutput: '{"a":1,"b":2}', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Combine Two Objects',
    slug: 'combine-two-objects',
    description: `Combine properties of two objects. If they share a key and both values are numbers, sum their values. Otherwise, the value from the second object should overwrite the first. Return the resulting object.

### Example 1:
**Input:** obj1 = { "a": 1, "b": 2 }, obj2 = { "b": 3, "c": 4 }  
**Output:** { "a": 1, "b": 5, "c": 4 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function combineObjects(obj1, obj2) {
  // Write your code here
}`,
    solutionCode: `function combineObjects(obj1, obj2) {
  const result = { ...obj1 };
  for (const key in obj2) {
    if (key in result) {
      if (typeof result[key] === 'number' && typeof obj2[key] === 'number') {
        result[key] += obj2[key];
      } else {
        result[key] = obj2[key];
      }
    } else {
      result[key] = obj2[key];
    }
  }
  return result;
}`,
    order: 214,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":2}, {"b":3,"c":4}]',
        expectedOutput: '{"a":1,"b":5,"c":4}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Convert Nested to Flat Object',
    slug: 'flatten-nested-object',
    description: `Flatten a nested object. The keys of the flattened object should represent the paths to the nested values, separated by a dot (\`.\`).

### Example 1:
**Input:** obj = { "a": 1, "b": { "c": 2, "d": { "e": 3 } } }  
**Output:** { "a": 1, "b.c": 2, "b.d.e": 3 }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function flattenObject(obj) {
  // Write your code here
}`,
    solutionCode: `function flattenObject(obj, prefix = '') {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], prefix + key + '.'));
    } else {
      result[prefix + key] = obj[key];
    }
  }
  return result;
}`,
    order: 215,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":{"c":2,"d":{"e":3}}}]',
        expectedOutput: '{"a":1,"b.c":2,"b.d.e":3}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Convert Object to Key-Value Array',
    slug: 'object-to-array-of-kv',
    description: `Convert an object into an array of objects where each element is an object with \`key\` and \`value\` properties.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ { "key": "a", "value": 1 }, { "key": "b", "value": 2 } ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function objectToKeyValueArray(obj) {
  // Write your code here
}`,
    solutionCode: `function objectToKeyValueArray(obj) {
  return Object.entries(obj).map(([key, value]) => ({ key, value }));
}`,
    order: 216,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":2}]',
        expectedOutput: '[{"key":"a","value":1},{"key":"b","value":2}]',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Key with Highest Value',
    slug: 'key-with-highest-value',
    description: `Find and return the key name that holds the highest numeric value in the object. Return \`null\` if empty.

### Example 1:
**Input:** obj = { "a": 10, "b": 25, "c": 5 }  
**Output:** "b"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getHighestKey(obj) {
  // Write your code here
}`,
    solutionCode: `function getHighestKey(obj) {
  let maxKey = null;
  let maxVal = -Infinity;
  for (const key in obj) {
    if (obj[key] > maxVal) {
      maxVal = obj[key];
      maxKey = key;
    }
  }
  return maxKey;
}`,
    order: 217,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":25,"c":5}]', expectedOutput: '"b"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Key with Lowest Value',
    slug: 'key-with-lowest-value',
    description: `Find and return the key name that holds the lowest numeric value in the object. Return \`null\` if empty.

### Example 1:
**Input:** obj = { "a": 10, "b": 25, "c": 5 }  
**Output:** "c"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getLowestKey(obj) {
  // Write your code here
}`,
    solutionCode: `function getLowestKey(obj) {
  let minKey = null;
  let minVal = Infinity;
  for (const key in obj) {
    if (obj[key] < minVal) {
      minVal = obj[key];
      minKey = key;
    }
  }
  return minKey;
}`,
    order: 218,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":25,"c":5}]', expectedOutput: '"c"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Sum of Object Values',
    slug: 'sum-of-object-values',
    description: `Return the sum of all numeric values inside an object. Ignore properties that are not numbers.

### Example 1:
**Input:** obj = { "a": 10, "b": 20, "c": "test" }  
**Output:** 30`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function sumObjectValues(obj) {
  // Write your code here
}`,
    solutionCode: `function sumObjectValues(obj) {
  return Object.values(obj).reduce((sum, val) => typeof val === 'number' ? sum + val : sum, 0);
}`,
    order: 219,
    isPublished: true,
    testCases: [
      { input: '[{"a":10,"b":20,"c":"test"}]', expectedOutput: '30', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Sum of Object Keys Length',
    slug: 'sum-of-object-keys-lengths',
    description: `Calculate and return the sum of the string lengths of all key names in an object.

### Example 1:
**Input:** obj = { "apple": 1, "banana": 2 }  
**Output:** 11  
**Explanation:** Keys are "apple" (length 5) and "banana" (length 6). Total sum of key lengths is 11.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function sumKeyLengths(obj) {
  // Write your code here
}`,
    solutionCode: `function sumKeyLengths(obj) {
  return Object.keys(obj).reduce((sum, key) => sum + key.length, 0);
}`,
    order: 220,
    isPublished: true,
    testCases: [
      { input: '[{"apple":1,"banana":2}]', expectedOutput: '11', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Check Object Value Types',
    slug: 'check-object-value-types',
    description: `Check the types of all values in the object. If all values are of the exact same type (e.g. all numbers or all strings), return the string \`"Error: All values are of the same type"\`. Otherwise, return \`true\`.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** "Error: All values are of the same type"

### Example 2:
**Input:** obj = { "a": 1, "b": "hello" }  
**Output:** true`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function checkValueTypes(obj) {
  // Write your code here
}`,
    solutionCode: `function checkValueTypes(obj) {
  const values = Object.values(obj);
  if (values.length === 0) return true;
  const firstType = typeof values[0];
  const allSame = values.every(val => typeof val === firstType);
  return allSame ? "Error: All values are of the same type" : true;
}`,
    order: 221,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":2}]',
        expectedOutput: '"Error: All values are of the same type"',
        isHidden: false,
        order: 1,
      },
      { input: '[{"a":1,"b":"hello"}]', expectedOutput: 'true', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Loop Through Objects',
    slug: 'loop-through-objects',
    description: `Loop through the key-value pairs of an object using a \`for...in\` loop and return an array of strings formatted as \`"key:value"\`.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** [ "a:1", "b:2" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects', 'loops'],
    starterCode: `function loopObject(obj) {
  // Write your code here
}`,
    solutionCode: `function loopObject(obj) {
  const result = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result.push(\`\${key}:\${obj[key]}\`);
    }
  }
  return result;
}`,
    order: 222,
    isPublished: true,
    testCases: [
      { input: '[{"a":1,"b":2}]', expectedOutput: '["a:1","b:2"]', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Object Methods Demo',
    slug: 'object-methods-demo',
    description: `Given an object, return an object containing its keys, values, and entries formatted as:
\`{ keys: string[], values: any[], entries: [string, any][] }\` using \`Object.keys()\`, \`Object.values()\`, and \`Object.entries()\`.

### Example 1:
**Input:** obj = { "a": 1, "b": 2 }  
**Output:** { "keys": ["a", "b"], "values": [1, 2], "entries": [["a", 1], ["b", 2]] }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['objects'],
    starterCode: `function getObjectMetadata(obj) {
  // Write your code here
}`,
    solutionCode: `function getObjectMetadata(obj) {
  return {
    keys: Object.keys(obj),
    values: Object.values(obj),
    entries: Object.entries(obj)
  };
}`,
    order: 223,
    isPublished: true,
    testCases: [
      {
        input: '[{"a":1,"b":2}]',
        expectedOutput: '{"keys":["a","b"],"values":[1,2],"entries":[["a",1],["b",2]]}',
        isHidden: false,
        order: 1,
      },
    ],
  },

  // ==========================================
  // STRINGS (24-36)
  // ==========================================
  {
    title: 'Reverse Each Word',
    slug: 'reverse-each-word',
    description: `Given a sentence, reverse the characters of each word in-place while keeping the original word order.

### Example 1:
**Input:** sentence = "How Are You"  
**Output:** "woH erA uoY"`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function reverseEachWord(sentence) {
  // Write your code here
}`,
    solutionCode: `function reverseEachWord(sentence) {
  return sentence.split(' ').map(word => word.split('').reverse().join('')).join(' ');
}`,
    order: 224,
    isPublished: true,
    testCases: [
      { input: '["How Are You"]', expectedOutput: '"woH erA uoY"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Reverse String (No Built-ins)',
    slug: 'reverse-string-loop',
    description: `Reverse a string using a loop. Do not use the built-in \`.reverse()\` array method.

### Example 1:
**Input:** str = "hello"  
**Output:** "olleh"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings', 'loops'],
    starterCode: `function reverseStringNoReverse(str) {
  // Write your code here
}`,
    solutionCode: `function reverseStringNoReverse(str) {
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}`,
    order: 225,
    isPublished: true,
    testCases: [{ input: '["hello"]', expectedOutput: '"olleh"', isHidden: false, order: 1 }],
  },
  {
    title: 'Palindrome Checker (Ignore Special)',
    slug: 'string-palindrome-check',
    description: `Check if a string is a palindrome. Ignore cases, spaces, and all non-alphanumeric characters.

### Example 1:
**Input:** str = "Racecar"  
**Output:** true`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function isPalindrome(str) {
  // Write your code here
}`,
    solutionCode: `function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    order: 226,
    isPublished: true,
    testCases: [
      { input: '["Racecar"]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '["hello"]', expectedOutput: 'false', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Reverse Words Order',
    slug: 'reverse-words-order',
    description: `Reverse the order of words in a sentence.

### Example 1:
**Input:** sentence = "hello world"  
**Output:** "world hello"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function reverseWords(sentence) {
  // Write your code here
}`,
    solutionCode: `function reverseWords(sentence) {
  return sentence.split(' ').reverse().join(' ');
}`,
    order: 227,
    isPublished: true,
    testCases: [
      { input: '["hello world"]', expectedOutput: '"world hello"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Capitalize Every Word',
    slug: 'capitalize-every-word',
    description: `Capitalize the first letter of every word in a sentence.

### Example 1:
**Input:** sentence = "hello world from javascript"  
**Output:** "Hello World From Javascript"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function capitalizeWords(sentence) {
  // Write your code here
}`,
    solutionCode: `function capitalizeWords(sentence) {
  return sentence.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}`,
    order: 228,
    isPublished: true,
    testCases: [
      {
        input: '["hello world from javascript"]',
        expectedOutput: '"Hello World From Javascript"',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Capitalize First Letter',
    slug: 'capitalize-first-letter',
    description: `Capitalize only the first character of a string.

### Example 1:
**Input:** str = "javascript"  
**Output:** "Javascript"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function capitalizeFirstLetter(str) {
  // Write your code here
}`,
    solutionCode: `function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}`,
    order: 229,
    isPublished: true,
    testCases: [
      { input: '["javascript"]', expectedOutput: '"Javascript"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Capitalize First and Last Letters',
    slug: 'capitalize-first-last-letters',
    description: `Capitalize the first and last characters of every word in a sentence.

### Example 1:
**Input:** sentence = "hello world"  
**Output:** "HellO WorlD"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function capitalizeFirstLast(sentence) {
  // Write your code here
}`,
    solutionCode: `function capitalizeFirstLast(sentence) {
  return sentence.split(' ').map(w => {
    if (w.length <= 1) return w.toUpperCase();
    return w.charAt(0).toUpperCase() + w.slice(1, -1) + w.slice(-1).toUpperCase();
  }).join(' ');
}`,
    order: 230,
    isPublished: true,
    testCases: [
      { input: '["hello world"]', expectedOutput: '"HellO WorlD"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Remove Character',
    slug: 'remove-character',
    description: `Remove all occurrences of a specified character from a string.

### Example 1:
**Input:** str = "banana", char = "a"  
**Output:** "bnn"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function removeChar(str, char) {
  // Write your code here
}`,
    solutionCode: `function removeChar(str, char) {
  return str.split(char).join('');
}`,
    order: 231,
    isPublished: true,
    testCases: [{ input: '["banana", "a"]', expectedOutput: '"bnn"', isHidden: false, order: 1 }],
  },
  {
    title: 'Split First Two Characters',
    slug: 'split-first-two-characters',
    description: `Split the first two characters of a string and place them in a two-element array: the first two characters as the first element, and the rest of the string as the second. If the string has fewer than 2 characters, place the entire string in the first index, and an empty string in the second.

### Example 1:
**Input:** str = "javascript"  
**Output:** [ "ja", "vascript" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function splitFirstTwo(str) {
  // Write your code here
}`,
    solutionCode: `function splitFirstTwo(str) {
  if (str.length < 2) return [str, ""];
  return [str.slice(0, 2), str.slice(2)];
}`,
    order: 232,
    isPublished: true,
    testCases: [
      { input: '["javascript"]', expectedOutput: '["ja","vascript"]', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Longest Word using Reduce',
    slug: 'longest-word-reduce',
    description: `Find the longest word in a sentence using the \`.reduce()\` array method.

### Example 1:
**Input:** sentence = "I love programming in Javascript"  
**Output:** "programming"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function findLongestWord(sentence) {
  // Write your code here
}`,
    solutionCode: `function findLongestWord(sentence) {
  return sentence.split(' ').reduce((longest, word) => word.length > longest.length ? word : longest, "");
}`,
    order: 233,
    isPublished: true,
    testCases: [
      {
        input: '["I love programming in Javascript"]',
        expectedOutput: '"programming"',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Count Characters',
    slug: 'count-characters',
    description: `Count the occurrences of each character in a string. Return an object where keys are the characters and values are their counts.

### Example 1:
**Input:** str = "hello"  
**Output:** { "h": 1, "e": 1, "l": 2, "o": 1 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function countChars(str) {
  // Write your code here
}`,
    solutionCode: `function countChars(str) {
  const counts = {};
  for (const char of str) {
    counts[char] = (counts[char] || 0) + 1;
  }
  return counts;
}`,
    order: 234,
    isPublished: true,
    testCases: [
      {
        input: '["hello"]',
        expectedOutput: '{"h":1,"e":1,"l":2,"o":1}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Remove Smallest String',
    slug: 'remove-smallest-string',
    description: `Given an array of strings, remove the shortest string. If there are multiple strings sharing the shortest length, remove the first occurrence. Return the updated array.

### Example 1:
**Input:** arr = [ "apple", "cat", "banana" ]  
**Output:** [ "apple", "banana" ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings', 'arrays'],
    starterCode: `function removeShortestString(arr) {
  // Write your code here
}`,
    solutionCode: `function removeShortestString(arr) {
  if (arr.length === 0) return [];
  let shortestIdx = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].length < arr[shortestIdx].length) {
      shortestIdx = i;
    }
  }
  arr.splice(shortestIdx, 1);
  return arr;
}`,
    order: 235,
    isPublished: true,
    testCases: [
      {
        input: '[["apple", "cat", "banana"]]',
        expectedOutput: '["apple","banana"]',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Array of Strings to Object',
    slug: 'array-of-strings-to-object',
    description: `Convert an array of strings into an object where keys are the strings and values are their respective lengths.

### Example 1:
**Input:** arr = [ "a", "ab", "abc" ]  
**Output:** { "a": 1, "b": 2, "abc": 3 }`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings', 'objects'],
    starterCode: `function stringsToObject(arr) {
  // Write your code here
}`,
    solutionCode: `function stringsToObject(arr) {
  const obj = {};
  for (const str of arr) {
    obj[str] = str.length;
  }
  return obj;
}`,
    order: 236,
    isPublished: true,
    testCases: [
      {
        input: '[["a", "ab", "abc"]]',
        expectedOutput: '{"a":1,"ab":2,"abc":3}',
        isHidden: false,
        order: 1,
      },
    ],
  },

  // ==========================================
  // FUNCTIONS (37-57)
  // ==========================================
  {
    title: 'Create a Promise',
    slug: 'create-a-promise',
    description: `Create and return a Promise that resolves with the string \`"Success"\` after a specified delay in milliseconds.

### Example 1:
**Input:** delay = 50  
**Output:** "Success"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function createDelayPromise(delay) {
  // Write your code here
}`,
    solutionCode: `function createDelayPromise(delay) {
  return new Promise((resolve) => setTimeout(() => resolve("Success"), delay));
}`,
    order: 237,
    isPublished: true,
    testCases: [{ input: '[50]', expectedOutput: '"Success"', isHidden: false, order: 1 }],
  },
  {
    title: 'Create Callback Code',
    slug: 'create-callback-code',
    description: `Write a wrapper function \`runCallbackExample(name)\` which internally declares a callback-expecting function \`greet(name, cb)\`. \`greet\` executes the callback passing \`"Hello, [name]"\`. Execute and return the callback's result.

### Example 1:
**Input:** name = "Alice"  
**Output:** "Hello, Alice"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runCallbackExample(name) {
  // Write your code here
}`,
    solutionCode: `function runCallbackExample(name) {
  function greet(n, cb) {
    cb("Hello, " + n);
  }
  let result = "";
  greet(name, (msg) => {
    result = msg;
  });
  return result;
}`,
    order: 238,
    isPublished: true,
    testCases: [
      { input: '["Alice"]', expectedOutput: '"Hello, Alice"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Convert Callback to Promise',
    slug: 'callback-to-promise',
    description: `Wrap a callback-based asynchronous function inside a Promise so that it resolves with the callback value.

### Example 1:
**Input:** value = "test"  
**Output:** "Data: test"`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runCallbackToPromise(value) {
  // Write your code here
}`,
    solutionCode: `function runCallbackToPromise(value) {
  function fetchDataCallback(val, cb) {
    setTimeout(() => cb(null, "Data: " + val), 10);
  }
  
  return new Promise((resolve, reject) => {
    fetchDataCallback(value, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}`,
    order: 239,
    isPublished: true,
    testCases: [{ input: '["test"]', expectedOutput: '"Data: test"', isHidden: false, order: 1 }],
  },
  {
    title: 'Async/Await Handler',
    slug: 'async-await-handler',
    description: `Create an asynchronous function \`handleAsyncAwait(shouldResolve, value)\` that awaits a promise. If the promise resolves, return the resolved value. If it rejects, catch the error and return \`"Error: [error-message]"\`.

### Example 1:
**Input:** shouldResolve = true, value = "success"  
**Output:** "success"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `async function handleAsyncAwait(shouldResolve, value) {
  // Write your code here
}`,
    solutionCode: `async function handleAsyncAwait(shouldResolve, value) {
  const makePromise = () => new Promise((resolve, reject) => {
    if (shouldResolve) resolve(value);
    else reject(new Error(value));
  });
  try {
    return await makePromise();
  } catch (e) {
    return "Error: " + e.message;
  }
}`,
    order: 240,
    isPublished: true,
    testCases: [
      { input: '[true, "success"]', expectedOutput: '"success"', isHidden: false, order: 1 },
      { input: '[false, "failed"]', expectedOutput: '"Error: failed"', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Promise Chaining',
    slug: 'promise-chaining',
    description: `Chain two promises. The first promise resolves with \`n\`, and the second resolves with \`n * 2\`. Return the final resolved value from the promise chain.

### Example 1:
**Input:** n = 5  
**Output:** 10`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function chainPromises(n) {
  // Write your code here
}`,
    solutionCode: `function chainPromises(n) {
  return Promise.resolve(n)
    .then((val) => val * 2);
}`,
    order: 241,
    isPublished: true,
    testCases: [{ input: '[5]', expectedOutput: '10', isHidden: false, order: 1 }],
  },
  {
    title: 'Arrow Function: Square',
    slug: 'arrow-square',
    description: `Write a short arrow function \`square\` that returns the square of the given number.

### Example 1:
**Input:** x = 4  
**Output:** 16`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `const square = null; // Write arrow function here`,
    solutionCode: `const square = (x) => x * x;`,
    order: 242,
    isPublished: true,
    testCases: [{ input: '[4]', expectedOutput: '16', isHidden: false, order: 1 }],
  },
  {
    title: 'Arrow Function: Sum',
    slug: 'arrow-sum',
    description: `Write an arrow function \`sum\` that takes two numbers and returns their sum.

### Example 1:
**Input:** a = 3, b = 5  
**Output:** 8`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `const sum = null; // Write arrow function here`,
    solutionCode: `const sum = (a, b) => a + b;`,
    order: 243,
    isPublished: true,
    testCases: [{ input: '[3, 5]', expectedOutput: '8', isHidden: false, order: 1 }],
  },
  {
    title: 'Arrow Function: Sum N Numbers',
    slug: 'arrow-sum-n',
    description: `Write an arrow function \`sumAll\` that takes any number of arguments using rest parameters and returns their sum.

### Example 1:
**Input:** args = [ 1, 2, 3, 4 ]  
**Output:** 10`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `const sumAll = null; // Write arrow function here`,
    solutionCode: `const sumAll = (...args) => args.reduce((s, x) => s + x, 0);`,
    order: 244,
    isPublished: true,
    testCases: [{ input: '[1, 2, 3, 4]', expectedOutput: '10', isHidden: false, order: 1 }],
  },
  {
    title: 'Higher Order Multiplier',
    slug: 'higher-order-func',
    description: `Create a higher-order function \`multiplier(factor)\` that returns a function. The returned function should take a number and multiply it by \`factor\`. We will test it using the wrapper \`testMultiplier(factor, num)\`.

### Example 1:
**Input:** factor = 3, num = 5  
**Output:** 15`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function testMultiplier(factor, num) {
  // Write multiplier(factor) higher-order function and execute it
}`,
    solutionCode: `function testMultiplier(factor, num) {
  function multiplier(factor) {
    return (x) => x * factor;
  }
  const multiplyBy = multiplier(factor);
  return multiplyBy(num);
}`,
    order: 245,
    isPublished: true,
    testCases: [{ input: '[3, 5]', expectedOutput: '15', isHidden: false, order: 1 }],
  },
  {
    title: 'Generator Count Up',
    slug: 'generator-basics',
    description: `Write a generator function \`countUp(n)\` that yields numbers from 1 to \`n\`. We will test it using the wrapper \`runCountUp(n)\` which returns yielded values as an array.

### Example 1:
**Input:** n = 5  
**Output:** [ 1, 2, 3, 4, 5 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runCountUp(n) {
  // Implement countUp generator and return its elements
}`,
    solutionCode: `function runCountUp(n) {
  function* countUp(n) {
    for (let i = 1; i <= n; i++) yield i;
  }
  return [...countUp(n)];
}`,
    order: 246,
    isPublished: true,
    testCases: [{ input: '[5]', expectedOutput: '[1,2,3,4,5]', isHidden: false, order: 1 }],
  },
  {
    title: 'Generator Countdown',
    slug: 'generator-reverse',
    description: `Write a generator function that yields numbers from \`n\` down to 1. Return them as an array.

### Example 1:
**Input:** n = 3  
**Output:** [ 3, 2, 1 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runReverseCount(n) {
  // Write generator and return array
}`,
    solutionCode: `function runReverseCount(n) {
  function* reverseCount(n) {
    for (let i = n; i >= 1; i--) yield i;
  }
  return [...reverseCount(n)];
}`,
    order: 247,
    isPublished: true,
    testCases: [{ input: '[3]', expectedOutput: '[3,2,1]', isHidden: false, order: 1 }],
  },
  {
    title: 'Generator Multiples',
    slug: 'generator-multiples',
    description: `Write a generator function that yields the first \`count\` positive multiples of \`num\`. Return them as an array.

### Example 1:
**Input:** num = 3, count = 4  
**Output:** [ 3, 6, 9, 12 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runMultiples(num, count) {
  // Write generator and return array
}`,
    solutionCode: `function runMultiples(num, count) {
  function* multiples(n, c) {
    for (let i = 1; i <= c; i++) yield n * i;
  }
  return [...multiples(num, count)];
}`,
    order: 248,
    isPublished: true,
    testCases: [{ input: '[3, 4]', expectedOutput: '[3,6,9,12]', isHidden: false, order: 1 }],
  },
  {
    title: 'Currying Example',
    slug: 'currying-example',
    description: `Implement a curried multiplication function \`multiply(a)(b)(c)\` which multiplies three numbers together. We will test it using the wrapper \`runCurry(a, b, c)\`.

### Example 1:
**Input:** a = 2, b = 3, c = 4  
**Output:** 24`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runCurry(a, b, c) {
  // Implement curried multiply(a)(b)(c) and execute it
}`,
    solutionCode: `function runCurry(a, b, c) {
  function multiply(a) {
    return (b) => (c) => a * b * c;
  }
  return multiply(a)(b)(c);
}`,
    order: 249,
    isPublished: true,
    testCases: [{ input: '[2, 3, 4]', expectedOutput: '24', isHidden: false, order: 1 }],
  },
  {
    title: 'Closure Counter Object',
    slug: 'closure-counter',
    description: `Create a counter closure using a private state variable. \`runCounter(actions)\` should initialize a counter at 0 and perform an array of string actions: \`"inc"\` (increment) or \`"dec"\` (decrement), and return the final count.

### Example 1:
**Input:** actions = [ "inc", "inc", "dec", "inc" ]  
**Output:** 2`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runCounter(actions) {
  // Write counter closure and run actions list
}`,
    solutionCode: `function runCounter(actions) {
  function createCounter() {
    let count = 0;
    return {
      increment: () => ++count,
      decrement: () => --count
    };
  }
  const counter = createCounter();
  let lastVal = 0;
  for (const act of actions) {
    if (act === "inc") lastVal = counter.increment();
    else if (act === "dec") lastVal = counter.decrement();
  }
  return lastVal;
}`,
    order: 250,
    isPublished: true,
    testCases: [
      { input: '[["inc", "inc", "dec", "inc"]]', expectedOutput: '2', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'Memoization Factorial',
    slug: 'memoization-factorial',
    description: `Create a memoized factorial function. Implement factorial recursive computation, storing calculated results in a cache map so subsequent queries are fetched in O(1) time.

### Example 1:
**Input:** n = 5  
**Output:** 120`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runMemoFactorial(n) {
  // Implement memoized factorial
}`,
    solutionCode: `function runMemoFactorial(n) {
  const cache = {};
  function factorial(x) {
    if (x <= 1) return 1;
    if (x in cache) return cache[x];
    cache[x] = x * factorial(x - 1);
    return cache[x];
  }
  return factorial(n);
}`,
    order: 251,
    isPublished: true,
    testCases: [{ input: '[5]', expectedOutput: '120', isHidden: false, order: 1 }],
  },
  {
    title: 'Function Borrowing',
    slug: 'function-borrowing',
    description: `Use function borrowing methods (\`call\`, \`apply\`, and \`bind\`) to apply a greeting method declared on one object onto a different object. Return results as an object: \`{ callResult, applyResult, bindResult }\`.

### Example 1:
**Input:** obj1 = { "name": "Alice" }, obj2 = { "name": "Bob" }  
**Output:** { "callResult": "Hello, Bob!", "applyResult": "Hi, Bob.", "bindResult": "Hey, Bob?" }`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runBorrowing(obj1, obj2) {
  // Use call, apply, and bind on obj1's methods with obj2 context
}`,
    solutionCode: `function runBorrowing(obj1, obj2) {
  const person1 = {
    name: obj1.name,
    greet: function(greeting, punctuation) {
      return greeting + ", " + this.name + punctuation;
    }
  };
  const person2 = {
    name: obj2.name
  };
  
  const callResult = person1.greet.call(person2, "Hello", "!");
  const applyResult = person1.greet.apply(person2, ["Hi", "."]);
  const boundGreet = person1.greet.bind(person2);
  const bindResult = boundGreet("Hey", "?");
  
  return { callResult, applyResult, bindResult };
}`,
    order: 252,
    isPublished: true,
    testCases: [
      {
        input: '[{"name":"Alice"}, {"name":"Bob"}]',
        expectedOutput:
          '{"callResult":"Hello, Bob!","applyResult":"Hi, Bob.","bindResult":"Hey, Bob?"}',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Custom Filter Method',
    slug: 'custom-filter-impl',
    description: `Implement a custom filtering algorithm \`customFilter(arr, callback)\` that replicates the functionality of \`Array.prototype.filter()\` without using it. We will test it using the wrapper \`runCustomFilter(arr, threshold)\` which returns elements greater than the threshold.

### Example 1:
**Input:** arr = [ 1, 5, 8, 2 ], threshold = 4  
**Output:** [ 5, 8 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions', 'arrays'],
    starterCode: `function runCustomFilter(arr, threshold) {
  // Implement customFilter(arr, callback) and run it
}`,
    solutionCode: `function runCustomFilter(arr, threshold) {
  function customFilter(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (callback(arr[i], i, arr)) result.push(arr[i]);
    }
    return result;
  }
  return customFilter(arr, (x) => x > threshold);
}`,
    order: 253,
    isPublished: true,
    testCases: [{ input: '[[1, 5, 8, 2], 4]', expectedOutput: '[5,8]', isHidden: false, order: 1 }],
  },
  {
    title: 'Function Composition',
    slug: 'function-composition',
    description: `Implement a function composition utility \`compose(...funcs)\` which pipes values sequentially from right to left. E.g. \`compose(f, g)(x)\` evaluates to \`f(g(x))\`.

### Example 1:
**Input:** x = 4  
**Output:** 14  
**Explanation:** Composition of add2 (x+2) and multiply3 (x*3) evaluates: add2(multiply3(4)) = add2(12) = 14.`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runComposition(x) {
  // Write composition utility and evaluate compose(add2, multiply3)(x)
}`,
    solutionCode: `function runComposition(x) {
  const add2 = (num) => num + 2;
  const multiply3 = (num) => num * 3;
  function compose(...funcs) {
    return (val) => funcs.reduceRight((v, fn) => fn(v), val);
  }
  return compose(add2, multiply3)(x);
}`,
    order: 254,
    isPublished: true,
    testCases: [{ input: '[4]', expectedOutput: '14', isHidden: false, order: 1 }],
  },
  {
    title: 'Factory Function Profile',
    slug: 'factory-function-demo',
    description: `Create a factory function \`createUser(name, role)\` that instantiates an object with properties \`name\` and \`role\`, and a method \`getProfile()\` returning \`"Name: [name], Role: [role]"\`.

### Example 1:
**Input:** name = "Alice", role = "Admin"  
**Output:** "Name: Alice, Role: Admin"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runFactory(name, role) {
  // Implement factory function createUser and return its profile
}`,
    solutionCode: `function runFactory(name, role) {
  function createUser(name, role) {
    return {
      name,
      role,
      getProfile() {
        return \`Name: \${name}, Role: \${role}\`;
      }
    };
  }
  const user = createUser(name, role);
  return user.getProfile();
}`,
    order: 255,
    isPublished: true,
    testCases: [
      {
        input: '["Alice", "Admin"]',
        expectedOutput: '"Name: Alice, Role: Admin"',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Constructor Function Profile',
    slug: 'constructor-function-demo',
    description: `Create a constructor function \`User(name, role)\` that creates an object, adding a method \`getProfile()\` on its prototype returning \`"Name: [name], Role: [role]"\`.

### Example 1:
**Input:** name = "Bob", role = "Moderator"  
**Output:** "Name: Bob, Role: Moderator"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runConstructor(name, role) {
  // Implement Constructor function User and return prototype profile
}`,
    solutionCode: `function runConstructor(name, role) {
  function User(name, role) {
    this.name = name;
    this.role = role;
  }
  User.prototype.getProfile = function() {
    return \`Name: \${this.name}, Role: \${this.role}\`;
  };
  const user = new User(name, role);
  return user.getProfile();
}`,
    order: 256,
    isPublished: true,
    testCases: [
      {
        input: '["Bob", "Moderator"]',
        expectedOutput: '"Name: Bob, Role: Moderator"',
        isHidden: false,
        order: 1,
      },
    ],
  },
  {
    title: 'Declare and Call Function',
    slug: 'declare-and-call-fn',
    description: `Write a function \`runCalculation(a, b)\` which declares a nested helper function \`addAndMultiply(x, y)\` inside it. The helper function sums \`x\` and \`y\` and multiplies the result by 5. Return the result of calling it with arguments \`a\` and \`b\`.

### Example 1:
**Input:** a = 2, b = 3  
**Output:** 25`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['functions'],
    starterCode: `function runCalculation(a, b) {
  // Write your code here
}`,
    solutionCode: `function runCalculation(a, b) {
  function addAndMultiply(x, y) {
    return (x + y) * 5;
  }
  return addAndMultiply(a, b);
}`,
    order: 257,
    isPublished: true,
    testCases: [{ input: '[2, 3]', expectedOutput: '25', isHidden: false, order: 1 }],
  },

  // ==========================================
  // LOOPS & TIMERS (58-64)
  // ==========================================
  {
    title: 'Sum Numbers to Limit (while)',
    slug: 'sum-to-100-while',
    description: `Sum numbers from 1 up to a specified limit using a \`while\` loop. Return the total sum.

### Example 1:
**Input:** limit = 100  
**Output:** 5050`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function sumToLimit(limit) {
  // Write your code here
}`,
    solutionCode: `function sumToLimit(limit) {
  let sum = 0;
  let i = 1;
  while (i <= limit) {
    sum += i;
    i++;
  }
  return sum;
}`,
    order: 258,
    isPublished: true,
    testCases: [
      { input: '[100]', expectedOutput: '5050', isHidden: false, order: 1 },
      { input: '[10]', expectedOutput: '55', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Print with Delay (async)',
    slug: 'print-with-delay',
    description: `Write an asynchronous function \`printWithDelay(n)\` that generates an array of numbers from 1 to \`n\` sequentially with a short simulated async delay in each iteration.

### Example 1:
**Input:** n = 5  
**Output:** [ 1, 2, 3, 4, 5 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['loops', 'timers'],
    starterCode: `async function printWithDelay(n) {
  // Write your code here
}`,
    solutionCode: `async function printWithDelay(n) {
  const result = [];
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  for (let i = 1; i <= n; i++) {
    await delay(10);
    result.push(i);
  }
  return result;
}`,
    order: 259,
    isPublished: true,
    testCases: [{ input: '[5]', expectedOutput: '[1,2,3,4,5]', isHidden: false, order: 1 }],
  },
  {
    title: 'Print Countdown (async)',
    slug: 'print-countdown-delay',
    description: `Write an asynchronous function \`printCountdown(n)\` that generates an array of numbers from \`n\` down to 1 sequentially with a short simulated async delay in each iteration.

### Example 1:
**Input:** n = 5  
**Output:** [ 5, 4, 3, 2, 1 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['loops', 'timers'],
    starterCode: `async function printCountdown(n) {
  // Write your code here
}`,
    solutionCode: `async function printCountdown(n) {
  const result = [];
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  for (let i = n; i >= 1; i--) {
    await delay(10);
    result.push(i);
  }
  return result;
}`,
    order: 260,
    isPublished: true,
    testCases: [{ input: '[5]', expectedOutput: '[5,4,3,2,1]', isHidden: false, order: 1 }],
  },
  {
    title: 'Countdown Timer to Zero (async)',
    slug: 'countdown-timer-zero',
    description: `Write an asynchronous function \`countdownToZero(n)\` that generates an array of numbers from \`n\` down to 0 sequentially with a short simulated async delay in each iteration.

### Example 1:
**Input:** n = 3  
**Output:** [ 3, 2, 1, 0 ]`,
    difficulty: 'MEDIUM',
    category: 'JAVASCRIPT',
    tags: ['loops', 'timers'],
    starterCode: `async function countdownToZero(n) {
  // Write your code here
}`,
    solutionCode: `async function countdownToZero(n) {
  const result = [];
  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  for (let i = n; i >= 0; i--) {
    await delay(10);
    result.push(i);
  }
  return result;
}`,
    order: 261,
    isPublished: true,
    testCases: [{ input: '[3]', expectedOutput: '[3,2,1,0]', isHidden: false, order: 1 }],
  },
  {
    title: 'Deterministic Pseudo-Random LCG',
    slug: 'generate-random-in-range',
    description: `Implement a deterministic pseudo-random number generator using the Linear Congruential Generator (LCG) algorithm. Formula: \`X_{n+1} = (a * X_n + c) % m\`.
Use the constants: \`a = 1664525\`, \`c = 1013904223\`, and \`m = 2^32\`.
Return the next integer scaled to the range \`[min, max]\` inclusive: \`Math.floor(scale * (max - min + 1)) + min\`, where \`scale = nextSeed / m\`.

### Example 1:
**Input:** seed = 42, min = 0, max = 10  
**Output:** 2`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops', 'math'],
    starterCode: `function getLcgRandom(seed, min, max) {
  // Write your code here
}`,
    solutionCode: `function getLcgRandom(seed, min, max) {
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);
  const nextSeed = (a * seed + c) % m;
  const scale = nextSeed / m;
  return Math.floor(scale * (max - min + 1)) + min;
}`,
    order: 262,
    isPublished: true,
    testCases: [
      { input: '[42, 0, 10]', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '[100, 1, 100]', expectedOutput: '28', isHidden: false, order: 2 },
    ],
  },
  {
    title: 'Format Time (HH:MM:SS)',
    slug: 'format-current-time',
    description: `Given a Date timestamp (milliseconds), extract and format the UTC time into a string pattern: \`HH:MM:SS\`. Ensure numbers under 10 are zero-padded (e.g. \`"05"\`).

### Example 1:
**Input:** timestamp = 1716382000000  
**Output:** "12:46:40"`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function formatTime(timestamp) {
  // Write your code here
}`,
    solutionCode: `function formatTime(timestamp) {
  const date = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, '0');
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return \`\${hh}:\${mm}:\${ss}\`;
}`,
    order: 263,
    isPublished: true,
    testCases: [
      { input: '[1716382000000]', expectedOutput: '"12:46:40"', isHidden: false, order: 1 },
    ],
  },
  {
    title: 'First 5 Multiples of 3 (while loop)',
    slug: 'first-five-multiples-three-loop',
    description: `Return an array containing the first 5 positive multiples of 3 (3, 6, 9, 12, 15) using a \`while\` loop.

### Example:
**Output:** [ 3, 6, 9, 12, 15 ]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['loops'],
    starterCode: `function getFirstFiveMultiples() {
  // Write your code here
}`,
    solutionCode: `function getFirstFiveMultiples() {
  const result = [];
  let num = 3;
  while (result.length < 5) {
    result.push(num);
    num += 3;
  }
  return result;
}`,
    order: 264,
    isPublished: true,
    testCases: [{ input: '[]', expectedOutput: '[3,6,9,12,15]', isHidden: false, order: 1 }],
  },
  {
    title: 'Promise.all Polyfill',
    slug: 'promise-all-polyfill',
    description: `Implement the \`promiseAll\` function which mimics \`Promise.all\`.

The function takes an array of Promises and returns a single Promise that resolves when all input promises have resolved, or rejects immediately when any input promise rejects.

### Example:
\`\`\`javascript
const p1 = Promise.resolve(3);
const p2 = 42;
const p3 = new Promise((resolve) => setTimeout(resolve, 100, 'foo'));

promiseAll([p1, p2, p3]).then(values => console.log(values)); // [3, 42, 'foo']
\`\`\``,
    difficulty: 'HARD',
    category: 'JAVASCRIPT',
    tags: ['promises', 'async'],
    starterCode: `function promiseAll(promises) {
  // Write your polyfill here
}`,
    solutionCode: `function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Arguments must be an array'));
    }
    
    const results = [];
    let completed = 0;
    
    if (promises.length === 0) {
      return resolve([]);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((val) => {
          results[index] = val;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}`,
    order: 265,
    isPublished: true,
    testCases: [
      {
        input: '["promise-all-simple"]',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting other JavaScript topics seeding...');

  for (const problemData of otherJsProblems) {
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
  }

  console.log('🎉 Database seeding complete for other JavaScript topics!');
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
