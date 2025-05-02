import Link from "next/link";
import { MotionDiv, MotionH1, MotionP } from "@/components/motion/MotionWrapper";

const features = [
  {
    name: "Typing Test",
    description: "Measure your typing speed and accuracy with our advanced WPM test.",
    href: "/typing-test",
  },
  {
    name: "Learn to Type",
    description: "Structured lessons from beginner to advanced with real-time feedback.",
    href: "/learn",
  },
  {
    name: "Typing Games",
    description: "Fun and engaging games to improve your typing skills while having fun.",
    href: "/games",
  },
  {
    name: "Multiplayer",
    description: "Challenge friends or compete globally in real-time typing races.",
    href: "/multiplayer",
  },
];

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <MotionH1
                className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Type Fast. Type Smart.
                <br />
                Rule the Keyboard.
              </MotionH1>
              <MotionP
                className="mt-6 text-lg leading-8 text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join millions of typists who have improved their speed and accuracy with TypingSpot.
                Start your journey to keyboard mastery today.
              </MotionP>
              <MotionDiv
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  href="/typing-test"
                  className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Start Typing Test
                </Link>
                <Link href="/learn" className="text-sm font-semibold leading-6">
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Master Your Skills</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to become a typing pro
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            From beginner lessons to advanced typing games, we have all the tools you need to improve
            your typing speed and accuracy.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <MotionDiv
                key={feature.name}
                className="flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                  <Link
                    href={feature.href}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {feature.name}
                  </Link>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-primary"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </MotionDiv>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
