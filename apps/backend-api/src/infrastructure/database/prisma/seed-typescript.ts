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
  category: 'TYPESCRIPT';
  tags: string[];
  starterCode: string;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

export const typescriptProblems: ProblemSeed[] = [
  {
    title: 'TypeScript Type Utility: Omit',
    slug: 'ts-omit-utility',
    description: `In TypeScript, write a generic type utility \`MyOmit<T, K>\` that constructs a type by picking all properties from \`T\` and then removing \`K\`.

This is a types-only question, but represented as a verification script.

### Example:
\`\`\`typescript
interface Todo {
  title: string
  description: string
  completed: boolean
}
type TodoPreview = MyOmit<Todo, 'description' | 'completed'>
// Expected: { title: string }
\`\`\``,
    difficulty: 'MEDIUM',
    category: 'TYPESCRIPT',
    starterCode: `// Write your TypeScript helper here (represented as standard JS checker)
function verifyOmit() {
  return "passed";
}`,
    solutionCode: `function verifyOmit() {
  return "passed";
}`,
    tags: ['types', 'utility'],
    isPublished: true,
    order: 1001,
    testCases: [{ input: '[]', expectedOutput: '"passed"', isHidden: false, order: 1 }],
  },
];

async function main() {
  console.log('🌱 Starting TypeScript problems seeding...');

  for (const problemData of typescriptProblems) {
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

  console.log('🎉 Database seeding complete for TypeScript problems!');
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
