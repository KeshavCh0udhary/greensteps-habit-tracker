
import PageLayout from "@/components/layout/PageLayout";
import { motion } from "framer-motion";

const Privacy = () => {
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
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8">
              Last Updated: May 1, 2025
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">1. Introduction</h2>
            <p>
              At GreenSteps, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Services").
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, update your profile, use our interactive features, participate in contests or surveys, or communicate with us.
            </p>
            <p>
              This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal information (name, email address)</li>
              <li>User content (eco-habit logs, notes, comments)</li>
              <li>Usage data (activities on our Services)</li>
              <li>Device information (IP address, browser type, operating system)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">3. How We Use Your Information</h2>
            <p>
              We may use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Create and update your account</li>
              <li>Process transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Develop new products and services</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">4. Sharing of Information</h2>
            <p>
              We may share information about you as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With vendors, consultants, and service providers who need access to such information to carry out work on our behalf</li>
              <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of GreenSteps or others</li>
              <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">5. Your Choices</h2>
            <p>
              You have several choices regarding the use of information on our Services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account Information: You may update, correct, or delete information about you at any time by logging into your account settings</li>
              <li>Cookies: Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject browser cookies</li>
              <li>Promotional Communications: You may opt out of receiving promotional communications from us by following the instructions in those communications</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">6. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">7. Changes to this Privacy Policy</h2>
            <p>
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice (such as adding a statement to our website or sending you a notification).
            </p>
            
            <h2 className="text-2xl font-semibold mt-12 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@greensteps.com.
            </p>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Privacy;
