-- Insert new code snippets
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
-- Rust Error Handling
(
    generate_uuid(),
    'Rust Error Handling',
    'Advanced error handling patterns in Rust',
    'use std::error::Error;
use std::fmt;
use std::fs::File;
use std::io;

#[derive(Debug)]
enum CustomError {
    IoError(io::Error),
    ParseError(String),
}

impl Error for CustomError {}

impl fmt::Display for CustomError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            CustomError::IoError(e) => write!(f, "IO error: {}", e),
            CustomError::ParseError(msg) => write!(f, "Parse error: {}", msg),
        }
    }
}

impl From<io::Error> for CustomError {
    fn from(err: io::Error) -> CustomError {
        CustomError::IoError(err)
    }
}

fn read_config() -> Result<String, CustomError> {
    let file = File::open("config.txt")?;
    // Process file...
    Ok("Configuration loaded".to_string())
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
    'Go Concurrency Patterns',
    'Common concurrency patterns in Go',
    'package main

import (
    "context"
    "fmt"
    "sync"
    "time"
)

func worker(ctx context.Context, id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for {
        select {
        case <-ctx.Done():
            return
        case job, ok := <-jobs:
            if !ok {
                return
            }
            // Simulate work
            time.Sleep(time.Second)
            results <- job * 2
        }
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    jobs := make(chan int, 100)
    results := make(chan int, 100)
    var wg sync.WaitGroup

    // Start workers
    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(ctx, w, jobs, results, &wg)
    }

    // Send jobs
    go func() {
        for i := 1; i <= 5; i++ {
            jobs <- i
        }
        close(jobs)
    }()

    // Wait and collect results
    go func() {
        wg.Wait()
        close(results)
    }()

    // Print results
    for result := range results {
        fmt.Printf("Result: %d\n", result)
    }
}',
    'go',
    'intermediate',
    NOW(),
    0,
    0
),

-- Python AsyncIO
(
    generate_uuid(),
    'Python AsyncIO Patterns',
    'Modern asynchronous programming in Python',
    'import asyncio
from typing import List
import aiohttp
import async_timeout

async def fetch_url(session: aiohttp.ClientSession, url: str) -> dict:
    async with async_timeout.timeout(10):
        async with session.get(url) as response:
            return {
                "url": url,
                "status": response.status,
                "data": await response.json()
            }

async def process_urls(urls: List[str]) -> List[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks)

async def main():
    urls = [
        "https://api.example.com/data/1",
        "https://api.example.com/data/2",
        "https://api.example.com/data/3"
    ]
    
    try:
        results = await process_urls(urls)
        for result in results:
            print(f"URL: {result[''url'']} - Status: {result[''status'']}")
    except asyncio.TimeoutError:
        print("Operation timed out")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    asyncio.run(main())',
    'python',
    'advanced',
    NOW(),
    0,
    0
),

-- TypeScript Design Patterns
(
    generate_uuid(),
    'TypeScript Design Patterns',
    'Implementation of common design patterns in TypeScript',
    'interface Observer {
  update(data: any): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class NewsAgency implements Subject {
  private observers: Set<Observer> = new Set();
  private news: string = "";

  attach(observer: Observer): void {
    this.observers.add(observer);
  }

  detach(observer: Observer): void {
    this.observers.delete(observer);
  }

  notify(): void {
    for (const observer of this.observers) {
      observer.update(this.news);
    }
  }

  setNews(news: string): void {
    this.news = news;
    this.notify();
  }
}

class NewsChannel implements Observer {
  private name: string;
  
  constructor(name: string) {
    this.name = name;
  }

  update(news: string): void {
    console.log(`${this.name} received news: ${news}`);
  }
}

// Usage
const newsAgency = new NewsAgency();
const channel1 = new NewsChannel("Channel 1");
const channel2 = new NewsChannel("Channel 2");

newsAgency.attach(channel1);
newsAgency.attach(channel2);

newsAgency.setNews("Breaking: TypeScript 5.0 released!");',
    'typescript',
    'advanced',
    NOW(),
    0,
    0
); 