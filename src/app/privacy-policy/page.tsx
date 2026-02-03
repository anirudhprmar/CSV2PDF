import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <header className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ← Back to home
          </Link>
        </header>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8 md:p-12">
            <article aria-label="Privacy Policy">
              <h1 className="text-3xl md:text-4xl font-bold mb-8">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-8 text-gray-700 dark:text-gray-300">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    1. Introduction
                  </h2>
                  <p className="leading-relaxed">
                    Welcome to CSV2PDF (&apos;we,&apos; &apos;our,&apos; or
                    &apos;us&apos;). We are committed to protecting your personal
                    information and your right to privacy. This Privacy Policy
                    explains how we collect, use, disclose, and safeguard your
                    information when you use our application.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    2. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        A. Personal Information
                      </h3>
                      <p className="leading-relaxed">
                        We collect minimal personal information necessary to provide your account and verify your purchase status. This includes:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li><strong>Identity:</strong> Name, Email address, and Profile Picture (provided via Google Sign-In).</li>
                        <li><strong>Payment Status:</strong> Confirmation of your $5 lifetime purchase (Paid/Not Paid) and subscription ID.</li>
                      </ul>
                      <p className="leading-relaxed mt-2 text-sm text-gray-600 dark:text-gray-400">
                        *We DO NOT store or process your credit card details directly. All payments are securely handled by our payment processor, Polar.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        B. Your Files (Local Storage Only)
                      </h3>
                      <p className="leading-relaxed">
                        <strong>We respect your data privacy.</strong> The CSV files you open and the PDF files you generate are processed entirely locally on your computer.
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>
                          <strong>No File Uploads:</strong> We do not upload your CSV or PDF files to our servers.
                        </li>
                        <li>
                          <strong>Local Storage:</strong> We use <strong>Dexie.js</strong> (a wrapper for IndexedDB) to store your file history and preferences directly in your web browser.
                        </li>
                        <li>
                          <strong>Data Ownership:</strong> You retain full ownership and control of your files. Deleting your browser cache may remove this local history.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        C. Automatically Collected Information
                      </h3>
                      <p className="leading-relaxed">
                        We may collect limited analytical data to improve the service performance:
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>IP address (standard web logging)</li>
                        <li>Browser type and version (to ensure compatibility)</li>
                        <li>Device information</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    3. How We Use Your Information
                  </h2>
                  <p className="leading-relaxed mb-3">
                    We strictly use the collected personal information for:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Authentication:</strong> Logging you in securely via Google Sign-In.</li>
                    <li><strong>License Verification:</strong> Verifying your $5 lifetime purchase to unlock premium features.</li>
                    <li><strong>Communication:</strong> Sending transaction receipts or critical service updates.</li>
                    <li><strong>Improvement:</strong> Improving the application performance based on anonymous usage patterns.</li>
                  </ul>
                  <p className="leading-relaxed mt-3 text-sm italic">
                    We do NOT use your personal information interfering with your local CSV files or PDF conversions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    4. Data Sharing and Disclosure
                  </h2>
                  <p className="leading-relaxed mb-3">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>With your consent:</strong> We may share your
                      information for any purpose with your explicit consent
                    </li>
                    <li>
                      <strong>Service providers:</strong> We share data with
                      third-party vendors who assist in providing our services
                    </li>
                    <li>
                      <strong>Legal requirements:</strong> We may disclose
                      information if required by law or valid legal process
                    </li>
                    <li>
                      <strong>Business transfers:</strong> In connection with any
                      merger, sale, or acquisition
                    </li>
                    <li>
                      <strong>Protection of rights:</strong> To protect our
                      rights, privacy, safety, or property
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    5. Third-Party Services
                  </h2>
                  <p className="leading-relaxed">
                    We use the following third-party services that may collect
                    information:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>
                      <strong>Google Sign-In:</strong> For authentication services
                    </li>
                    <li>
                      <strong>Payment processors:</strong> For handling
                      subscription payments
                    </li>
                    <li>
                      <strong>Analytics services:</strong> To understand service
                      usage
                    </li>
                  </ul>
                  <p className="mt-3 leading-relaxed">
                    These services have their own privacy policies governing the
                    use of your information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    6. Data Security
                  </h2>
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational security
                    measures to protect your personal information. However, no
                    method of transmission over the Internet or electronic storage
                    is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    7. Data Retention
                  </h2>
                  <p className="leading-relaxed">
                    We retain your personal information for as long as necessary
                    to provide our services and fulfill the purposes outlined in
                    this Privacy Policy. We will also retain and use your
                    information to comply with legal obligations, resolve
                    disputes, and enforce our agreements.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    8. Your Rights
                  </h2>
                  <p className="leading-relaxed mb-3">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      <strong>Access:</strong> Request access to your personal
                      information
                    </li>
                    <li>
                      <strong>Correction:</strong> Request correction of
                      inaccurate information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your personal
                      information
                    </li>
                    <li>
                      <strong>Portability:</strong> Request a copy of your data in
                      a portable format
                    </li>
                    <li>
                      <strong>Objection:</strong> Object to certain processing of
                      your information
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    9. Children&apos;s Privacy
                  </h2>
                  <p className="leading-relaxed">
                    Our service is not intended for children under 13 years of
                    age. We do not knowingly collect personal information from
                    children under 13. If you are a parent or guardian and believe
                    your child has provided us with personal information, please
                    contact us.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    10. International Data Transfers
                  </h2>
                  <p className="leading-relaxed">
                    Your information may be transferred to and processed in
                    countries other than your country of residence. These
                    countries may have data protection laws that are different
                    from the laws of your country.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    11. Updates to This Policy
                  </h2>
                  <p className="leading-relaxed">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any changes by posting the new Privacy Policy on
                    this page and updating the &apos;Last updated&apos; date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    12. Contact Us
                  </h2>
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy or our
                    data practices, please contact us at:
                  </p>
                  <div className="mt-3 space-y-1">
                    <p>Email: anirudhparmar2004@gmail.com</p>
                  </div>
                </section>
              </div>
            </article>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
