export default function LearnPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn to Type
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our comprehensive typing lessons are coming soon! Stay tuned for:
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Beginner Lessons</h3>
              <p className="mt-2 text-muted-foreground">
                Master the home row and basic finger placement
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Advanced Techniques</h3>
              <p className="mt-2 text-muted-foreground">
                Learn shortcuts and improve your typing efficiency
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Programming Mode</h3>
              <p className="mt-2 text-muted-foreground">
                Practice typing code with syntax highlighting
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Custom Lessons</h3>
              <p className="mt-2 text-muted-foreground">
                Create your own lessons with specific text
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Progress Tracking</h3>
              <p className="mt-2 text-muted-foreground">
                Monitor your improvement over time
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <p className="mt-2 text-muted-foreground">
                Earn badges and rewards as you improve
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 