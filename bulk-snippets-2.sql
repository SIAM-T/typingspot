-- Continue bulk snippet insertion
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

-- CSS Grid Layout
(
    generate_uuid(),
    'Modern CSS Grid',
    'Responsive grid layouts using CSS Grid',
    '/* Basic grid container */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

/* Grid with named areas */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1rem;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }

/* Responsive grid with auto-flow */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense;
  gap: 1rem;
}

/* Spanning items */
.featured {
  grid-column: span 2;
  grid-row: span 2;
}

/* Grid with alignment */
.aligned-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  justify-items: center;
  align-items: center;
  place-items: center; /* shorthand */
}

/* Responsive layout with minmax */
.responsive-layout {
  display: grid;
  grid-template-columns: minmax(150px, 25%) 1fr minmax(150px, 25%);
  gap: 1rem;
}

/* Grid with auto-fit and auto-fill */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

/* Masonry-like layout */
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 20px;
  grid-auto-flow: row dense;
}

.masonry-item {
  grid-row-end: span attr(data-height);
}

/* Responsive media queries */
@media (max-width: 768px) {
  .layout {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}',
    'css',
    'intermediate',
    NOW(),
    0,
    0
),

-- Python Data Science
(
    generate_uuid(),
    'Pandas Data Analysis',
    'Common data analysis patterns with Pandas',
    'import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Any

# Load and prepare data
def load_and_prepare_data(file_path: str) -> pd.DataFrame:
    """Load and prepare data for analysis."""
    df = pd.read_csv(file_path)
    
    # Handle missing values
    df.fillna({
        "numeric_col": df["numeric_col"].mean(),
        "categorical_col": "Unknown"
    }, inplace=True)
    
    # Convert dates
    df["date_col"] = pd.to_datetime(df["date_col"])
    
    return df

# Feature engineering
def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create new features from existing data."""
    # Date features
    df["year"] = df["date_col"].dt.year
    df["month"] = df["date_col"].dt.month
    df["day_of_week"] = df["date_col"].dt.dayofweek
    
    # Aggregations
    agg_features = df.groupby("category").agg({
        "numeric_col": ["mean", "std", "min", "max"],
        "other_col": "count"
    }).reset_index()
    
    # Merge back
    df = df.merge(agg_features, on="category", how="left")
    
    return df

# Data analysis
def analyze_data(df: pd.DataFrame) -> Dict[str, Any]:
    """Perform common data analysis tasks."""
    results = {}
    
    # Basic statistics
    results["summary_stats"] = df.describe()
    
    # Correlation analysis
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    results["correlations"] = df[numeric_cols].corr()
    
    # Group analysis
    results["group_analysis"] = df.groupby("category").agg({
        "numeric_col": ["mean", "count"],
        "other_col": ["nunique", "first"]
    })
    
    return results

# Visualization
def create_visualizations(df: pd.DataFrame, save_path: str = None):
    """Create common visualizations."""
    # Set style
    plt.style.use("seaborn")
    
    # Create figure with subplots
    fig, axes = plt.subplots(2, 2, figsize=(15, 15))
    
    # Distribution plot
    sns.histplot(data=df, x="numeric_col", kde=True, ax=axes[0,0])
    axes[0,0].set_title("Distribution of Numeric Values")
    
    # Box plot
    sns.boxplot(data=df, x="category", y="numeric_col", ax=axes[0,1])
    axes[0,1].set_title("Values by Category")
    
    # Time series plot
    df.groupby("date_col")["numeric_col"].mean().plot(ax=axes[1,0])
    axes[1,0].set_title("Time Series Analysis")
    
    # Correlation heatmap
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    sns.heatmap(df[numeric_cols].corr(), annot=True, ax=axes[1,1])
    axes[1,1].set_title("Correlation Matrix")
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path)
    
    plt.close()

# Example usage
if __name__ == "__main__":
    # Load and prepare data
    df = load_and_prepare_data("data.csv")
    
    # Create features
    df = create_features(df)
    
    # Analyze data
    analysis_results = analyze_data(df)
    print("Analysis Results:")
    for key, value in analysis_results.items():
        print(f"\n{key}:")
        print(value)
    
    # Create visualizations
    create_visualizations(df, "analysis_plots.png")',
    'python',
    'advanced',
    NOW(),
    0,
    0
),

-- TypeScript State Management
(
    generate_uuid(),
    'Redux Toolkit Setup',
    'Modern Redux setup with TypeScript',
    'import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Types
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  items: TodoItem[];
  isLoading: boolean;
  error: string | null;
}

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
  } as AuthState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

// Todo slice
const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  } as TodoState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<TodoItem, "completed">>) => {
      state.items.push({
        ...action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setTodos: (state, action: PayloadAction<TodoItem[]>) => {
      state.items = action.payload;
    },
  },
});

// Store setup
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    todos: todoSlice.reducer,
  },
});

// Exports
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export const { addTodo, toggleTodo, removeTodo, setTodos } = todoSlice.actions;

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Example usage in a component
import React from "react";

export const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector((state) => state.todos);
  const user = useAppSelector((state) => state.auth.user);

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleRemove = (id: string) => {
    dispatch(removeTodo(id));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view todos</div>;
  }

  return (
    <div>
      {items.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
          />
          <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            {todo.title}
          </span>
          <button onClick={() => handleRemove(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};',
    'typescript',
    'advanced',
    NOW(),
    0,
    0
),

-- Rust Web Server
(
    generate_uuid(),
    'Actix Web Server',
    'REST API implementation with Actix Web',
    'use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::sync::Arc;
use tokio;

// Types
#[derive(Debug, Serialize, Deserialize)]
struct User {
    id: i32,
    name: String,
    email: String,
}

#[derive(Debug, Deserialize)]
struct CreateUser {
    name: String,
    email: String,
}

// Database connection pool
struct AppState {
    db: Arc<PgPool>,
}

// Routes
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy"
    }))
}

async fn get_users(state: web::Data<AppState>) -> impl Responder {
    match sqlx::query_as!(
        User,
        "SELECT id, name, email FROM users"
    )
    .fetch_all(&*state.db)
    .await
    {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

async fn get_user(
    state: web::Data<AppState>,
    path: web::Path<i32>,
) -> impl Responder {
    let user_id = path.into_inner();

    match sqlx::query_as!(
        User,
        "SELECT id, name, email FROM users WHERE id = $1",
        user_id
    )
    .fetch_optional(&*state.db)
    .await
    {
        Ok(Some(user)) => HttpResponse::Ok().json(user),
        Ok(None) => HttpResponse::NotFound().finish(),
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

async fn create_user(
    state: web::Data<AppState>,
    user: web::Json<CreateUser>,
) -> impl Responder {
    match sqlx::query_as!(
        User,
        "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
        user.name,
        user.email
    )
    .fetch_one(&*state.db)
    .await
    {
        Ok(user) => HttpResponse::Created().json(user),
        Err(e) => {
            eprintln!("Database error: {}", e);
            HttpResponse::InternalServerError().finish()
        }
    }
}

// Error handling
#[derive(Debug, Serialize)]
struct ErrorResponse {
    message: String,
}

impl From<sqlx::Error> for ErrorResponse {
    fn from(err: sqlx::Error) -> Self {
        ErrorResponse {
            message: err.to_string(),
        }
    }
}

// Middleware
use actix_web::middleware::{Logger, NormalizePath};
use env_logger::Env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    // Database connection
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");

    let db_pool = PgPool::connect(&database_url)
        .await
        .expect("Failed to connect to Postgres");

    let db_pool = Arc::new(db_pool);

    // Start server
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState {
                db: db_pool.clone(),
            }))
            .wrap(Logger::default())
            .wrap(NormalizePath::trim())
            .service(
                web::scope("/api")
                    .route("/health", web::get().to(health_check))
                    .service(
                        web::scope("/users")
                            .route("", web::get().to(get_users))
                            .route("", web::post().to(create_user))
                            .route("/{id}", web::get().to(get_user))
                    )
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}

// Tests
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{test, App};

    #[actix_rt::test]
    async fn test_health_check() {
        let mut app = test::init_service(
            App::new().route("/health", web::get().to(health_check))
        ).await;

        let req = test::TestRequest::get().uri("/health").to_request();
        let resp = test::call_service(&mut app, req).await;
        assert!(resp.status().is_success());
    }
}',
    'rust',
    'advanced',
    NOW(),
    0,
    0
); 