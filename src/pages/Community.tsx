
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Community = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Global Community Impact</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Together, GreenSteps users around the world are making a significant impact. Here's what we've accomplished so far.
          </p>

          {/* Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Eco-Actions</CardTitle>
                <CardDescription>Habits logged globally</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">124,568</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Carbon Saved</CardTitle>
                <CardDescription>Estimated reduction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">38.2t</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Active Users</CardTitle>
                <CardDescription>Community members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">5,234</div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Breakdown */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Community Habit Breakdown</CardTitle>
              <CardDescription>Most popular eco-habits logged by our community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🍽️</span>
                      <span className="font-medium">Skipped Meat</span>
                    </div>
                    <span>32,450 logs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚴</span>
                      <span className="font-medium">Used Public Transport</span>
                    </div>
                    <span>28,976 logs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🛍️</span>
                      <span className="font-medium">No-Plastic Day</span>
                    </div>
                    <span>24,112 logs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔄</span>
                      <span className="font-medium">Reused Container</span>
                    </div>
                    <span>21,567 logs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '57%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🚗</span>
                      <span className="font-medium">Carpooling</span>
                    </div>
                    <span>17,463 logs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '46%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Our Collective Environmental Impact</CardTitle>
              <CardDescription>What our community has achieved together</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 text-center">
                  <div className="flex-1 p-4 bg-accent rounded-lg">
                    <div className="text-3xl mb-2">🚿</div>
                    <div className="text-2xl font-bold">3.2M</div>
                    <div className="text-sm text-muted-foreground">Gallons of water saved</div>
                  </div>
                  
                  <div className="flex-1 p-4 bg-accent rounded-lg">
                    <div className="text-3xl mb-2">🌲</div>
                    <div className="text-2xl font-bold">12,450</div>
                    <div className="text-sm text-muted-foreground">Trees equivalent planted</div>
                  </div>
                  
                  <div className="flex-1 p-4 bg-accent rounded-lg">
                    <div className="text-3xl mb-2">♻️</div>
                    <div className="text-2xl font-bold">48.6t</div>
                    <div className="text-sm text-muted-foreground">Plastic waste avoided</div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-center mt-6">
                  Every small action adds up. Together, we're making a measurable difference in creating a more sustainable planet.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Community;
