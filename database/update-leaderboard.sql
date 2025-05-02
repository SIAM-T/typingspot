-- Function to update leaderboard cache for a user
CREATE OR REPLACE FUNCTION update_user_leaderboard_cache()
RETURNS TRIGGER AS $$
DECLARE
  periods text[] := ARRAY['daily', 'weekly', 'monthly', 'all_time'];
  period text;
BEGIN
  -- For each time period
  FOREACH period IN ARRAY periods
  LOOP
    -- Update WPM rankings
    WITH user_stats AS (
      SELECT
        user_id,
        AVG(wpm) as avg_wpm,
        COUNT(*) as total_tests,
        AVG(accuracy) as avg_accuracy
      FROM typing_results
      WHERE
        CASE
          WHEN period = 'daily' THEN created_at >= CURRENT_DATE
          WHEN period = 'weekly' THEN created_at >= CURRENT_DATE - INTERVAL '7 days'
          WHEN period = 'monthly' THEN created_at >= CURRENT_DATE - INTERVAL '30 days'
          ELSE TRUE
        END
      GROUP BY user_id
    ),
    rankings AS (
      SELECT
        user_id,
        avg_wpm as score,
        RANK() OVER (ORDER BY avg_wpm DESC) as rank
      FROM user_stats
    )
    INSERT INTO leaderboard_cache (user_id, period, category, score, rank)
    SELECT
      user_id,
      period,
      'wpm',
      score,
      rank
    FROM rankings
    ON CONFLICT (user_id, period, category)
    DO UPDATE SET
      score = EXCLUDED.score,
      rank = EXCLUDED.rank,
      updated_at = NOW();

    -- Update accuracy rankings
    WITH user_stats AS (
      SELECT
        user_id,
        AVG(accuracy) as avg_accuracy
      FROM typing_results
      WHERE
        CASE
          WHEN period = 'daily' THEN created_at >= CURRENT_DATE
          WHEN period = 'weekly' THEN created_at >= CURRENT_DATE - INTERVAL '7 days'
          WHEN period = 'monthly' THEN created_at >= CURRENT_DATE - INTERVAL '30 days'
          ELSE TRUE
        END
      GROUP BY user_id
    ),
    rankings AS (
      SELECT
        user_id,
        avg_accuracy as score,
        RANK() OVER (ORDER BY avg_accuracy DESC) as rank
      FROM user_stats
    )
    INSERT INTO leaderboard_cache (user_id, period, category, score, rank)
    SELECT
      user_id,
      period,
      'accuracy',
      score,
      rank
    FROM rankings
    ON CONFLICT (user_id, period, category)
    DO UPDATE SET
      score = EXCLUDED.score,
      rank = EXCLUDED.rank,
      updated_at = NOW();

    -- Update tests completed rankings
    WITH user_stats AS (
      SELECT
        user_id,
        COUNT(*) as total_tests
      FROM typing_results
      WHERE
        CASE
          WHEN period = 'daily' THEN created_at >= CURRENT_DATE
          WHEN period = 'weekly' THEN created_at >= CURRENT_DATE - INTERVAL '7 days'
          WHEN period = 'monthly' THEN created_at >= CURRENT_DATE - INTERVAL '30 days'
          ELSE TRUE
        END
      GROUP BY user_id
    ),
    rankings AS (
      SELECT
        user_id,
        total_tests as score,
        RANK() OVER (ORDER BY total_tests DESC) as rank
      FROM user_stats
    )
    INSERT INTO leaderboard_cache (user_id, period, category, score, rank)
    SELECT
      user_id,
      period,
      'tests_completed',
      score,
      rank
    FROM rankings
    ON CONFLICT (user_id, period, category)
    DO UPDATE SET
      score = EXCLUDED.score,
      rank = EXCLUDED.rank,
      updated_at = NOW();
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update leaderboard cache when new typing results are added
DROP TRIGGER IF EXISTS update_leaderboard_on_new_result ON typing_results;
CREATE TRIGGER update_leaderboard_on_new_result
  AFTER INSERT OR UPDATE ON typing_results
  FOR EACH ROW
  EXECUTE FUNCTION update_user_leaderboard_cache();

-- Add unique constraint to prevent duplicate entries
ALTER TABLE leaderboard_cache
ADD CONSTRAINT unique_user_period_category
UNIQUE (user_id, period, category);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_cache_period_category
ON leaderboard_cache (period, category);

-- Function to manually refresh all leaderboard rankings
CREATE OR REPLACE FUNCTION refresh_all_leaderboard_rankings()
RETURNS void AS $$
BEGIN
  -- Trigger the update for a dummy row to refresh all rankings
  INSERT INTO typing_results (
    id,
    user_id,
    wpm,
    accuracy,
    duration,
    text_type,
    created_at
  )
  SELECT
    gen_random_uuid(),
    user_id,
    0,
    0,
    0,
    'refresh',
    NOW()
  FROM users
  LIMIT 1;

  -- Delete the dummy row
  DELETE FROM typing_results WHERE text_type = 'refresh';
END;
$$ LANGUAGE plpgsql; 