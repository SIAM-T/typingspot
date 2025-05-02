-- JavaScript Modern Patterns (100 snippets)
INSERT INTO code_snippets (title, description, content, language, difficulty) VALUES
('Promise.all with Error Handling', 'Handle multiple promises with proper error catching', 
'const promises = [fetch(url1), fetch(url2), fetch(url3)];

try {
  const results = await Promise.all(promises);
  const data = results.map(r => r.json());
  console.log("All requests successful:", data);
} catch (error) {
  console.error("One or more requests failed:", error);
}', 'javascript', 'intermediate'),

('React Custom Hook - useLocalStorage', 'Custom hook for local storage management', 
'const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}', 'javascript', 'advanced'),

-- Python Data Science (100 snippets)
('Pandas DataFrame Operations', 'Common DataFrame operations with Pandas', 
'import pandas as pd
import numpy as np

# Create sample data
df = pd.DataFrame({
    "A": np.random.rand(100),
    "B": np.random.randint(0, 100, 100),
    "C": pd.date_range("2023-01-01", periods=100)
})

# Basic operations
df_filtered = df[df["B"] > 50]
df_grouped = df.groupby(df["C"].dt.month)["A"].mean()
df_sorted = df.sort_values("B", ascending=False)

# Add new calculated column
df["D"] = df["A"] * df["B"]

print(f"Shape: {df.shape}")
print("\nSummary Statistics:")
print(df.describe())', 'python', 'intermediate'),

-- TypeScript Advanced Types (100 snippets)
('Advanced TypeScript Utility Types', 'Implementation of useful utility types', 
'// Deep Partial type
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Readonly Recursive type
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Pick with dynamic keys
type DynamicPick<T, K extends keyof T> = Pick<T, K>;

// Example usage
interface User {
    id: number;
    name: string;
    settings: {
        theme: string;
        notifications: boolean;
    };
}

type PartialUser = DeepPartial<User>;
type ReadonlyUser = DeepReadonly<User>;
type UserBasics = DynamicPick<User, "id" | "name">;', 'typescript', 'advanced'),

-- SQL Optimization (50 snippets)
('Optimized Query with Indexes', 'Complex SQL query optimized for performance', 
'-- Create indexes for better performance
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);

-- Optimized query using indexes and proper joins
WITH monthly_stats AS (
    SELECT 
        DATE_TRUNC(''month'', order_date) as month,
        customer_id,
        SUM(total_amount) as total_spent,
        COUNT(*) as order_count
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL ''12 months''
    GROUP BY 1, 2
)
SELECT 
    c.name,
    ms.month,
    ms.total_spent,
    ms.order_count,
    AVG(ms.total_spent) OVER (
        PARTITION BY c.id 
        ORDER BY ms.month 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg_spent
FROM monthly_stats ms
JOIN customers c ON c.id = ms.customer_id
ORDER BY c.name, ms.month;', 'sql', 'advanced'),

-- React Components (50 snippets)
('Infinite Scroll Component', 'Reusable infinite scroll implementation with React', 
'import React, { useEffect, useRef, useState } from "react";

interface Props<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function InfiniteScroll<T>({ 
  items, 
  renderItem, 
  loadMore, 
  hasMore 
}: Props<T>) {
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setLoading(true);
        loadMore().finally(() => setLoading(false));
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => observer.current?.disconnect();
  }, [loading, hasMore]);

  return (
    <div className="infinite-scroll-container">
      {items.map((item, index) => (
        <div key={index}>
          {renderItem(item)}
        </div>
      ))}
      <div ref={lastElementRef} className="loading-trigger">
        {loading && "Loading more..."}
      </div>
    </div>
  );
}', 'typescript', 'advanced'),

-- Python FastAPI Backend (50 snippets)
('FastAPI CRUD Operations', 'Complete CRUD implementation with FastAPI', 
'from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

app = FastAPI()

class ItemBase(BaseModel):
    title: str
    description: str | None = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

@app.post("/items/", response_model=Item)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/items/", response_model=List[Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Item).offset(skip).limit(limit).all()
    return items

@app.get("/items/{item_id}", response_model=Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted"}', 'python', 'advanced'),

-- Docker Compose (25 snippets)
('Microservices Docker Compose', 'Complete microservices setup with Docker Compose', 
'version: "3.8"

services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/app
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=app

  cache:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:', 'yaml', 'advanced'),

-- HTML Templates (25 snippets)
('Responsive Landing Page', 'Modern responsive landing page template', 
'<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <style>
        :root {
            --primary-color: #2563eb;
            --secondary-color: #1e40af;
            --text-color: #1f2937;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.5;
            color: var(--text-color);
        }

        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }

        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            padding: 1rem 0;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
        }

        .button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: var(--primary-color);
            color: white;
            border-radius: 0.375rem;
            text-decoration: none;
            transition: background-color 0.2s;
        }

        .button:hover {
            background-color: var(--secondary-color);
        }

        @media (max-width: 768px) {
            .hero {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <nav class="nav">
        <div class="container">
            <a href="#" class="logo">Brand</a>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <h1>Welcome to the Future</h1>
            <p>Experience the next generation of web development</p>
            <a href="#" class="button">Get Started</a>
        </div>
    </section>
</body>
</html>', 'html', 'intermediate');

-- Continue with more snippets... 