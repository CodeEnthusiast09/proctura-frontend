"use client";
// src/hooks/common/useCurrentUser.ts
import { useMemo } from "react";
import { retrieveFromLocalStorage } from "@/lib/localStorage";
import type { User } from "@/interfaces";

export function useCurrentUser(): User | null {
  return useMemo(() => retrieveFromLocalStorage<User>("user"), []);
}
