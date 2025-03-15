
// <-- hooks can only be used in client components
import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {

  void trpc.hello.prefetch({text: "a"});
  return (
    <div>
      <HydrateClient>
        <Suspense fallback="loading...">
          <ErrorBoundary fallback={<p>error...</p>}>
            <PageClient />

          </ErrorBoundary>
        </Suspense>

      </HydrateClient>
    </div>
  )
}