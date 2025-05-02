
import PageLayout from "@/components/layout/PageLayout";

const About = () => {
  return (
    <PageLayout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">About GreenSteps</h1>
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p>
                GreenSteps was founded with a simple mission: to make
                environmental action accessible, measurable, and rewarding for
                everyone. We believe that small, consistent actions can
                collectively lead to meaningful change for our planet.
              </p>

              <h2>Our Mission</h2>
              <p>
                To empower individuals to take meaningful environmental action
                through everyday habits, while providing clear visualization of
                their positive impact and fostering a community of like-minded
                eco-conscious people.
              </p>

              <h2>How It Works</h2>
              <p>
                GreenSteps focuses on simple daily actions that anyone can
                incorporate into their routines. Each eco-friendly habit you log
                earns you points and contributes to your environmental impact
                score. Over time, you can:
              </p>

              <ul>
                <li>Track your progress through beautiful visualizations</li>
                <li>
                  Earn badges and achievements as you maintain consistent habits
                </li>
                <li>
                  See your contribution as part of our global community effort
                </li>
                <li>Challenge yourself to maintain longer streaks</li>
              </ul>

              <h2>The Science Behind It</h2>
              <p>
                Each habit in GreenSteps is carefully researched for its
                environmental impact. When you skip meat for a day, carpool
                instead of driving alone, or avoid single-use plastics, you're
                making a measurable difference in reducing carbon emissions and
                waste.
              </p>
              <p>
                Our team works with environmental scientists to calculate the
                approximate impact of each action, which we translate into
                eco-points within the app.
              </p>

              <h2>Join Our Community</h2>
              <p>
                GreenSteps is more than just an app – it's a community of
                people committed to making a difference. By joining, you'll be
                part of a global movement working toward a more sustainable
                future, one small step at a time.
              </p>

              <p>
                Ready to start your eco-journey? Sign up today and take your
                first green steps toward a better planet!
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
