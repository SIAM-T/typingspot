export default function GamesPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Typing Games
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Fun and engaging typing games are coming soon! Here's what to expect:
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Word Rain</h3>
              <p className="mt-2 text-muted-foreground">
                Type words before they hit the ground
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Type Defense</h3>
              <p className="mt-2 text-muted-foreground">
                Defend your base by typing enemy words
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Speed Runner</h3>
              <p className="mt-2 text-muted-foreground">
                Race against time with increasing difficulty
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Word Battle</h3>
              <p className="mt-2 text-muted-foreground">
                Compete with other players in real-time
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Type Story</h3>
              <p className="mt-2 text-muted-foreground">
                Interactive story where your typing affects the outcome
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Daily Challenge</h3>
              <p className="mt-2 text-muted-foreground">
                New typing challenges every day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 