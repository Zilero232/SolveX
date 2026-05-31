import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing env. Need SUPABASE_URL and SUPABASE_SECRET_KEY.');

  process.exit(1);
}

type BucketConfig = {
  id: string;
  public: boolean;
};

const STORAGES: BucketConfig[] = [
  {
    id: 'avatars',
    public: true,
  },
  {
    id: 'chat-attachments',
    public: true,
  },
];

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

const main = async () => {
  for (const bucket of STORAGES) {
    await createBucket(bucket);
  }

  console.log('Storage setup complete.');
};

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
