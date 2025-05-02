-- 1. First update the language constraint
ALTER TABLE code_snippets
DROP CONSTRAINT IF EXISTS valid_language;

ALTER TABLE code_snippets
ADD CONSTRAINT valid_language CHECK (
  language IN (
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'csharp',
    'go',
    'rust',
    'php',
    'ruby',
    'kotlin',
    'swift',
    'scala',
    'r',
    'matlab',
    'sql',
    'perl',
    'haskell'
  )
);

-- 2. Clear existing snippets (uncomment if you want to start fresh)
-- DELETE FROM code_snippets;

-- 3. Insert all code snippets
INSERT INTO code_snippets (
    id,
    title,
    description,
    content,
    language,
    difficulty,
    created_at,
    likes,
    times_completed
) VALUES
-- JavaScript Snippets
(
    gen_random_uuid(),
    'Array Map Function',
    'Example of using Array.map() to transform data',
    'const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]',
    'javascript',
    'beginner',
    NOW(),
    0,
    0
),
(
    gen_random_uuid(),
    'Promise Chain',
    'Example of Promise chaining in JavaScript',
    'fetch(''https://api.example.com/data'')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(''Error:'', error));',
    'javascript',
    'intermediate',
    NOW(),
    0,
    0
),

-- Python Snippets
(
    gen_random_uuid(),
    'List Comprehension',
    'Python list comprehension example',
    'numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 == 0]
print(squares)  # [4, 16]',
    'python',
    'beginner',
    NOW(),
    0,
    0
),
(
    gen_random_uuid(),
    'Decorator Pattern',
    'Example of Python decorator pattern',
    'def timer_decorator(func):
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
    return "Done!"',
    'python',
    'advanced',
    NOW(),
    0,
    0
),

-- TypeScript Snippets
(
    gen_random_uuid(),
    'React Custom Hook',
    'Custom React hook for handling API requests',
    'import { useState, useEffect } from ''react'';

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
          throw new Error(`HTTP error! status: ${response.status}`);
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
}',
    'typescript',
    'advanced',
    NOW(),
    0,
    0
),

-- Rust Snippets
(
    gen_random_uuid(),
    'Ownership Basics',
    'Basic Rust ownership example',
    'fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved to s2
    
    // println!("{}", s1); // This would cause an error
    println!("{}", s2); // This works fine
}',
    'rust',
    'beginner',
    NOW(),
    0,
    0
),

-- Go Snippets
(
    gen_random_uuid(),
    'Goroutine Example',
    'Basic Go concurrency with goroutines',
    'package main

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
}',
    'go',
    'intermediate',
    NOW(),
    0,
    0
),

-- C++ Snippets
(
    gen_random_uuid(),
    'C++ Templates',
    'Generic programming with C++ templates',
    'template<typename T>
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
};',
    'cpp',
    'advanced',
    NOW(),
    0,
    0
),

-- Ruby Snippets
(
    gen_random_uuid(),
    'Ruby Metaprogramming',
    'Dynamic method creation in Ruby',
    'class Product
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
puts product.clearance_price # 500.0',
    'ruby',
    'advanced',
    NOW(),
    0,
    0
),

-- SQL Analytics
(
    gen_random_uuid(),
    'SQL Analytics Queries',
    'Advanced SQL analytics with window functions',
    'WITH customer_metrics AS (
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
    WHEN total_spent > 10000 THEN ''VIP''
    WHEN total_spent > 5000 THEN ''Premium''
    ELSE ''Regular''
  END as customer_tier,
  100.0 * (last_order_amount - first_order_amount) / 
    NULLIF(first_order_amount, 0) as order_value_growth
FROM customer_metrics
WHERE total_orders > 0
ORDER BY spending_rank;',
    'sql',
    'advanced',
    NOW(),
    0,
    0
),

-- Kotlin Snippets
(
    gen_random_uuid(),
    'Kotlin Data Class',
    'Example of a Kotlin data class with properties',
    'data class User(
    val id: String,
    val name: String,
    val email: String,
    var age: Int? = null
)

fun main() {
    val user = User("1", "John Doe", "john@example.com")
    println(user.copy(name = "Jane Doe"))
}',
    'kotlin',
    'beginner',
    NOW(),
    0,
    0
),

-- Swift Snippets
(
    gen_random_uuid(),
    'Swift Struct',
    'Example of a Swift struct with properties and methods',
    'struct Temperature {
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
print(temp.fahrenheit) // 77.0',
    'swift',
    'intermediate',
    NOW(),
    0,
    0
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_code_snippets_language ON code_snippets(language);
CREATE INDEX IF NOT EXISTS idx_code_snippets_difficulty ON code_snippets(difficulty);
CREATE INDEX IF NOT EXISTS idx_code_snippets_created_at ON code_snippets(created_at);

-- 5. Refresh materialized views if any
-- REFRESH MATERIALIZED VIEW IF EXISTS view_popular_snippets;

-- 6. Note: Run the following command separately after the transaction is complete:
-- VACUUM ANALYZE code_snippets; 