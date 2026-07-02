import { cookies } from "next/headers";

export const SPACE_COOKIE = "space-mode";

// Next 15: cookies() is ASYNC — must await. No cookie (bots, first visit) => false => classic.
export async function getSpaceMode(): Promise<boolean> {
  const store = await cookies();
  return store.get(SPACE_COOKIE)?.value === "on";
}
