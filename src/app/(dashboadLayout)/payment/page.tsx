import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PaymentPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const PaymentPage = ({ searchParams }: PaymentPageProps) => {
  const ideaId =
    typeof searchParams?.ideaId === "string" ? searchParams.ideaId : "";

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>
            Complete payment to purchase paid ideas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {ideaId ? (
            <p className="text-sm text-muted-foreground">Idea ID: {ideaId}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No idea selected.</p>
          )}

          <p className="text-sm text-muted-foreground">
            This page is currently a placeholder route so paid idea navigation
            works.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
