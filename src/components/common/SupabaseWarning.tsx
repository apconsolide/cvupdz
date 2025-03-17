import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function SupabaseWarning() {
  return (
    <Alert variant="destructive" className="mb-6 border-red-600">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Supabase Configuration Missing</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">
          Your Supabase environment variables are not configured. Authentication
          and database operations will not work until you set up proper
          credentials.
        </p>
        <p className="mb-4">
          To connect to Supabase, you need to set the following environment
          variables:
          <ul className="list-disc pl-5 mt-2">
            <li>
              <code>VITE_SUPABASE_URL</code>
            </li>
            <li>
              <code>VITE_SUPABASE_ANON_KEY</code>
            </li>
          </ul>
        </p>
        <Button
          variant="outline"
          onClick={() =>
            window.open("https://supabase.com/dashboard", "_blank")
          }
        >
          Go to Supabase Dashboard
        </Button>
      </AlertDescription>
    </Alert>
  );
}
