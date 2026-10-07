import { redirect } from "next/navigation";
import { readAdminSession } from "@/lib/cms-auth";

export default async function AdminIndexPage() {
  const session = await readAdminSession();
  redirect(session ? "/dashboard" : "/login");
}
