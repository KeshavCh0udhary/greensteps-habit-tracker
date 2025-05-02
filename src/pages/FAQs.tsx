
import PageLayout from "@/components/layout/PageLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What is GreenSteps?",
    answer: "GreenSteps is an app that helps you track your daily eco-friendly habits and visualize your positive environmental impact over time. It's designed to make sustainable living easier through habit tracking, community support, and gamification."
  },
  {
    question: "How do I get started with GreenSteps?",
    answer: "Getting started is easy! Simply create an account, choose the eco-habits you want to track, and start logging your daily actions. You'll immediately begin to see your impact grow over time through our visualization tools."
  },
  {
    question: "Is GreenSteps free to use?",
    answer: "Yes! GreenSteps offers a free tier with core habit tracking features. We also offer a premium subscription with advanced analytics, custom habit creation, and enhanced community features."
  },
  {
    question: "How are eco-points calculated?",
    answer: "Eco-points are calculated based on the estimated environmental benefit of each action. For example, using public transportation instead of driving alone earns points based on average carbon emission reductions. Our calculation methodology was developed with environmental scientists and is regularly updated."
  },
  {
    question: "Can I create my own custom habits to track?",
    answer: "Yes! While we provide a starter set of common eco-habits, you can create and track your own custom eco-friendly actions that fit your lifestyle."
  },
  {
    question: "How does the streak system work?",
    answer: "Streaks are counted when you log at least one eco-friendly habit each day. Missing a day will reset your current streak, but we'll always remember your longest streak so you can try to beat your record!"
  },
  {
    question: "Is my data private?",
    answer: "Your personal data and individual habit logs are completely private. We only share anonymized, aggregate statistics in the community section to show collective impact."
  },
  {
    question: "Can I connect with friends on GreenSteps?",
    answer: "Absolutely! You can add friends, create or join groups, and participate in eco-challenges together. You can also choose to share specific achievements on social media."
  }
];

const FAQs = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about GreenSteps and sustainable living
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default FAQs;
