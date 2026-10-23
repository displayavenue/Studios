import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/api";

export default async function AdminIndexPage() {
  const session = await getAdminSession();
  redirect(session ? "/dashboard" : "/login");
}
