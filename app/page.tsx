"use client";

import { trpc } from "./trpc/client";

export default function Home() {
  const { data } = trpc.userList.useQuery();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {JSON.stringify(data)}
    </div>
  );
}
