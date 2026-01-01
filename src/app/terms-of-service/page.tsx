
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsOfServicePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-xl">1. Terms</h3>
            <p>
              By accessing the game Quizsec, you are agreeing to be bound by these terms of service, all
              applicable laws and regulations, and agree that you are responsible for compliance with any applicable
              local laws. If you do not agree with any of these terms, you are prohibited from using or accessing
              this site.
            </p>
            <h3 className="font-semibold text-xl">2. Use License</h3>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on
              Quizsec's website for personal, non-commercial transitory viewing only. This is the grant of a
              license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on Quizsec's website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be
              terminated by Quizsec at any time.
            </p>
            <h3 className="font-semibold text-xl">3. Disclaimer</h3>
            <p>
              The materials on Quizsec's website are provided on an 'as is' basis. Quizsec makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of rights.
            </p>
            <h3 className="font-semibold text-xl">4. Limitations</h3>
            <p>
              In no event shall Quizsec or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on Quizsec's website, even if Quizsec or a Quizsec authorized representative has
              been notified orally or in writing of the possibility of such damage.
            </p>
            <h3 className="font-semibold text-xl">5. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of our operating
              country and you irrevocably submit to the exclusive jurisdiction of the courts in that State or
              location.
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
