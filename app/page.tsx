"use client";

import { useAuth } from "@clerk/nextjs";
import { trpc } from "./trpc/client";

export default function Home() {
  const { isSignedIn } = useAuth();
  const { data } = trpc.userList.useQuery(undefined, {
    enabled: isSignedIn,
    retry: false,
  });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {JSON.stringify(data)}
    </div>
  );
}
