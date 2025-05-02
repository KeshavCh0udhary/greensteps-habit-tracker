
import { Check } from "lucide-react";

const FeaturesSection = () => {
  const ecoHabits = [
    { emoji: "🚗", text: "Carpooling" },
    { emoji: "🔄", text: "Reused Container" },
    { emoji: "🍽️", text: "Skipped Meat" },
    { emoji: "🚴", text: "Used Public Transport" },
    { emoji: "🛍️", text: "No-Plastic Day" },
  ];

  return (
    <>
      {/* Features Section */}
      <section className="py-20 md:py-32 bg-accent/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              GreenSteps makes it easy to track and visualize your positive
              environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 eco-card">
              <div className="bg-green-100 dark:bg-green-900/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Log Daily Actions</h3>
              <p className="text-muted-foreground">
                Easily track your eco-friendly habits each day with a simple
                check-in system. No complicated forms to fill.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 eco-card">
              <div className="bg-green-100 dark:bg-green-900/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Visualize Your Impact
              </h3>
              <p className="text-muted-foreground">
                See beautiful charts and statistics showing your environmental
                contribution over time and areas where you excel.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border/50 eco-card">
              <div className="bg-green-100 dark:bg-green-900/20 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Collect badges, maintain streaks, and join achievement clubs as
                you consistently make planet-friendly choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Habit Tracker Preview */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Track habits that make a difference
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our habit tracker focuses on simple everyday actions that can
                collectively make a huge environmental impact when done
                consistently.
              </p>
              <div className="space-y-4">
                {ecoHabits.map((habit) => (
                  <div
                    key={habit.text}
                    className="flex items-center gap-3 p-3 bg-accent/70 rounded-lg"
                  >
                    <div className="bg-white dark:bg-background w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm">
                      {habit.emoji}
                    </div>
                    <span>{habit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/70">
              <div className="bg-muted p-4 flex items-center justify-between border-b border-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="text-sm font-mono text-muted-foreground">
                  GreenSteps Dashboard
                </div>
                <div className="w-12" />
              </div>
              <div className="p-6 space-y-4">
                <h4 className="font-medium text-xl mb-4">Today's Habits</h4>
                {ecoHabits.map((habit, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      index % 2 === 0
                        ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index % 2 === 0
                            ? "bg-green-100 dark:bg-green-800/30"
                            : "bg-muted"
                        }`}
                      >
                        {habit.emoji}
                      </div>
                      <span className="font-medium">{habit.text}</span>
                    </div>
                    {index % 2 === 0 && (
                      <div className="bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
