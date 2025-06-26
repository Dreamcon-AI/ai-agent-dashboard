import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      const session = await getSession();

      if (!session?.user?.company) {
        router.push("/auth/login"); // fallback
        return;
      }

      const company = session.user.company.toLowerCase();

      if (company.includes("zochert")) router.push("/dashboard/zochert");
      else if (company.includes("hargrove")) router.push("/dashboard/hargrove");
      else if (company.includes("s&s") || company.includes("ss")) router.push("/dashboard/ss");
      else router.push("/dashboard/default");
    }

    redirect();
  }, [router]);

  return null;
}
