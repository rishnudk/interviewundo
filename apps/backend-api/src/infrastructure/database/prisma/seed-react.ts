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
  category: 'REACT';
  tags: string[];
  starterCode: string;
  starterFiles?: Record<string, string>;
  solutionCode: string;
  order: number;
  isPublished: boolean;
  testCases: TestCaseSeed[];
}

export const reactProblems: ProblemSeed[] = [
  {
    title: 'Counter App',
    slug: 'counter-app',
    description: `Build a Counter component with increment and decrement buttons.
      
The component should render:
1. A display showing the current count (with \`data-testid="count-display"\`, defaults to 0).
2. An increment button (with \`data-testid="increment-btn"\`).
3. A decrement button (with \`data-testid="decrement-btn"\`).

Clicking the increment button should increase the count by 1.
Clicking the decrement button should decrease the count by 1.`,
    difficulty: 'EASY',
    category: 'REACT',
    starterCode: `function Counter() {
  // Use React.useState to track the count
  // Render count display and increment/decrement buttons
}`,
    starterFiles: {
      'styles.css': `.counter-container { text-align: center; margin: 20px; }
.btn { padding: 8px 16px; margin: 5px; cursor: pointer; }`,
      'Counter.js': `function Counter() {
  // Write your code here
  return (
    <div className="counter-container">
      <h2 data-testid="count-display">0</h2>
      <button data-testid="decrement-btn" className="btn">-</button>
      <button data-testid="increment-btn" className="btn">+</button>
    </div>
  );
}`,
      'App.js': `function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>React Counter</h1>
      <Counter />
    </div>
  );
}`,
    },
    solutionCode: `function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="counter-container">
      <h2 data-testid="count-display">{count}</h2>
      <button data-testid="decrement-btn" className="btn" onClick={() => setCount(count - 1)}>-</button>
      <button data-testid="increment-btn" className="btn" onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}`,
    tags: ['react', 'state', 'events'],
    isPublished: true,
    order: 901,
    testCases: [
      {
        input:
          '{"steps":[{"action":"click","testId":"increment-btn"},{"action":"click","testId":"increment-btn"},{"action":"click","testId":"increment-btn"}],"assertions":[{"testId":"count-display","text":"3"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '{"steps":[{"action":"click","testId":"decrement-btn"},{"action":"click","testId":"decrement-btn"}],"assertions":[{"testId":"count-display","text":"-2"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 2,
      },
      {
        input:
          '{"steps":[{"action":"click","testId":"increment-btn"},{"action":"click","testId":"increment-btn"},{"action":"click","testId":"decrement-btn"}],"assertions":[{"testId":"count-display","text":"1"}]}',
        expectedOutput: '"passed"',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Toggle Button',
    slug: 'toggle-button',
    description: `Build a button that toggles its label between "ON" and "OFF" when clicked.
      
The component should render:
1. A button (with \`data-testid="toggle-btn"\`, default label is "OFF").
Clicking the button toggles the text state.`,
    difficulty: 'EASY',
    category: 'REACT',
    starterCode: `function Toggle() {
  // Use React.useState to track the state
  // Render toggle button
}`,
    starterFiles: {
      'styles.css': `.toggle-btn { padding: 10px 20px; font-weight: bold; }`,
      'Toggle.js': `function Toggle() {
  // Write your code here
  return (
    <button data-testid="toggle-btn" className="toggle-btn">
      OFF
    </button>
  );
}`,
      'App.js': `function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Toggle />
    </div>
  );
}`,
    },
    solutionCode: `function Toggle() {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <button
      data-testid="toggle-btn"
      className="toggle-btn"
      onClick={() => setIsOn(!isOn)}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}`,
    tags: ['react', 'state'],
    isPublished: true,
    order: 902,
    testCases: [
      {
        input: '{"steps":[],"assertions":[{"testId":"toggle-btn","text":"OFF"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '{"steps":[{"action":"click","testId":"toggle-btn"}],"assertions":[{"testId":"toggle-btn","text":"ON"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 2,
      },
      {
        input:
          '{"steps":[{"action":"click","testId":"toggle-btn"},{"action":"click","testId":"toggle-btn"}],"assertions":[{"testId":"toggle-btn","text":"OFF"}]}',
        expectedOutput: '"passed"',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Show/Hide Password',
    slug: 'show-hide-password',
    description: `Create a PasswordToggle component containing a password input field and a visibility toggle button.
      
The component should render:
1. An input field (with \`data-testid="password-input"\`, default attribute \`type="password"\`, default value \`my-secret-pwd\`).
2. A button (with \`data-testid="toggle-visibility"\`).

Clicking the button switches the input type between "password" and "text" to show or hide the password.`,
    difficulty: 'EASY',
    category: 'REACT',
    starterCode: `function PasswordToggle() {
  // Use React.useState to track password visibility
  // Render input and toggle visibility button
}`,
    starterFiles: {
      'styles.css': `.pwd-container { display: flex; gap: 8px; justify-content: center; margin-top: 20px; }`,
      'PasswordToggle.js': `function PasswordToggle() {
  // Write your code here
  return (
    <div className="pwd-container">
      <input data-testid="password-input" type="password" defaultValue="my-secret-pwd" />
      <button data-testid="toggle-visibility">Show</button>
    </div>
  );
}`,
      'App.js': `function App() {
  return (
    <div>
      <PasswordToggle />
    </div>
  );
}`,
    },
    solutionCode: `function PasswordToggle() {
  const [show, setShow] = React.useState(false);
  return (
    <div className="pwd-container">
      <input data-testid="password-input" type={show ? 'text' : 'password'} defaultValue="my-secret-pwd" />
      <button data-testid="toggle-visibility" onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}`,
    tags: ['react', 'state', 'forms'],
    isPublished: true,
    order: 903,
    testCases: [
      {
        input:
          '{"steps":[],"assertions":[{"testId":"password-input","attribute":"type","value":"password"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '{"steps":[{"action":"click","testId":"toggle-visibility"}],"assertions":[{"testId":"password-input","attribute":"type","value":"text"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 2,
      },
      {
        input:
          '{"steps":[{"action":"click","testId":"toggle-visibility"},{"action":"click","testId":"toggle-visibility"}],"assertions":[{"testId":"password-input","attribute":"type","value":"password"}]}',
        expectedOutput: '"passed"',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Todo App',
    slug: 'todo-app',
    description: `Build a simple Todo App component. Users should be able to type a todo item into an input and click "Add" to add it to a list.
      
The component should render:
1. An input field (with \`data-testid="todo-input"\`).
2. An add button (with \`data-testid="add-btn"\`).
3. Todo list items (each item list element with \`data-testid="todo-item-N"\` where N is the 0-indexed position in the list).
4. Each item should have a delete button (with \`data-testid="delete-btn-N"\`).

Clicking "Delete" removes that specific item from the list.`,
    difficulty: 'MEDIUM',
    category: 'REACT',
    starterCode: `function TodoApp() {
  // Use React.useState to track todos list and input field value
  // Render input, add button, and list with delete buttons
}`,
    starterFiles: {
      'styles.css': `.todo-app { font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
.todo-input { width: 70%; padding: 8px; }
.todo-btn { padding: 8px 12px; margin-left: 5px; }`,
      'TodoApp.js': `function TodoApp() {
  // Write your code here
  return (
    <div className="todo-app">
      <input data-testid="todo-input" className="todo-input" placeholder="Enter todo..." />
      <button data-testid="add-btn" className="todo-btn">Add</button>
      <ul style={{ marginTop: '15px' }}>
        {/* Render list items here */}
      </ul>
    </div>
  );
}`,
      'App.js': `function App() {
  return (
    <div>
      <TodoApp />
    </div>
  );
}`,
    },
    solutionCode: `function TodoApp() {
  const [todos, setTodos] = React.useState([]);
  const [input, setInput] = React.useState('');

  const handleAdd = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input }]);
    setInput('');
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="todo-app">
      <input
        data-testid="todo-input"
        className="todo-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter todo..."
      />
      <button data-testid="add-btn" className="todo-btn" onClick={handleAdd}>Add</button>
      <ul style={{ marginTop: '15px' }}>
        {todos.map((todo, idx) => (
          <li key={todo.id} data-testid={\`todo-item-\${idx}\`} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
            <span>{todo.text}</span>
            <button
              data-testid={\`delete-btn-\${idx}\`}
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    tags: ['react', 'state', 'lists'],
    isPublished: true,
    order: 904,
    testCases: [
      {
        input:
          '{"steps":[{"action":"type","testId":"todo-input","text":"Buy Milk"},{"action":"click","testId":"add-btn"}],"assertions":[{"testId":"todo-item-0","text":"Buy MilkDelete"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '{"steps":[{"action":"type","testId":"todo-input","text":"Buy Milk"},{"action":"click","testId":"add-btn"},{"action":"type","testId":"todo-input","text":"Walk Dog"},{"action":"click","testId":"add-btn"},{"action":"click","testId":"delete-btn-0"}],"assertions":[{"testId":"todo-item-0","text":"Walk DogDelete"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 2,
      },
    ],
  },
  {
    title: 'Fetch API Data',
    slug: 'fetch-api-data',
    description: `Build a FetchUsers component that fetches a list of users from \`https://jsonplaceholder.typicode.com/users\` on mount.
      
The component should render:
1. While fetching, display "Loading..." (with \`data-testid="loading"\`).
2. If successful, display the list of user names (list container with \`data-testid="user-list"\`, individual user list items with \`data-testid="user-item-N"\` where N is the 0-indexed position).
3. If the fetch fails, display the error message (with \`data-testid="error-message"\`).`,
    difficulty: 'MEDIUM',
    category: 'REACT',
    starterCode: `function FetchUsers() {
  // Use React.useEffect to fetch users on mount
  // Handle loading, error, and users data states
}`,
    starterFiles: {
      'styles.css': `.user-list { list-style: none; padding: 10px; }
.loading { font-style: italic; color: #888; }`,
      'FetchUsers.js': `function FetchUsers() {
  // Write your code here
  return (
    <div data-testid="loading" className="loading">Loading...</div>
  );
}`,
      'App.js': `function App() {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Users Directory</h2>
      <FetchUsers />
    </div>
  );
}`,
    },
    solutionCode: `function FetchUsers() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch users');
        setLoading(false);
      });
  }, []);

  if (loading) return <div data-testid="loading" className="loading">Loading...</div>;
  if (error) return <div data-testid="error-message" style={{ color: 'red' }}>{error}</div>;

  return (
    <ul data-testid="user-list" className="user-list">
      {users.map((user, idx) => (
        <li key={idx} data-testid={\`user-item-\${idx}\`} style={{ padding: '4px 0' }}>{user.name}</li>
      ))}
    </ul>
  );
}`,
    tags: ['react', 'effects', 'fetch'],
    isPublished: true,
    order: 905,
    testCases: [
      {
        input:
          '{"steps":[],"mockUsers":[{"name":"Alice"},{"name":"Bob"}],"assertions":[{"testId":"user-item-0","text":"Alice"},{"testId":"user-item-1","text":"Bob"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 1,
      },
      {
        input:
          '{"steps":[],"mockError":"Failed to fetch users","assertions":[{"testId":"error-message","text":"Failed to fetch users"}]}',
        expectedOutput: '"passed"',
        isHidden: false,
        order: 2,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting React problems seeding...');

  for (const problemData of reactProblems) {
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
        starterFiles: problemData.starterFiles as any,
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
        starterFiles: problemData.starterFiles as any,
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

  console.log('🎉 Database seeding complete for React problems!');
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
