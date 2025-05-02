-- First, clear existing snippets (optional, comment out if you want to keep existing snippets)
-- DELETE FROM code_snippets;

-- Reset the sequence if you deleted all snippets
-- SELECT setval(pg_get_serial_sequence('code_snippets', 'id'), 1, false);

-- Function to generate UUID
CREATE OR REPLACE FUNCTION generate_uuid() RETURNS uuid AS $$
BEGIN
    RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;

-- Insert new snippets
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
-- JavaScript Modern Features
(
    generate_uuid(),
    'Modern JavaScript Features',
    'ES2022+ features and patterns',
    '// Top-level await
const response = await fetch(''https://api.example.com/data'');
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
        throw new Error(''Insufficient funds'');
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
}',
    'javascript',
    'advanced',
    NOW(),
    0,
    0
),

-- Python Data Science
(
    generate_uuid(),
    'Pandas Data Analysis',
    'Data analysis with Pandas and visualization',
    'import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# Load and prepare data
df = pd.read_csv(''sales_data.csv'')
df[''date''] = pd.to_datetime(df[''date''])
df.set_index(''date'', inplace=True)

# Basic statistics
print("Summary Statistics:")
print(df.describe())',
    'python',
    'intermediate',
    NOW(),
    0,
    0
),

-- TypeScript React
(
    generate_uuid(),
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
);

-- Note: Add more INSERT statements for other snippets as needed 