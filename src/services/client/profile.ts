import { api } from "@/lib/axios";

export interface UpdateMePayload {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  updateMe: (payload: UpdateMePayload) => api.patch("/me", payload),
  changePassword: (payload: ChangePasswordPayload) =>
    api.post("/me/change-password", payload),
};
