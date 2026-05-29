import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const PG_URL = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !PG_URL) {
  console.error(
    'Missing env. Need SUPABASE_URL, SUPABASE_SECRET_KEY and DIRECT_URL (or DATABASE_URL).',
  );
  process.exit(1);
}

type Policy = {
  name: string;
  sql: string;
};

type BucketConfig = {
  id: string;
  public: boolean;
};

const STORAGES: BucketConfig[] = [
  {
    id: 'avatars',
    public: true,
  },
];

const policiesFor = (bucket: string): Policy[] => {
  const ownsTopFolder = `bucket_id = '${bucket}' and auth.uid()::text = (storage.foldername(name))[1]`;

  return [
    {
      name: `${bucket} owner insert`,
      sql: `create policy "${bucket} owner insert"
        on storage.objects for insert to authenticated
        with check (${ownsTopFolder})`,
    },
    {
      name: `${bucket} owner update`,
      sql: `create policy "${bucket} owner update"
        on storage.objects for update to authenticated
        using (${ownsTopFolder})`,
    },
    {
      name: `${bucket} owner delete`,
      sql: `create policy "${bucket} owner delete"
        on storage.objects for delete to authenticated
        using (${ownsTopFolder})`,
    },
  ];
};

const createBucket = async (bucket: BucketConfig) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.storage.createBucket(bucket.id, { public: bucket.public });

  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`createBucket "${bucket.id}" failed: ${error.message}`);
  }

  console.log(error ? `Bucket "${bucket.id}" already present.` : `Bucket "${bucket.id}" created.`);
};

const obsoletePoliciesFor = (bucket: string): string[] => [`${bucket} public read`];

const applyPolicies = async (client: Client, bucket: BucketConfig) => {
  for (const name of obsoletePoliciesFor(bucket.id)) {
    await client.query(`drop policy if exists "${name}" on storage.objects`);
  }

  for (const policy of policiesFor(bucket.id)) {
    await client.query(`drop policy if exists "${policy.name}" on storage.objects`);
    await client.query(policy.sql);

    console.log(`Policy "${policy.name}" applied.`);
  }
};

const main = async () => {
  const client = new Client({ connectionString: PG_URL });
  await client.connect();

  try {
    for (const bucket of STORAGES) {
      await createBucket(bucket);
      await applyPolicies(client, bucket);
    }
  } finally {
    await client.end();
  }

  console.log('Storage setup complete.');
};

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
