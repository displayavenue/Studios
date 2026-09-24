import { redirect } from "next/navigation";
import { getSession } from "@/lib/api";

export default async function DoctorIndexPage() {
  const session = await getSession();
  redirect(session ? "/dashboard" : "/login");
}
