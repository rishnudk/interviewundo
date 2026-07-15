export interface ShowcaseProblem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  example: { input: string; output: string };
  code: string;
  highlightedHtml?: string;
  result: {
    status: 'Accepted';
    runtime: string;
    memory: string;
  };
  breadcrumb: string;
}

export const SHOWCASE_PROBLEMS: ShowcaseProblem[] = [
  {
    title: 'Reverse String',
    difficulty: 'Easy',
    description: 'Given a string, return the string with all characters reversed.',
    example: {
      input: '"hello"',
      output: '"olleh"',
    },
    code: `function reverseString(str) {\n  return str.split("").reverse().join("");\n}`,
    result: {
      status: 'Accepted',
      runtime: '24 ms',
      memory: '7 MB',
    },
    breadcrumb: 'Problems → Strings → Reverse String',
  },
  {
    title: 'Two Sum',
    difficulty: 'Medium',
    description:
      'Given an array of integers and a target integer, return indices of the two numbers such that they add up to target.',
    example: {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
    },
    code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) {\n      return [map.get(diff), i];\n    }\n    map.set(nums[i], i);\n  }\n}`,
    result: {
      status: 'Accepted',
      runtime: '48 ms',
      memory: '8.2 MB',
    },
    breadcrumb: 'Problems → Arrays → Two Sum',
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'Medium',
    description:
      'Given a string containing just brackets, determine if the input string has valid and correctly closed parentheses.',
    example: {
      input: '"()[]{}"',
      output: 'true',
    },
    code: `function isValid(s) {\n  const stack = [];\n  const map = { '(': ')', '{': '}', '[': ']' };\n  for (const char of s) {\n    if (map[char]) stack.push(map[char]);\n    else if (stack.pop() !== char) return false;\n  }\n  return stack.length === 0;\n}`,
    result: {
      status: 'Accepted',
      runtime: '32 ms',
      memory: '7.5 MB',
    },
    breadcrumb: 'Problems → Stacks → Valid Parentheses',
  },
  {
    title: 'Palindrome Check',
    difficulty: 'Easy',
    description:
      'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    example: {
      input: '"A man, a plan, a canal: Panama"',
      output: 'true',
    },
    code: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left++] !== clean[right--]) return false;\n  }\n  return true;\n}`,
    result: {
      status: 'Accepted',
      runtime: '28 ms',
      memory: '7.1 MB',
    },
    breadcrumb: 'Problems → Two Pointers → Palindrome Check',
  },
];
