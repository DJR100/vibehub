export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="pixel-text mb-8 text-3xl font-bold">
          Privacy <span className="text-primary">Policy</span>
        </h1>

        <div className="rounded-lg border border-gray-800 bg-card p-6 space-y-6">
          <section>
            <h2 className="pixel-text mb-4 text-xl font-bold text-primary">Introduction</h2>
            <p className="text-gray-300">
              At VibeHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="pixel-text mb-4 text-xl font-bold text-primary">Information We Collect</h2>
            <p className="text-gray-300 mb-4">We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Create an account</li>
              <li>Upload or play games</li>
              <li>Participate in community features</li>
              <li>Contact us or provide feedback</li>
              <li>Respond to surveys or promotions</li>
            </ul>
          </section>

          <section>
            <h2 className="pixel-text mb-4 text-xl font-bold text-primary">How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
              <li>Monitor and analyze trends and usage</li>
            </ul>
          </section>

          <section>
            <h2 className="pixel-text mb-4 text-xl font-bold text-primary">Feedback Information</h2>
            <p className="text-gray-300">
              When you provide feedback through our platform, we collect the content of your feedback along with any
              categories you select. This information is linked to your account and helps us improve VibeHub. We may use
              anonymized feedback for product development and to share general insights with the community.
            </p>
          </section>

          <section>
            <h2 className="pixel-text mb-4 text-xl font-bold text-primary">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at privacy@vibehub.example.com.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4 border-t border-gray-800 mt-6">Last updated: March 2025</p>
        </div>
      </div>
    </div>
  )
}

