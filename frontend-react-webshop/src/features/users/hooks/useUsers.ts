import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type { UserQueryParams, CreateUserPayload, UpdateUserPayload } from '../types/users.types';

export function useUsers(params?: UserQueryParams) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => usersApi.findAll(params),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      usersApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ id, new_password }: { id: number; new_password: string }) =>
      usersApi.changePassword(id, new_password),
  });
}

export function useUpdateAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      usersApi.updateAvatar(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useRemoveAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersApi.removeAvatar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}
