export const readErrorMessage = async (res: Response): Promise<string | null> => {
  try {
    const body = (await res.json()) as { error?: string } | null;

    return body?.error ?? null;
  } catch {
    return null;
  }
};
