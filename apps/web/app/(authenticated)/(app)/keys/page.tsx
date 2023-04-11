import { notFound } from "next/navigation";
import { db } from "@/prisma/db";

import { PageHeader } from "@/components/page-header";
import { CreateKeyButton } from "./create-key";
import { DeleteKeyButton } from "./delete-key";
import { getTenantId } from "@/lib/auth";

export default async function Page(_props: { params: { tenantSlug: string } }) {
  const tenantId = getTenantId();
  const tenant = await db.tenant.findUnique({
    where: {
      id: tenantId,
    },
    include: {
      apikeys: true,
    },
  });
  if (!tenant) {
    return notFound();
  }

  return (
    <div className="">
      <PageHeader title="API Keys" actions={[<CreateKeyButton />]} />
      <ul role="list" className="mt-8 space-y-4">
        {tenant.apikeys.map((key) => (
          <li
            key={key.id}
            className="flex items-center justify-between p-4 border rounded border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <span className="px-2 py-1 font-mono text-sm border rounded bg-neutral-50 border-neutral-200 min-w-max dark:bg-neutral-900 dark:border-neutral-700">
                api_XXXXXXXXXXXX{key.lastCharacters}
              </span>
              <p className="mx-1 mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Created on{" "}
                <time dateTime={key.createdAt.toISOString()}>{key.createdAt.toUTCString()}</time>
              </p>
            </div>
            <DeleteKeyButton keyId={key.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
