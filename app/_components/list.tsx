"use client";

import { trpc } from "../trpc/client";

export default function ApplicationList() {
  const { data, isLoading, error } =
    trpc.application.findApplications.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching applications: {error.message}</p>;

  return (
    <div className="space-y-2">
      {data?.map((app) => (
        <div key={app.id} className="rounded border p-4">
          <p>
            <strong>{app.companyName}</strong> — {app.roleTitle}
          </p>
          <p>Location: {app.location}</p>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
}
