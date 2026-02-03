import { api } from "~/trpc/server";
import PreviewClient from "./_components/PreviewClient";

export default async function PreviewPage() {
  // Server-side auth check
  const isAuthenticated = await api.user.isAuthenticated();

  // Only check payment if authenticated
  let hasPurchased = false;
  if (isAuthenticated) {
    try {
      hasPurchased = await api.payment.hasUserPurchased() ?? false;
    } catch {
      hasPurchased = false;
    }
  }

  return (
    <PreviewClient
      isAuthenticated={isAuthenticated}
      hasPurchased={hasPurchased}
    />
  );
}
