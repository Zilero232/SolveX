type RaceResult<T> = { ok: true; value: T } | { ok: false; reason: 'timeout' };

const wrapWork = async <T>(promise: Promise<T>): Promise<RaceResult<T>> => {
  const value = await promise;

  return { ok: true, value };
};

const wrapTimeout = <T>(timeoutMs: number) =>
  new Promise<RaceResult<T>>((resolve) => {
    setTimeout(() => resolve({ ok: false, reason: 'timeout' }), timeoutMs);
  });

export const raceWithTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<RaceResult<T>> => Promise.race([wrapWork(promise), wrapTimeout<T>(timeoutMs)]);
