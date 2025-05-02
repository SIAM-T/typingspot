-- JavaScript Testing (50 snippets)
INSERT INTO code_snippets (title, description, content, language, difficulty) VALUES
('Jest Unit Testing', 'Complete unit test suite with Jest', 
'import { calculateTotal, validateInput } from "./utils";

describe("Shopping Cart Utilities", () => {
  describe("calculateTotal", () => {
    it("should calculate total with tax", () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 15, quantity: 1 }
      ];
      const taxRate = 0.1; // 10%
      
      const total = calculateTotal(items, taxRate);
      expect(total).toBe(38.5); // (10 * 2 + 15) * 1.1
    });

    it("should return 0 for empty cart", () => {
      expect(calculateTotal([], 0.1)).toBe(0);
    });

    it("should handle negative prices", () => {
      const items = [{ price: -10, quantity: 1 }];
      expect(() => calculateTotal(items, 0.1)).toThrow("Invalid price");
    });
  });

  describe("validateInput", () => {
    it("should validate correct input", () => {
      const input = {
        email: "test@example.com",
        password: "Password123!",
        age: 25
      };
      
      expect(validateInput(input)).toBe(true);
    });

    it("should reject invalid email", () => {
      const input = {
        email: "invalid-email",
        password: "Password123!",
        age: 25
      };
      
      expect(() => validateInput(input)).toThrow("Invalid email");
    });

    test.each([
      ["short", "Too short"],
      ["nospecialchars", "No special characters"],
      ["nonumbers", "No numbers"]
    ])("should reject invalid password: %s", (password, reason) => {
      const input = {
        email: "test@example.com",
        password,
        age: 25
      };
      
      expect(() => validateInput(input)).toThrow();
    });
  });
});', 'javascript', 'intermediate'),

-- Python Data Processing (50 snippets)
('Pandas Data Analysis', 'Advanced data analysis with Pandas', 
'import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Create sample time series data
dates = pd.date_range(start="2023-01-01", end="2023-12-31", freq="D")
np.random.seed(42)
data = pd.DataFrame({
    "date": dates,
    "sales": np.random.normal(1000, 100, len(dates)),
    "temperature": np.random.normal(20, 5, len(dates)),
    "promotion": np.random.choice([0, 1], len(dates), p=[0.8, 0.2])
})

# Add some seasonality
data["sales"] += np.sin(np.arange(len(dates)) * 2 * np.pi / 365) * 200

# Calculate rolling statistics
data["sales_ma7"] = data["sales"].rolling(window=7).mean()
data["sales_ma30"] = data["sales"].rolling(window=30).mean()

# Calculate year-to-date statistics
data["year"] = data["date"].dt.year
data["month"] = data["date"].dt.month
ytd_stats = data.groupby("month").agg({
    "sales": ["mean", "std", "min", "max"],
    "temperature": "mean",
    "promotion": "sum"
}).round(2)

# Analyze promotion impact
promo_impact = data.groupby("promotion")["sales"].agg([
    "count",
    "mean",
    "std"
]).round(2)

# Find top 10 sales days
top_sales = data.nlargest(10, "sales")[["date", "sales", "temperature", "promotion"]]

# Calculate correlation matrix
correlation = data[["sales", "temperature", "promotion"]].corr().round(3)

# Export results
results = {
    "ytd_stats": ytd_stats,
    "promo_impact": promo_impact,
    "top_sales": top_sales,
    "correlation": correlation
}

print("Year-to-Date Statistics:")
print(ytd_stats)
print("\nPromotion Impact Analysis:")
print(promo_impact)
print("\nTop 10 Sales Days:")
print(top_sales)
print("\nCorrelation Matrix:")
print(correlation)', 'python', 'advanced'),

-- TypeScript State Management (50 snippets)
('Redux Toolkit Store', 'Modern Redux setup with TypeScript', 
'import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

// Create initial state
const initialState: TodoState = {
  items: [],
  loading: false,
  error: null
};

// Create slice
const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Omit<Todo, "id">>) => {
      state.items.push({
        ...action.payload,
        id: Date.now().toString()
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// Export actions
export const {
  addTodo,
  toggleTodo,
  removeTodo,
  setLoading,
  setError
} = todoSlice.actions;

// Create store
export const store = configureStore({
  reducer: {
    todos: todoSlice.reducer
  }
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;', 'typescript', 'advanced'),

-- SQL Performance (25 snippets)
('Advanced SQL Query Optimization', 'Complex SQL query with performance optimization', 
'-- Create necessary indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Complex query with optimization
WITH customer_stats AS (
    SELECT 
        c.id AS customer_id,
        c.name AS customer_name,
        COUNT(DISTINCT o.id) AS total_orders,
        SUM(oi.quantity * oi.unit_price) AS total_spent,
        MAX(o.order_date) AS last_order_date
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.id
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.order_date >= CURRENT_DATE - INTERVAL ''1 year''
    GROUP BY c.id, c.name
),
product_preferences AS (
    SELECT 
        cs.customer_id,
        p.category,
        COUNT(*) as purchase_count,
        SUM(oi.quantity * oi.unit_price) as category_spent,
        RANK() OVER (
            PARTITION BY cs.customer_id 
            ORDER BY COUNT(*) DESC
        ) as category_rank
    FROM customer_stats cs
    JOIN orders o ON o.customer_id = cs.customer_id
    JOIN order_items oi ON oi.order_id = o.id
    JOIN products p ON p.id = oi.product_id
    GROUP BY cs.customer_id, p.category
)
SELECT 
    cs.*,
    pp.category as favorite_category,
    pp.purchase_count as favorite_category_purchases,
    pp.category_spent as favorite_category_spent,
    ROUND(
        pp.category_spent::numeric / cs.total_spent * 100,
        2
    ) as favorite_category_percentage
FROM customer_stats cs
LEFT JOIN product_preferences pp ON 
    pp.customer_id = cs.customer_id AND 
    pp.category_rank = 1
WHERE cs.total_orders >= 5
ORDER BY cs.total_spent DESC
LIMIT 100;', 'sql', 'advanced'),

-- React Components (25 snippets)
('Form Validation Component', 'Reusable form validation with React', 
'import React, { useState } from "react";
import { z } from "zod";

// Define validation schema
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don''t match",
  path: ["confirmPassword"]
});

type UserFormData = z.infer<typeof userSchema>;

const FormValidation: React.FC = () => {
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validData = userSchema.parse(formData);
      console.log("Form data is valid:", validData);
      // Process the valid data
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm
            ${errors.email ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm
            ${errors.password ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm
            ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default FormValidation;', 'typescript', 'advanced');

-- Continue with more snippets... 