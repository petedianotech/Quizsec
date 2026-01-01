
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. It is Quizsec's policy to respect your privacy regarding any
              information we may collect from you across our website, and other sites we own and operate.
            </p>
            <h3 className="font-semibold text-xl">1. Information We Collect</h3>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We collect it
              by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it
              and how it will be used. The information we collect may include:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Account Information:</strong> When you register for an account, we may ask for your email
                address and a username.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect information about your interactions with our game, such as
                your quiz scores, level progress, and session times. This is used to save your progress and improve
                the game.
              </li>
              <li>
                <strong>Device Information:</strong> We may collect basic device information, but we do not track your location.
              </li>
            </ul>
            <h3 className="font-semibold text-xl">2. How We Use Your Information</h3>
            <p>
              We use the information we collect to operate, maintain, and provide the features and functionality of
              the game. This includes tracking your progress, personalizing your experience, and for analytics
              purposes to improve our service.
            </p>
            <h3 className="font-semibold text-xl">3. Security</h3>
            <p>
              We take the security of your data seriously and use commercially acceptable means to protect it. All
              data is stored securely in Firebase and protected by security rules to prevent unauthorized access.
            </p>
            <h3 className="font-semibold text-xl">4. Your Consent</h3>
            <p>
              By using our game, you hereby consent to our Privacy Policy and agree to its terms.
            </p>
            <h3 className="font-semibold text-xl">5. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
             <div className="pt-4 text-center">
                <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
