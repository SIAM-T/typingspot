export default function MultiplayerPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Multiplayer Racing
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Race against other typists in real-time! Coming soon with these exciting features:
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Quick Match</h3>
              <p className="mt-2 text-muted-foreground">
                Join a random race with players of similar skill
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Private Rooms</h3>
              <p className="mt-2 text-muted-foreground">
                Create custom races with friends
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Tournaments</h3>
              <p className="mt-2 text-muted-foreground">
                Compete in organized competitions
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Live Rankings</h3>
              <p className="mt-2 text-muted-foreground">
                See your position in real-time during races
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Chat System</h3>
              <p className="mt-2 text-muted-foreground">
                Communicate with other racers in the lobby
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <h3 className="text-lg font-semibold">Spectator Mode</h3>
              <p className="mt-2 text-muted-foreground">
                Watch ongoing races and learn from others
              </p>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-lg text-muted-foreground">
              Want to be notified when multiplayer is ready?{" "}
              <a
                href="mailto:contact@typingspot.com"
                className="text-primary hover:text-primary/90"
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 