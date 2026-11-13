import { Mail } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";

export function ConnectPage({ message }: { message?: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardBody className="py-12 text-center">
          <Mail className="h-10 w-10 text-accent mx-auto mb-6" />
          <h1 className="text-2xl font-bold uppercase tracking-wide">Mail Cleaner</h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Nettoyez votre boite Gmail des notifications inutiles et perimees.
          </p>
          <div className="mt-8">
            <Button size="lg" className="w-full" onClick={() => { window.location.href = "/auth/google/start"; }}>
              Connecter Gmail
            </Button>
          </div>
          {message && <p className="mt-6 text-sm text-status-success">{message}</p>}
          <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
            Tokens chiffres au repos. Aucun corps de mail stocke.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
