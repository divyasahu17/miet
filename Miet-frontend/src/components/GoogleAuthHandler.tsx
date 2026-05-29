"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("user_token", token);

      // Clean URL
      window.history.replaceState({}, document.title, "/");

      router.push("/dashboard");
    }
  }, [searchParams]);

  return null;
}
