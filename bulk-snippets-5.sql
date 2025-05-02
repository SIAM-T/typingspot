-- CSS Modern Patterns (50 snippets)
INSERT INTO code_snippets (title, description, content, language, difficulty) VALUES
('CSS Grid Layout System', 'Modern responsive grid system using CSS Grid', 
'.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
}

.grid-item {
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s;
}

.grid-item:hover {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: 1fr;
    }
}', 'css', 'intermediate'),

('Modern Card Component', 'Stylish card design with hover effects', 
'.card {
    --shadow-color: 220 3% 15%;
    --shadow-strength: 1%;
    
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 
        0 1px 3px -1px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 9%)),
        0 3px 8px -3px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));
    transition: all 0.3s ease;
}

.card:hover {
    --shadow-strength: 5%;
    transform: translateY(-2px);
}

.card__image {
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.card__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: hsl(220 10% 10%);
    margin-bottom: 0.5rem;
}

.card__content {
    color: hsl(220 10% 30%);
    line-height: 1.5;
}', 'css', 'intermediate'),

-- Python Machine Learning (50 snippets)
('Scikit-learn Pipeline', 'Complete ML pipeline with preprocessing and model training', 
'from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
import pandas as pd
import numpy as np

# Load and prepare data
data = pd.read_csv("dataset.csv")
X = data.drop("target", axis=1)
y = data["target"]

# Split features into numerical and categorical
numeric_features = X.select_dtypes(include=["int64", "float64"]).columns
categorical_features = X.select_dtypes(include=["object"]).columns

# Create preprocessing steps
numeric_transformer = Pipeline(steps=[
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("onehot", OneHotEncoder(drop="first", sparse=False))
])

# Combine preprocessing steps
preprocessor = ColumnTransformer(
    transformers=[
        ("num", numeric_transformer, numeric_features),
        ("cat", categorical_transformer, categorical_features)
    ])

# Create full pipeline
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier())
])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Define hyperparameter grid
param_grid = {
    "classifier__n_estimators": [100, 200, 300],
    "classifier__max_depth": [10, 20, 30, None],
    "classifier__min_samples_split": [2, 5, 10]
}

# Perform grid search
grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    n_jobs=-1,
    scoring="accuracy"
)

# Fit and evaluate
grid_search.fit(X_train, y_train)
print(f"Best parameters: {grid_search.best_params_}")
print(f"Best cross-validation score: {grid_search.best_score_:.3f}")
print(f"Test score: {grid_search.score(X_test, y_test):.3f}")', 'python', 'advanced'),

-- TypeScript React Patterns (50 snippets)
('Custom React Hook - useDebounce', 'Debounce hook for handling frequent updates', 
'import { useState, useEffect } from "react";

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
}

// Example usage
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search operation
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}', 'typescript', 'advanced'),

-- Rust Web Server (25 snippets)
('Actix Web Server', 'Basic Actix web server with routing and middleware', 
'use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
struct Task {
    id: u32,
    title: String,
    completed: bool,
}

struct AppState {
    tasks: Mutex<Vec<Task>>,
}

async fn get_tasks(data: web::Data<AppState>) -> impl Responder {
    let tasks = data.tasks.lock().unwrap();
    HttpResponse::Ok().json(&*tasks)
}

async fn create_task(
    data: web::Data<AppState>,
    task: web::Json<Task>,
) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    tasks.push(task.into_inner());
    HttpResponse::Created().json(&tasks.last().unwrap())
}

async fn update_task(
    data: web::Data<AppState>,
    task_id: web::Path<u32>,
    updated_task: web::Json<Task>,
) -> impl Responder {
    let mut tasks = data.tasks.lock().unwrap();
    if let Some(task) = tasks.iter_mut().find(|t| t.id == *task_id) {
        *task = updated_task.into_inner();
        HttpResponse::Ok().json(task)
    } else {
        HttpResponse::NotFound().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {
        tasks: Mutex::new(Vec::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/tasks", web::get().to(get_tasks))
            .route("/tasks", web::post().to(create_task))
            .route("/tasks/{id}", web::put().to(update_task))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}', 'rust', 'advanced'),

-- Go Concurrency (25 snippets)
('Worker Pool Pattern', 'Concurrent worker pool implementation in Go', 
'package main

import (
    "fmt"
    "sync"
    "time"
)

type Job struct {
    ID   int
    Data interface{}
}

type Result struct {
    JobID int
    Data  interface{}
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job.ID)
        
        // Simulate work
        time.Sleep(time.Second)
        
        results <- Result{
            JobID: job.ID,
            Data:  fmt.Sprintf("Processed %v", job.Data),
        }
    }
}

func main() {
    numJobs := 10
    numWorkers := 3
    
    jobs := make(chan Job, numJobs)
    results := make(chan Result, numJobs)
    
    // Create worker pool
    var wg sync.WaitGroup
    for w := 1; w <= numWorkers; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }
    
    // Send jobs
    go func() {
        for j := 1; j <= numJobs; j++ {
            jobs <- Job{
                ID:   j,
                Data: fmt.Sprintf("Job %d", j),
            }
        }
        close(jobs)
    }()
    
    // Wait for all workers to complete
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Collect results
    for result := range results {
        fmt.Printf("Result: Job %d - %v\n", result.JobID, result.Data)
    }
}', 'go', 'advanced');

-- Continue with more snippets... 