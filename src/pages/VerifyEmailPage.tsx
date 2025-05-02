
import PageLayout from "@/components/layout/PageLayout";
import VerifyEmail from "@/components/auth/VerifyEmail";

const VerifyEmailPage = () => {
  return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <VerifyEmail />
      </div>
    </PageLayout>
  );
};

export default VerifyEmailPage;
