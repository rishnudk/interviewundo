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

export const stringProblems: ProblemSeed[] = [
  {
    title: 'Reverse String',
    slug: 'reverse-string-basic',
    description: `Given a string \`str\`, return the reversed string.

### Example 1:
**Input:** str = "hello"  
**Output:** "olleh"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function reverseString(str) {
  // Write your code here
}`,
    solutionCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    order: 301,
    isPublished: true,
    testCases: [
      { input: '["hello"]', expectedOutput: '"olleh"', isHidden: false, order: 1 },
      { input: '["world"]', expectedOutput: '"dlrow"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["a"]', expectedOutput: '"a"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse String Using While Loop',
    slug: 'reverse-string-while-loop',
    description: `Given a string \`str\`, reverse it using a \`while\` loop. Return the reversed string.

### Example 1:
**Input:** str = "hello"  
**Output:** "olleh"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings', 'loops'],
    starterCode: `function reverseStringWhile(str) {
  // Write your code here
}`,
    solutionCode: `function reverseStringWhile(str) {
  let reversed = "";
  let i = str.length - 1;
  while (i >= 0) {
    reversed += str[i];
    i--;
  }
  return reversed;
}`,
    order: 302,
    isPublished: true,
    testCases: [
      { input: '["hello"]', expectedOutput: '"olleh"', isHidden: false, order: 1 },
      { input: '["abc"]', expectedOutput: '"cba"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["z"]', expectedOutput: '"z"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse Words in a String',
    slug: 'reverse-words-in-string',
    description: `Given a string of words separated by spaces, reverse the characters of each individual word in-place while maintaining the original word order.

### Example 1:
**Input:** str = "hello world"  
**Output:** "olleh dlrow"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function reverseWordsInString(str) {
  // Write your code here
}`,
    solutionCode: `function reverseWordsInString(str) {
  return str.split(' ').map(w => w.split('').reverse().join('')).join(' ');
}`,
    order: 303,
    isPublished: true,
    testCases: [
      { input: '["hello world"]', expectedOutput: '"olleh dlrow"', isHidden: false, order: 1 },
      {
        input: '["JavaScript is fun"]',
        expectedOutput: '"tpircSavaJ si nuf"',
        isHidden: false,
        order: 2,
      },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["a"]', expectedOutput: '"a"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse Words in a Sentence',
    slug: 'reverse-words-in-sentence',
    description: `Given a sentence (words separated by single spaces), reverse the order of the words. The individual words themselves should not be reversed.

### Example 1:
**Input:** sentence = "the sky is blue"  
**Output:** "blue is sky the"  

### Constraints:
- 0 <= sentence.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function reverseSentence(sentence) {
  // Write your code here
}`,
    solutionCode: `function reverseSentence(sentence) {
  return sentence.trim().split(/\\s+/).reverse().join(' ');
}`,
    order: 304,
    isPublished: true,
    testCases: [
      {
        input: '["the sky is blue"]',
        expectedOutput: '"blue is sky the"',
        isHidden: false,
        order: 1,
      },
      { input: '["hello world"]', expectedOutput: '"world hello"', isHidden: false, order: 2 },
      { input: '["a"]', expectedOutput: '"a"', isHidden: true, order: 3 },
      { input: '["one two three"]', expectedOutput: '"three two one"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Remove Duplicates from String',
    slug: 'remove-duplicates-from-string',
    description: `Given a string \`str\`, return a new string with all duplicate characters removed, keeping only the first occurrence of each character.

### Example 1:
**Input:** str = "banana"  
**Output:** "ban"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function removeDuplicateChars(str) {
  // Write your code here
}`,
    solutionCode: `function removeDuplicateChars(str) {
  return [...new Set(str)].join('');
}`,
    order: 305,
    isPublished: true,
    testCases: [
      { input: '["banana"]', expectedOutput: '"ban"', isHidden: false, order: 1 },
      { input: '["hello"]', expectedOutput: '"helo"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["abcdef"]', expectedOutput: '"abcdef"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Frequency of Characters',
    slug: 'find-frequency-of-characters',
    description: `Given a string \`str\`, find the frequency of each character. Return an object where the keys are characters and the values are their counts.

### Example 1:
**Input:** str = "hello"  
**Output:** { "h": 1, "e": 1, "l": 2, "o": 1 }  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings', 'objects'],
    starterCode: `function charFrequency(str) {
  // Write your code here
}`,
    solutionCode: `function charFrequency(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  return freq;
}`,
    order: 306,
    isPublished: true,
    testCases: [
      {
        input: '["hello"]',
        expectedOutput: '{"h":1,"e":1,"l":2,"o":1}',
        isHidden: false,
        order: 1,
      },
      { input: '["aba"]', expectedOutput: '{"a":2,"b":1}', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '{}', isHidden: true, order: 3 },
      { input: '["a"]', expectedOutput: '{"a":1}', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Maximum Occurring Character',
    slug: 'find-maximum-occurring-character',
    description: `Given a string \`str\`, find and return the character that appears the most times. If there is a tie, return the one that appears first in the string. If the string is empty, return \`null\`.

### Example 1:
**Input:** str = "hello"  
**Output:** "l"  
**Explanation:** "l" appears 2 times, which is more than any other character.

### Example 2:
**Input:** str = "today"  
**Output:** "t"  
**Explanation:** All characters appear once. "t" is returned as it appears first.

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function maxOccurringChar(str) {
  // Write your code here
}`,
    solutionCode: `function maxOccurringChar(str) {
  if (str.length === 0) return null;
  const freq = {};
  let maxChar = str[0];
  let maxCount = 0;
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  for (const char of str) {
    if (freq[char] > maxCount) {
      maxCount = freq[char];
      maxChar = char;
    }
  }
  return maxChar;
}`,
    order: 307,
    isPublished: true,
    testCases: [
      { input: '["hello"]', expectedOutput: '"l"', isHidden: false, order: 1 },
      { input: '["today"]', expectedOutput: '"t"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '["testcase"]', expectedOutput: '"t"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find First Non-Repeated Character',
    slug: 'find-first-non-repeated-character',
    description: `Given a string \`str\`, find and return the first non-repeated character. If all characters are repeated or the string is empty, return \`null\`.

### Example 1:
**Input:** str = "swiss"  
**Output:** "w"  
**Explanation:** "w" is the first character that appears only once in the string.

### Example 2:
**Input:** str = "teeter"  
**Output:** "r"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function firstNonRepeated(str) {
  // Write your code here
}`,
    solutionCode: `function firstNonRepeated(str) {
  const freq = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  for (const char of str) {
    if (freq[char] === 1) return char;
  }
  return null;
}`,
    order: 308,
    isPublished: true,
    testCases: [
      { input: '["swiss"]', expectedOutput: '"w"', isHidden: false, order: 1 },
      { input: '["teeter"]', expectedOutput: '"r"', isHidden: false, order: 2 },
      { input: '["aabb"]', expectedOutput: 'null', isHidden: true, order: 3 },
      { input: '[""]', expectedOutput: 'null', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Count Occurrence of a Character',
    slug: 'count-occurrence-of-character',
    description: `Given a string \`str\` and a character \`char\`, return the number of times \`char\` appears in \`str\`.

### Example 1:
**Input:** str = "hello", char = "l"  
**Output:** 2  

### Constraints:
- 0 <= str.length <= 10^4
- char.length === 1`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function countChar(str, char) {
  // Write your code here
}`,
    solutionCode: `function countChar(str, char) {
  let count = 0;
  for (const c of str) {
    if (c === char) count++;
  }
  return count;
}`,
    order: 309,
    isPublished: true,
    testCases: [
      { input: '["hello", "l"]', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '["banana", "a"]', expectedOutput: '3', isHidden: false, order: 2 },
      { input: '["", "x"]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '["abc", "z"]', expectedOutput: '0', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Check Palindrome',
    slug: 'check-palindrome',
    description: `Given a string \`str\`, return \`true\` if the string is a palindrome, and \`false\` otherwise. A palindrome is a string that reads the same backward as forward, case-sensitive.

### Example 1:
**Input:** str = "racecar"  
**Output:** true  

### Example 2:
**Input:** str = "Racecar"  
**Output:** false  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function isPalindrome(str) {
  // Write your code here
}`,
    solutionCode: `function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}`,
    order: 310,
    isPublished: true,
    testCases: [
      { input: '["racecar"]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '["Racecar"]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: 'true', isHidden: true, order: 3 },
      { input: '["a"]', expectedOutput: 'true', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Check Anagram',
    slug: 'check-anagram',
    description: `Given two strings \`str1\` and \`str2\`, check if they are anagrams of each other. An anagram is a word formed by rearranging the letters of another, using all original letters exactly once. Case-sensitive.

### Example 1:
**Input:** str1 = "listen", str2 = "silent"  
**Output:** true  

### Example 2:
**Input:** str1 = "hello", str2 = "world"  
**Output:** false  

### Constraints:
- 0 <= str1.length, str2.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function isAnagram(str1, str2) {
  // Write your code here
}`,
    solutionCode: `function isAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;
  const sorted1 = str1.split('').sort().join('');
  const sorted2 = str2.split('').sort().join('');
  return sorted1 === sorted2;
}`,
    order: 311,
    isPublished: true,
    testCases: [
      { input: '["listen", "silent"]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '["hello", "world"]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '["triangle", "integral"]', expectedOutput: 'true', isHidden: true, order: 3 },
      { input: '["a", "b"]', expectedOutput: 'false', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Check Substring',
    slug: 'check-substring',
    description: `Given two strings \`str\` and \`sub\`, return \`true\` if \`sub\` is a substring of \`str\`, and \`false\` otherwise. Do not use built-in methods like \`.includes()\` or \`.indexOf()\`.

### Example 1:
**Input:** str = "hello world", sub = "world"  
**Output:** true  

### Example 2:
**Input:** str = "javascript", sub = "python"  
**Output:** false  

### Constraints:
- 0 <= str.length, sub.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function hasSubstring(str, sub) {
  // Write your code here
}`,
    solutionCode: `function hasSubstring(str, sub) {
  if (sub.length === 0) return true;
  if (sub.length > str.length) return false;
  for (let i = 0; i <= str.length - sub.length; i++) {
    let found = true;
    for (let j = 0; j < sub.length; j++) {
      if (str[i + j] !== sub[j]) {
        found = false;
        break;
      }
    }
    if (found) return true;
  }
  return false;
}`,
    order: 312,
    isPublished: true,
    testCases: [
      { input: '["hello world", "world"]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '["javascript", "python"]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '["abcdef", ""]', expectedOutput: 'true', isHidden: true, order: 3 },
      { input: '["a", "ab"]', expectedOutput: 'false', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Check if String Contains Only Digits',
    slug: 'check-string-only-digits',
    description: `Given a string \`str\`, return \`true\` if the string contains only digits (0-9), and \`false\` otherwise. An empty string should return \`false\`.

### Example 1:
**Input:** str = "12345"  
**Output:** true  

### Example 2:
**Input:** str = "123a45"  
**Output:** false  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function containsOnlyDigits(str) {
  // Write your code here
}`,
    solutionCode: `function containsOnlyDigits(str) {
  if (str.length === 0) return false;
  for (const char of str) {
    if (char < '0' || char > '9') return false;
  }
  return true;
}`,
    order: 313,
    isPublished: true,
    testCases: [
      { input: '["12345"]', expectedOutput: 'true', isHidden: false, order: 1 },
      { input: '["123a45"]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: 'false', isHidden: true, order: 3 },
      { input: '["0"]', expectedOutput: 'true', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Convert to lowercase without built-in methods',
    slug: 'convert-to-lowercase-without-builtins',
    description: `Given a string \`str\`, return a new string where all uppercase English letters are converted to lowercase, without using the built-in \`.toLowerCase()\` or \`.toLocaleLowerCase()\` methods.

### Example 1:
**Input:** str = "Hello WORLD"  
**Output:** "hello world"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function toLowerManual(str) {
  // Write your code here
}`,
    solutionCode: `function toLowerManual(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(code + 32);
    } else {
      result += str[i];
    }
  }
  return result;
}`,
    order: 314,
    isPublished: true,
    testCases: [
      { input: '["Hello WORLD"]', expectedOutput: '"hello world"', isHidden: false, order: 1 },
      { input: '["123!"]', expectedOutput: '"123!"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["aBcDeF"]', expectedOutput: '"abcdef"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Remove Spaces',
    slug: 'remove-spaces-from-string',
    description: `Given a string \`str\`, return a new string with all space characters removed.

### Example 1:
**Input:** str = "h e l l o"  
**Output:** "hello"  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function removeSpaces(str) {
  // Write your code here
}`,
    solutionCode: `function removeSpaces(str) {
  return str.replace(/\\s+/g, '');
}`,
    order: 315,
    isPublished: true,
    testCases: [
      { input: '["h e l l o"]', expectedOutput: '"hello"', isHidden: false, order: 1 },
      { input: '["  a  b  c  "]', expectedOutput: '"abc"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["no_spaces"]', expectedOutput: '"no_spaces"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Count Vowels',
    slug: 'count-vowels-in-string',
    description: `Given a string \`str\`, count and return the number of vowels (a, e, i, o, u, case-insensitive) in the string.

### Example 1:
**Input:** str = "hello"  
**Output:** 2  

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function countVowels(str) {
  // Write your code here
}`,
    solutionCode: `function countVowels(str) {
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}`,
    order: 316,
    isPublished: true,
    testCases: [
      { input: '["hello"]', expectedOutput: '2', isHidden: false, order: 1 },
      { input: '["xyz"]', expectedOutput: '0', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '0', isHidden: true, order: 3 },
      { input: '["AEIOU"]', expectedOutput: '5', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Find Longest Word',
    slug: 'find-longest-word',
    description: `Given a string representing a sentence, find and return the longest word. If there are multiple words of the same maximum length, return the first one. Words are separated by single spaces. Ignore punctuation if any are attached to words.

### Example 1:
**Input:** str = "The quick brown fox jumps over the lazy dog"  
**Output:** "quick"  
**Explanation:** Both "quick" and "brown" have length 5. The first one, "quick", is returned.

### Constraints:
- 0 <= str.length <= 10^4`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function findLongestWord(str) {
  // Write your code here
}`,
    solutionCode: `function findLongestWord(str) {
  const words = str.split(' ');
  let longest = "";
  for (const word of words) {
    if (word.length > longest.length) {
      longest = word;
    }
  }
  return longest;
}`,
    order: 317,
    isPublished: true,
    testCases: [
      {
        input: '["The quick brown fox jumps over the lazy dog"]',
        expectedOutput: '"quick"',
        isHidden: false,
        order: 1,
      },
      { input: '["hello"]', expectedOutput: '"hello"', isHidden: false, order: 2 },
      { input: '[""]', expectedOutput: '""', isHidden: true, order: 3 },
      { input: '["a b cd ef"]', expectedOutput: '"cd"', isHidden: true, order: 4 },
    ],
  },
  {
    title: 'Reverse a String',
    slug: 'reverse-a-string',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.

### Example 1:
**Input:** s = ["h","e","l","l","o"]  
**Output:** ["o","l","l","e","h"]`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings', 'two-pointers'],
    starterCode: `function reverseString(s) {
  // Write your code here
  return s;
}`,
    solutionCode: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    const temp = s[left];
    s[left] = s[right];
    s[right] = temp;
    left++;
    right--;
  }
  return s;
}`,
    order: 320,
    isPublished: true,
    testCases: [
      {
        input: '[["h","e","l","l","o"]]',
        expectedOutput: '["o","l","l","e","h"]',
        isHidden: false,
        order: 1,
      },
      {
        input: '[["H","a","n","n","a","h"]]',
        expectedOutput: '["h","a","n","n","a","H"]',
        isHidden: false,
        order: 2,
      },
      { input: '[["a"]]', expectedOutput: '["a"]', isHidden: true, order: 3 },
      {
        input: '[["t","e","s","t"]]',
        expectedOutput: '["t","s","e","t"]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Palindrome Checker',
    slug: 'palindrome-checker',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` *if it is a palindrome, or \`false\` otherwise*.

### Example 1:
**Input:** s = "A man, a plan, a canal: Panama"  
**Output:** true  
**Explanation:** "amanaplanacanalpanama" is a palindrome.`,
    difficulty: 'EASY',
    category: 'JAVASCRIPT',
    tags: ['strings'],
    starterCode: `function isPalindrome(s) {
  // Write your code here
}`,
    solutionCode: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}`,
    order: 321,
    isPublished: true,
    testCases: [
      {
        input: '["A man, a plan, a canal: Panama"]',
        expectedOutput: 'true',
        isHidden: false,
        order: 1,
      },
      { input: '["race a car"]', expectedOutput: 'false', isHidden: false, order: 2 },
      { input: '[" "]', expectedOutput: 'true', isHidden: true, order: 3 },
      { input: '["0P"]', expectedOutput: 'false', isHidden: true, order: 4 },
    ],
  },
];

async function main() {
  console.log('🌱 Starting string problems seeding...');

  for (const problemData of stringProblems) {
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

  console.log('🎉 Database seeding complete for string problems!');
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
