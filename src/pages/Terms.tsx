
import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <PageLayout>
      <motion.div
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
            Terms and Conditions
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8">
              Last Updated: May 1, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">1. Introduction</h2>
            <p>
              Welcome to GreenSteps ("we," "our," or "us"). By accessing or using our website, mobile application, and services (collectively, the "Services"), you agree to be bound by these Terms and Conditions ("Terms").
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">2. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using our Services, you confirm that you accept these Terms and agree to comply with them. If you do not agree with these Terms, you must not use our Services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">3. Changes to Terms</h2>
            <p>
              We may revise these Terms at any time by updating this page. Please check this page regularly to take notice of any changes, as they are binding on you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">4. Account Registration</h2>
            <p>
              To use certain features of the Services, you may need to create an account. You must provide accurate, current, and complete information during the registration process and keep your account information updated.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">5. User Content</h2>
            <p>
              Our Services may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for any content you post on or through the Services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">6. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and disclose information about you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">7. Intellectual Property</h2>
            <p>
              The Services and their original content, features, and functionality are and will remain the exclusive property of GreenSteps and its licensors. The Services are protected by copyright, trademark, and other laws.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">8. Limitation of Liability</h2>
            <p>
              In no event shall GreenSteps, its officers, directors, employees, or agents, be liable to you for any direct, indirect, incidental, special, punitive, or consequential damages whatsoever resulting from any use of the Services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at legal@greensteps.com.
            </p>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Terms;
