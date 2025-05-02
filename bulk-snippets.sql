-- Begin bulk snippet insertion
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

-- JavaScript Fundamentals
(
    generate_uuid(),
    'Array Methods',
    'Common array manipulation methods in JavaScript',
    'const numbers = [1, 2, 3, 4, 5];

// Map: Transform each element
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Filter: Keep elements that pass a test
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4]

// Reduce: Accumulate values
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 15

// Find: Get first matching element
const firstEven = numbers.find(num => num % 2 === 0);
console.log(firstEven); // 2

// Some: Check if any element matches
const hasEven = numbers.some(num => num % 2 === 0);
console.log(hasEven); // true

// Every: Check if all elements match
const allPositive = numbers.every(num => num > 0);
console.log(allPositive); // true',
    'javascript',
    'beginner',
    NOW(),
    0,
    0
),

-- Python Data Structures
(
    generate_uuid(),
    'Dictionary Comprehension',
    'Advanced dictionary operations in Python',
    'from typing import Dict, List

# Basic dictionary comprehension
squares = {x: x**2 for x in range(5)}
print(squares)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Conditional dictionary comprehension
even_squares = {x: x**2 for x in range(10) if x % 2 == 0}
print(even_squares)  # {0: 0, 2: 4, 4: 16, 6: 36, 8: 64}

# Dictionary comprehension with two input lists
keys = ["a", "b", "c"]
values = [1, 2, 3]
dict_from_lists = {k: v for k, v in zip(keys, values)}
print(dict_from_lists)  # {"a": 1, "b": 2, "c": 3}

# Nested dictionary comprehension
matrix = {i: {j: i*j for j in range(3)} for i in range(3)}
print(matrix)  # {0: {0: 0, 1: 0, 2: 0}, 1: {0: 0, 1: 1, 2: 2}, 2: {0: 0, 1: 2, 2: 4}}

# Type-annotated dictionary comprehension
def create_lookup(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}

words = ["apple", "banana", "cherry"]
lengths = create_lookup(words)
print(lengths)  # {"apple": 5, "banana": 6, "cherry": 6}',
    'python',
    'intermediate',
    NOW(),
    0,
    0
),

-- TypeScript React Hooks
(
    generate_uuid(),
    'Custom React Hooks',
    'Collection of useful custom React hooks',
    'import { useState, useEffect, useCallback, useRef } from "react";

// Hook for handling async operations
interface UseAsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

function useAsync<T>(asyncFn: () => Promise<T>, deps: any[] = []): UseAsyncState<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const data = await asyncFn();
        if (mounted) {
          setState({ loading: false, error: null, data });
        }
      } catch (error) {
        if (mounted) {
          setState({ loading: false, error: error as Error, data: null });
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, deps);

  return state;
}

// Hook for handling local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for handling click outside
function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// Hook for handling debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}',
    'typescript',
    'advanced',
    NOW(),
    0,
    0
),

-- Rust Memory Management
(
    generate_uuid(),
    'Smart Pointers in Rust',
    'Examples of different smart pointer types in Rust',
    'use std::rc::Rc;
use std::cell::RefCell;
use std::sync::{Arc, Mutex};
use std::thread;

// Box<T> - heap allocation
fn box_example() {
    // Allocate a string on the heap
    let boxed_string = Box::new(String::from("Hello"));
    println!("Boxed string: {}", boxed_string);

    // Recursive types with boxes
    #[derive(Debug)]
    enum List {
        Cons(i32, Box<List>),
        Nil,
    }

    let list = List::Cons(1, Box::new(List::Cons(2, Box::new(List::Nil))));
    println!("List: {:?}", list);
}

// Rc<T> - reference counting
fn rc_example() {
    // Create a reference counted string
    let text = Rc::new(String::from("Share me"));
    
    let text_clone1 = Rc::clone(&text);
    let text_clone2 = Rc::clone(&text);

    println!("Reference count: {}", Rc::strong_count(&text));
    println!("Shared text: {}, {}, {}", text, text_clone1, text_clone2);
}

// RefCell<T> - interior mutability
fn refcell_example() {
    let data = RefCell::new(vec![1, 2, 3]);
    
    // Borrow mutably and modify
    data.borrow_mut().push(4);
    
    // Borrow immutably and read
    println!("Data: {:?}", data.borrow());
}

// Arc<T> and Mutex<T> - thread-safe sharing
fn arc_mutex_example() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..3 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter_clone.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Final count: {}", *counter.lock().unwrap());
}

fn main() {
    box_example();
    rc_example();
    refcell_example();
    arc_mutex_example();
}',
    'rust',
    'advanced',
    NOW(),
    0,
    0
),

-- Go Concurrency
(
    generate_uuid(),
    'Advanced Channel Patterns',
    'Advanced Go channel patterns and best practices',
    'package main

import (
    "context"
    "fmt"
    "sync"
    "time"
)

// Fan-out pattern
func fanOut(ctx context.Context, input <-chan int, numWorkers int) []<-chan int {
    outputs := make([]<-chan int, numWorkers)
    for i := 0; i < numWorkers; i++ {
        outputs[i] = worker(ctx, input)
    }
    return outputs
}

func worker(ctx context.Context, input <-chan int) <-chan int {
    output := make(chan int)
    go func() {
        defer close(output)
        for {
            select {
            case <-ctx.Done():
                return
            case n, ok := <-input:
                if !ok {
                    return
                }
                // Simulate work
                time.Sleep(100 * time.Millisecond)
                output <- n * 2
            }
        }
    }()
    return output
}

// Fan-in pattern
func fanIn(ctx context.Context, channels []<-chan int) <-chan int {
    var wg sync.WaitGroup
    multiplexed := make(chan int)

    multiplex := func(c <-chan int) {
        defer wg.Done()
        for {
            select {
            case <-ctx.Done():
                return
            case n, ok := <-c:
                if !ok {
                    return
                }
                multiplexed <- n
            }
        }
    }

    wg.Add(len(channels))
    for _, c := range channels {
        go multiplex(c)
    }

    // Close multiplexed channel when all input channels are done
    go func() {
        wg.Wait()
        close(multiplexed)
    }()

    return multiplexed
}

// Pipeline pattern
type PipelineStage func(ctx context.Context, input <-chan int) <-chan int

func pipeline(ctx context.Context, input <-chan int, stages ...PipelineStage) <-chan int {
    current := input
    for _, stage := range stages {
        current = stage(ctx, current)
    }
    return current
}

// Example stages
func multiply(ctx context.Context, input <-chan int) <-chan int {
    output := make(chan int)
    go func() {
        defer close(output)
        for {
            select {
            case <-ctx.Done():
                return
            case n, ok := <-input:
                if !ok {
                    return
                }
                output <- n * 2
            }
        }
    }()
    return output
}

func filter(ctx context.Context, input <-chan int) <-chan int {
    output := make(chan int)
    go func() {
        defer close(output)
        for {
            select {
            case <-ctx.Done():
                return
            case n, ok := <-input:
                if !ok {
                    return
                }
                if n%2 == 0 {
                    output <- n
                }
            }
        }
    }()
    return output
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Create input channel
    input := make(chan int)
    go func() {
        defer close(input)
        for i := 1; i <= 10; i++ {
            input <- i
        }
    }()

    // Create fan-out workers
    workers := fanOut(ctx, input, 3)

    // Fan-in results
    results := fanIn(ctx, workers)

    // Create pipeline
    final := pipeline(ctx, results,
        multiply,
        filter,
    )

    // Print results
    for result := range final {
        fmt.Printf("Result: %d\n", result)
    }
}',
    'go',
    'advanced',
    NOW(),
    0,
    0
),

-- SQL Patterns
(
    generate_uuid(),
    'Advanced SQL Queries',
    'Complex SQL query patterns and window functions',
    '-- Create sample tables
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date DATE
);

CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    sale_date DATE,
    amount DECIMAL(10,2)
);

-- Window functions
-- Running total of sales per employee
SELECT 
    e.name,
    s.sale_date,
    s.amount,
    SUM(s.amount) OVER (
        PARTITION BY s.employee_id 
        ORDER BY s.sale_date
    ) as running_total
FROM employees e
JOIN sales s ON e.id = s.employee_id;

-- Rank employees by salary within departments
SELECT 
    name,
    department,
    salary,
    RANK() OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) as salary_rank,
    DENSE_RANK() OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) as dense_salary_rank
FROM employees;

-- Moving average of sales
SELECT 
    sale_date,
    amount,
    AVG(amount) OVER (
        ORDER BY sale_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as weekly_moving_avg
FROM sales;

-- Gap detection in sequences
WITH numbered_sales AS (
    SELECT 
        sale_date,
        amount,
        LEAD(sale_date) OVER (ORDER BY sale_date) as next_sale_date
    FROM sales
)
SELECT 
    sale_date,
    next_sale_date,
    next_sale_date - sale_date as gap
FROM numbered_sales
WHERE next_sale_date - sale_date > interval ''7 days'';

-- Cumulative distribution
SELECT 
    department,
    salary,
    CUME_DIST() OVER (
        PARTITION BY department 
        ORDER BY salary
    ) as salary_percentile
FROM employees;

-- First value, last value, and nth value
SELECT 
    department,
    name,
    salary,
    FIRST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
    ) as highest_salary,
    LAST_VALUE(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as lowest_salary,
    NTH_VALUE(salary, 2) OVER (
        PARTITION BY department 
        ORDER BY salary DESC
        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) as second_highest_salary
FROM employees;

-- Pivot table using crosstab
CREATE EXTENSION IF NOT EXISTS tablefunc;

SELECT *
FROM crosstab(
    ''SELECT 
        department,
        EXTRACT(YEAR FROM hire_date)::text as year,
        COUNT(*)
    FROM employees
    GROUP BY department, EXTRACT(YEAR FROM hire_date)
    ORDER BY 1,2'',
    ''SELECT DISTINCT EXTRACT(YEAR FROM hire_date)::text
    FROM employees
    ORDER BY 1''
) AS ct (
    department VARCHAR,
    "2020" INTEGER,
    "2021" INTEGER,
    "2022" INTEGER
);',
    'sql',
    'advanced',
    NOW(),
    0,
    0
),

-- Python Design Patterns
(
    generate_uuid(),
    'Factory Pattern Implementation',
    'Example of Factory Method and Abstract Factory patterns in Python',
    'from abc import ABC, abstractmethod
from typing import Dict, Type

# Product interfaces
class Animal(ABC):
    @abstractmethod
    def speak(self) -> str:
        pass

class Vehicle(ABC):
    @abstractmethod
    def move(self) -> str:
        pass

# Concrete products
class Dog(Animal):
    def speak(self) -> str:
        return "Woof!"

class Cat(Animal):
    def speak(self) -> str:
        return "Meow!"

class Car(Vehicle):
    def move(self) -> str:
        return "Driving on road"

class Boat(Vehicle):
    def move(self) -> str:
        return "Sailing on water"

# Factory Method Pattern
class AnimalFactory:
    _animals: Dict[str, Type[Animal]] = {
        "dog": Dog,
        "cat": Cat
    }

    @classmethod
    def create_animal(cls, animal_type: str) -> Animal:
        animal_class = cls._animals.get(animal_type.lower())
        if not animal_class:
            raise ValueError(f"Invalid animal type: {animal_type}")
        return animal_class()

    @classmethod
    def register_animal(cls, animal_type: str, animal_class: Type[Animal]) -> None:
        cls._animals[animal_type.lower()] = animal_class

# Abstract Factory Pattern
class TransportFactory(ABC):
    @abstractmethod
    def create_animal(self) -> Animal:
        pass

    @abstractmethod
    def create_vehicle(self) -> Vehicle:
        pass

class LandTransportFactory(TransportFactory):
    def create_animal(self) -> Animal:
        return Dog()

    def create_vehicle(self) -> Vehicle:
        return Car()

class WaterTransportFactory(TransportFactory):
    def create_animal(self) -> Animal:
        return Cat()

    def create_vehicle(self) -> Vehicle:
        return Boat()

# Client code
def client_code(factory: TransportFactory) -> None:
    animal = factory.create_animal()
    vehicle = factory.create_vehicle()

    print(f"Animal says: {animal.speak()}")
    print(f"Vehicle: {vehicle.move()}")

# Usage example
if __name__ == "__main__":
    # Using Factory Method
    print("Using Factory Method:")
    dog = AnimalFactory.create_animal("dog")
    cat = AnimalFactory.create_animal("cat")
    print(dog.speak())  # Output: Woof!
    print(cat.speak())  # Output: Meow!

    # Adding new animal type dynamically
    class Lion(Animal):
        def speak(self) -> str:
            return "Roar!"

    AnimalFactory.register_animal("lion", Lion)
    lion = AnimalFactory.create_animal("lion")
    print(lion.speak())  # Output: Roar!

    # Using Abstract Factory
    print("\nUsing Abstract Factory:")
    print("Land transport:")
    client_code(LandTransportFactory())
    print("\nWater transport:")
    client_code(WaterTransportFactory())',
    'python',
    'advanced',
    NOW(),
    0,
    0
),

-- JavaScript Async Patterns
(
    generate_uuid(),
    'Modern Async Patterns',
    'Different ways to handle asynchronous operations in JavaScript',
    '// Promises
function fetchUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = {
                id: userId,
                name: "John Doe",
                email: "john@example.com"
            };
            resolve(user);
        }, 1000);
    });
}

// Promise chaining
fetchUserData(1)
    .then(user => {
        console.log("User:", user);
        return fetchUserPosts(user.id);
    })
    .then(posts => {
        console.log("Posts:", posts);
    })
    .catch(error => {
        console.error("Error:", error);
    });

// Async/await
async function getUserData(userId) {
    try {
        const user = await fetchUserData(userId);
        const posts = await fetchUserPosts(user.id);
        return { user, posts };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Promise.all
async function getAllUsersData(userIds) {
    try {
        const userPromises = userIds.map(id => fetchUserData(id));
        const users = await Promise.all(userPromises);
        return users;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Promise.race
async function fetchWithTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), timeout);
    });
    return Promise.race([promise, timeoutPromise]);
}

// Async iterator
async function* generateNumbers() {
    for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        yield i;
    }
}

// Using async iterator
async function processNumbers() {
    for await (const num of generateNumbers()) {
        console.log(num);
    }
}

// Async queue
class AsyncQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    async add(task) {
        this.queue.push(task);
        if (!this.processing) {
            await this.process();
        }
    }

    async process() {
        this.processing = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            try {
                await task();
            } catch (error) {
                console.error("Task error:", error);
            }
        }
        this.processing = false;
    }
}

// Usage examples
async function main() {
    // Using async/await
    const userData = await getUserData(1);
    console.log(userData);

    // Using Promise.all
    const users = await getAllUsersData([1, 2, 3]);
    console.log(users);

    // Using Promise.race with timeout
    try {
        const result = await fetchWithTimeout(
            fetch("https://api.example.com/data"),
            5000
        );
        console.log(result);
    } catch (error) {
        console.error("Request timed out or failed:", error);
    }

    // Using async iterator
    await processNumbers();

    // Using async queue
    const queue = new AsyncQueue();
    queue.add(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Task 1 completed");
    });
    queue.add(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("Task 2 completed");
    });
}

main().catch(console.error);',
    'javascript',
    'advanced',
    NOW(),
    0,
    0
)

-- Note: This is just the start. I'll continue with more snippets... 