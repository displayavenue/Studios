import { jsonOk } from "@/lib/api";

export async function POST() {
  const res = jsonOk({ loggedOut: true });
  res.cookies.set("g360_admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
