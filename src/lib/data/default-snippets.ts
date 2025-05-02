import { CodeSnippet } from "../types/code-snippets";

export const additionalCodeSnippets: Partial<CodeSnippet>[] = [
  // JavaScript Snippets
  {
    title: "Array Map Function",
    description: "Example of using Array.map() to transform data",
    content: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]`,
    language: "javascript",
    difficulty: "beginner",
    likes: 0,
    times_completed: 0,
  },
  {
    title: "Promise Chain",
    description: "Example of Promise chaining in JavaScript",
    content: `fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`,
    language: "javascript",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },
  {
    title: "Async/Await Example",
    description: "Modern async/await syntax for handling promises",
    content: `async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}`,
    language: "javascript",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // Python Snippets
  {
    title: "List Comprehension",
    description: "Python list comprehension example",
    content: `numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares)  # [4, 16]`,
    language: "python",
    difficulty: "beginner",
    likes: 0,
    times_completed: 0,
  },
  {
    title: "Decorator Pattern",
    description: "Example of Python decorator pattern",
    content: `def timer_decorator(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper

@timer_decorator
def slow_function():
    import time
    time.sleep(1)
    return "Done!"`,
    language: "python",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // TypeScript Snippets
  {
    title: "Generic Function",
    description: "TypeScript generic function example",
    content: `function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numbers = firstElement([1, 2, 3]); // type: number
const strings = firstElement(['a', 'b', 'c']); // type: string`,
    language: "typescript",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },
  {
    title: "Utility Types",
    description: "Common TypeScript utility types",
    content: `interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

type UserPartial = Partial<User>; // All properties optional
type UserRequired = Required<User>; // All properties required
type UserReadonly = Readonly<User>; // All properties readonly
type UserPick = Pick<User, 'id' | 'name'>; // Only id and name`,
    language: "typescript",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // Java Snippets
  {
    title: "Stream API",
    description: "Java Stream API example",
    content: `List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
int sum = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * 2)
    .reduce(0, Integer::sum);
System.out.println(sum); // 24`,
    language: "java",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // Rust Snippets
  {
    title: "Ownership Basics",
    description: "Basic Rust ownership example",
    content: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2
    
    // println!("{}", s1); // This would cause an error
    println!("{}", s2); // This works fine
}`,
    language: "rust",
    difficulty: "beginner",
    likes: 0,
    times_completed: 0,
  },

  // Go Snippets
  {
    title: "Goroutine Example",
    description: "Basic Go concurrency with goroutines",
    content: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")
    say("hello")
}`,
    language: "go",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // SQL Snippets
  {
    title: "Complex JOIN Query",
    description: "SQL query with multiple JOINs",
    content: `SELECT 
    c.customer_name,
    o.order_date,
    p.product_name,
    oi.quantity,
    oi.unit_price
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2023-01-01'
ORDER BY o.order_date DESC;`,
    language: "sql",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  }
];

// Additional code snippets for more languages
export const moreCodeSnippets: Partial<CodeSnippet>[] = [
  // Kotlin Snippets
  {
    title: "Kotlin Data Class",
    description: "Example of a Kotlin data class with properties",
    content: `data class User(
    val id: String,
    val name: String,
    val email: String,
    var age: Int? = null
)

fun main() {
    val user = User("1", "John Doe", "john@example.com")
    println(user.copy(name = "Jane Doe"))
}`,
    language: "kotlin",
    difficulty: "beginner",
    likes: 0,
    times_completed: 0,
  },
  {
    title: "Kotlin Coroutines",
    description: "Basic example of Kotlin coroutines",
    content: `import kotlinx.coroutines.*

suspend fun fetchUserData(): User {
    delay(1000) // Simulate network delay
    return User("1", "John", "john@example.com")
}

fun main() = runBlocking {
    val user = async { fetchUserData() }
    println("Fetching user...")
    println(user.await())
}`,
    language: "kotlin",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // Swift Snippets
  {
    title: "Swift Struct",
    description: "Example of a Swift struct with properties and methods",
    content: `struct Temperature {
    var celsius: Double
    
    var fahrenheit: Double {
        get {
            return celsius * 9/5 + 32
        }
        set {
            celsius = (newValue - 32) * 5/9
        }
    }
    
    mutating func increase(by amount: Double) {
        celsius += amount
    }
}

var temp = Temperature(celsius: 25)
print(temp.fahrenheit) // 77.0`,
    language: "swift",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // Scala Snippets
  {
    title: "Scala Case Class",
    description: "Example of Scala case class and pattern matching",
    content: `sealed trait Shape
case class Circle(radius: Double) extends Shape
case class Rectangle(width: Double, height: Double) extends Shape

def area(shape: Shape): Double = shape match {
  case Circle(r) => Math.PI * r * r
  case Rectangle(w, h) => w * h
}

val circle = Circle(5)
println(area(circle)) // 78.53981633974483`,
    language: "scala",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // R Snippets
  {
    title: "R Data Analysis",
    description: "Basic data analysis in R",
    content: `# Create a data frame
data <- data.frame(
  name = c("John", "Jane", "Bob", "Alice"),
  age = c(25, 30, 35, 28),
  salary = c(50000, 60000, 75000, 65000)
)

# Calculate summary statistics
summary(data)

# Create a simple plot
plot(data$age, data$salary,
     main = "Age vs Salary",
     xlab = "Age",
     ylab = "Salary")`,
    language: "r",
    difficulty: "beginner",
    likes: 0,
    times_completed: 0,
  },

  // MATLAB Snippets
  {
    title: "MATLAB Matrix Operations",
    description: "Basic matrix operations in MATLAB",
    content: `% Create matrices
A = [1 2 3; 4 5 6; 7 8 9];
B = [9 8 7; 6 5 4; 3 2 1];

% Matrix operations
C = A * B;  % Matrix multiplication
D = A .* B; % Element-wise multiplication

% Calculate eigenvalues and eigenvectors
[V, D] = eig(A);

% Plot surface
[X, Y] = meshgrid(-2:0.2:2);
Z = X .* exp(-X.^2 - Y.^2);
surf(X, Y, Z);`,
    language: "matlab",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // SQL Snippets
  {
    title: "SQL Complex Query",
    description: "Complex SQL query with joins and aggregations",
    content: `WITH monthly_sales AS (
  SELECT 
    DATE_TRUNC('month', order_date) as month,
    product_id,
    SUM(quantity) as total_quantity,
    SUM(quantity * unit_price) as revenue
  FROM orders o
  JOIN order_items oi ON o.order_id = oi.order_id
  GROUP BY 1, 2
)
SELECT 
  p.product_name,
  ms.month,
  ms.total_quantity,
  ms.revenue,
  RANK() OVER (PARTITION BY ms.month ORDER BY ms.revenue DESC) as rank
FROM monthly_sales ms
JOIN products p ON ms.product_id = p.product_id
WHERE ms.month >= CURRENT_DATE - INTERVAL '12 months'
ORDER BY ms.month DESC, ms.revenue DESC;`,
    language: "sql",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // Perl Snippets
  {
    title: "Perl Text Processing",
    description: "Text processing example in Perl",
    content: `#!/usr/bin/perl
use strict;
use warnings;

my $filename = 'input.txt';
my %word_count;

open(my $fh, '<', $filename) or die "Cannot open file: $!";
while (my $line = <$fh>) {
    chomp $line;
    my @words = split /\s+/, lc($line);
    $word_count{$_}++ for @words;
}
close $fh;

# Print word frequencies
foreach my $word (sort { $word_count{$b} <=> $word_count{$a} } keys %word_count) {
    printf "%-20s %d\n", $word, $word_count{$word};
}`,
    language: "perl",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // Haskell Snippets
  {
    title: "Haskell Recursion",
    description: "Recursive functions in Haskell",
    content: `-- Fibonacci sequence using recursion
fib :: Integer -> Integer
fib 0 = 0
fib 1 = 1
fib n = fib (n-1) + fib (n-2)

-- Quick sort implementation
quicksort :: Ord a => [a] -> [a]
quicksort [] = []
quicksort (x:xs) = 
    let smaller = quicksort [a | a <- xs, a <= x]
        bigger  = quicksort [a | a <- xs, a > x]
    in smaller ++ [x] ++ bigger

main :: IO ()
main = do
    print $ map fib [0..10]
    print $ quicksort [64, 34, 25, 12, 22, 11, 90]`,
    language: "haskell",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  }
];

// Even more code snippets
export const evenMoreSnippets: Partial<CodeSnippet>[] = [
  // C++ Snippets
  {
    title: "C++ Templates",
    description: "Generic programming with C++ templates",
    content: `template<typename T>
class Stack {
private:
    vector<T> elements;
    
public:
    void push(T const& element) {
        elements.push_back(element);
    }
    
    T pop() {
        if (elements.empty()) {
            throw runtime_error("Stack is empty");
        }
        T top = elements.back();
        elements.pop_back();
        return top;
    }
    
    bool empty() const {
        return elements.empty();
    }
};`,
    language: "cpp",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // C# Snippets
  {
    title: "C# LINQ Query",
    description: "LINQ query operations in C#",
    content: `var products = new List<Product>();
var categories = new List<Category>();

var query = from p in products
            join c in categories
            on p.CategoryId equals c.Id
            where p.Price > 100
            orderby p.Name
            select new {
                ProductName = p.Name,
                CategoryName = c.Name,
                p.Price
            };

foreach (var item in query) {
    Console.WriteLine($"\\{item.ProductName} (\\{item.CategoryName}): $\\{item.Price}");
}`,
    language: "csharp",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // PHP Snippets
  {
    title: "PHP API Endpoint",
    description: "RESTful API endpoint in PHP",
    content: `<?php
header('Content-Type: application/json');

class APIResponse {
    public $success;
    public $data;
    public $error;

    public function __construct($success, $data = null, $error = null) {
        $this->success = $success;
        $this->data = $data;
        $this->error = $error;
    }
}

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=myapp",
        "username",
        "password"
    );
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE active = 1");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(new APIResponse(true, $users));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(new APIResponse(false, null, $e->getMessage()));
}`,
    language: "php",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // Ruby Snippets
  {
    title: "Ruby Metaprogramming",
    description: "Dynamic method creation in Ruby",
    content: `class Product
  def initialize(name, price)
    @name = name
    @price = price
  end
  
  # Define getter methods dynamically
  [:name, :price].each do |attr|
    define_method(attr) do
      instance_variable_get("@#{attr}")
    end
  end
  
  # Define setter methods dynamically
  [:name, :price].each do |attr|
    define_method("#{attr}=") do |value|
      instance_variable_set("@#{attr}", value)
    end
  end
  
  def self.create_discount_method(name, discount_percent)
    define_method("#{name}_price") do
      @price * (1 - discount_percent / 100.0)
    end
  end
end

# Create discount methods
Product.create_discount_method(:sale, 20)
Product.create_discount_method(:clearance, 50)

product = Product.new("Laptop", 1000)
puts product.sale_price      # 800.0
puts product.clearance_price # 500.0`,
    language: "ruby",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // Go Advanced
  {
    title: "Go Channels and Workers",
    description: "Concurrent worker pool implementation in Go",
    content: `package main

import (
    "fmt"
    "sync"
)

type Job struct {
    id     int
    result int
}

func worker(id int, jobs <-chan Job, results chan<- Job, wg *sync.WaitGroup) {
    defer wg.Done()
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\\n", id, job.id)
        // Simulate work
        job.result = job.id * 2
        results <- job
    }
}

func main() {
    numJobs := 10
    numWorkers := 3
    
    jobs := make(chan Job, numJobs)
    results := make(chan Job, numJobs)
    
    // Start workers
    var wg sync.WaitGroup
    for w := 1; w <= numWorkers; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }
    
    // Send jobs
    for j := 1; j <= numJobs; j++ {
        jobs <- Job{id: j}
    }
    close(jobs)
    
    // Wait for workers to finish
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Collect results
    for result := range results {
        fmt.Printf("Job %d result: %d\\n", result.id, result.result)
    }
}`,
    language: "go",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // Rust Advanced
  {
    title: "Rust Smart Pointers",
    description: "Advanced Rust smart pointer examples",
    content: `use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    value: i32,
    next: Option<Rc<RefCell<Node>>>,
}

impl Node {
    fn new(value: i32) -> Self {
        Node {
            value,
            next: None,
        }
    }
}

fn main() {
    // Create nodes with reference counting
    let node1 = Rc::new(RefCell::new(Node::new(1)));
    let node2 = Rc::new(RefCell::new(Node::new(2)));
    let node3 = Rc::new(RefCell::new(Node::new(3)));
    
    // Create circular references
    node1.borrow_mut().next = Some(Rc::clone(&node2));
    node2.borrow_mut().next = Some(Rc::clone(&node3));
    node3.borrow_mut().next = Some(Rc::clone(&node1));
    
    // Print reference counts
    println!("Reference counts:");
    println!("Node1: {}", Rc::strong_count(&node1));
    println!("Node2: {}", Rc::strong_count(&node2));
    println!("Node3: {}", Rc::strong_count(&node3));
}`,
    language: "rust",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  }
];

// Modern web and data science snippets
export const modernSnippets: Partial<CodeSnippet>[] = [
  // TypeScript React Hooks
  {
    title: "React Custom Hook",
    description: "Custom React hook for handling API requests",
    content: `import { useState, useEffect } from 'react';

interface UseApiOptions<T> {
  url: string;
  initialData?: T;
}

function useApi<T>({ url, initialData }: UseApiOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const result = await response.json();
        if (mounted) {
          setData(result);
          setError(null);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}`,
    language: "typescript",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // Python Data Science
  {
    title: "Pandas Data Analysis",
    description: "Data analysis with Pandas and visualization",
    content: `import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Load and prepare data
df = pd.read_csv('sales_data.csv')
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

# Basic statistics
print("Summary Statistics:")
print(df.describe())

# Time series analysis
monthly_sales = df.resample('M')['sales'].sum()

# Visualization
plt.figure(figsize=(12, 6))
sns.lineplot(data=monthly_sales)
plt.title('Monthly Sales Trend')
plt.xlabel('Date')
plt.ylabel('Sales')

# Prepare features for prediction
X = df[['advertising', 'price']]
y = df['sales']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Print results
print("\nModel Coefficients:")
for feature, coef in zip(X.columns, model.coef_):
    print(f"{feature}: {coef:.2f}")`,
    language: "python",
    difficulty: "intermediate",
    likes: 0,
    times_completed: 0,
  },

  // JavaScript Modern Features
  {
    title: "Modern JavaScript Features",
    description: "ES2022+ features and patterns",
    content: `// Top-level await
const response = await fetch('https://api.example.com/data');
const data = await response.json();

// Private class fields and methods
class BankAccount {
  #balance = 0;
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  #validateTransaction(amount) {
    return this.#balance >= amount;
  }
  
  async withdraw(amount) {
    try {
      if (!this.#validateTransaction(amount)) {
        throw new Error('Insufficient funds');
      }
      
      this.#balance -= amount;
      return {
        success: true,
        newBalance: this.#balance
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Optional chaining and nullish coalescing
const user = {
  profile: {
    settings: {
      theme: 'dark'
    }
  }
};

const theme = user?.profile?.settings?.theme ?? 'light';

// Pattern matching (proposal)
const result = await fetch('/api/data');
const data = await result.json();

const message = match (data) {
  when { type: 'success', payload } -> \`Success: \${payload}\`,
  when { type: 'error', error } -> \`Error: \${error}\`,
  when _ -> 'Unknown response'
};`,
    language: "javascript",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  },

  // SQL Analytics
  {
    title: "SQL Analytics Queries",
    description: "Advanced SQL analytics with window functions",
    content: `WITH customer_metrics AS (
  SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value,
    MAX(o.order_date) as last_order_date,
    FIRST_VALUE(o.total_amount) OVER (
      PARTITION BY c.customer_id 
      ORDER BY o.order_date
    ) as first_order_amount,
    LAST_VALUE(o.total_amount) OVER (
      PARTITION BY c.customer_id 
      ORDER BY o.order_date
      RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as last_order_amount,
    DENSE_RANK() OVER (
      ORDER BY SUM(o.total_amount) DESC
    ) as spending_rank
  FROM customers c
  LEFT JOIN orders o ON c.customer_id = o.customer_id
  GROUP BY c.customer_id, c.customer_name
)
SELECT 
  *,
  CASE 
    WHEN total_spent > 10000 THEN 'VIP'
    WHEN total_spent > 5000 THEN 'Premium'
    ELSE 'Regular'
  END as customer_tier,
  100.0 * (last_order_amount - first_order_amount) / 
    NULLIF(first_order_amount, 0) as order_value_growth
FROM customer_metrics
WHERE total_orders > 0
ORDER BY spending_rank;`,
    language: "sql",
    difficulty: "advanced",
    likes: 0,
    times_completed: 0,
  }
];

// Combine all snippets
export const allCodeSnippets = [...additionalCodeSnippets, ...moreCodeSnippets, ...evenMoreSnippets, ...modernSnippets]; 