import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPartnerReferral, createTask, getActivity, getPartnerReferrals, getPartners, getTasks, getWorkspaceMembers, PartnerInput, savePartner, updatePartnerReferral, updateTaskStatus } from '../api/adminWorkspace';
import { toast } from 'sonner';

const workspaceKeys = {
  partners: (search = '') => ['workspace', 'partners', search] as const,
  tasks: (includeClosed = false) => ['workspace', 'tasks', includeClosed] as const,
  activity: ['workspace', 'activity'] as const,
  referrals: ['workspace', 'referrals'] as const,
};

export function usePartners(search = '') { return useQuery({ queryKey: workspaceKeys.partners(search), queryFn: () => getPartners(search) }); }
export function useAdminTasks(includeClosed = false) { return useQuery({ queryKey: workspaceKeys.tasks(includeClosed), queryFn: () => getTasks(includeClosed) }); }
export function useWorkspaceMembers(enabled = true) { return useQuery({ queryKey: ['workspace', 'members'], queryFn: getWorkspaceMembers, enabled, staleTime: 5 * 60 * 1000 }); }
export function useAdminActivity(enabled = true) { return useQuery({ queryKey: workspaceKeys.activity, queryFn: getActivity, enabled }); }
export function usePartnerReferrals() { return useQuery({ queryKey: workspaceKeys.referrals, queryFn: getPartnerReferrals }); }

export function useSavePartner() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, id }: { input: PartnerInput; id?: string }) => savePartner(input, id),
    onSuccess: () => { client.invalidateQueries({ queryKey: ['workspace', 'partners'] }); client.invalidateQueries({ queryKey: workspaceKeys.activity }); toast.success('Partner saved'); },
    onError: (error: Error) => toast.error(error.message || 'Could not save partner'),
  });
}

export function useUpdateTaskStatus() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: string; status: Parameters<typeof updateTaskStatus>[1] }) => updateTaskStatus(id, status), onSuccess: () => { client.invalidateQueries({ queryKey: ['workspace', 'tasks'] }); client.invalidateQueries({ queryKey: workspaceKeys.activity }); }, onError: () => toast.error('Could not update task') });
}

export function useCreateTask() {
  const client = useQueryClient();
  return useMutation({ mutationFn: createTask, onSuccess: () => { client.invalidateQueries({ queryKey: ['workspace', 'tasks'] }); client.invalidateQueries({ queryKey: workspaceKeys.activity }); toast.success('Task created'); }, onError: () => toast.error('Could not create task') });
}

export function useCreatePartnerReferral() {
  const client = useQueryClient();
  return useMutation({ mutationFn: createPartnerReferral, onSuccess: () => { client.invalidateQueries({ queryKey: workspaceKeys.referrals }); client.invalidateQueries({ queryKey: workspaceKeys.activity }); toast.success('Referral logged'); }, onError: () => toast.error('Could not log referral') });
}

export function useUpdatePartnerReferral() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Parameters<typeof updatePartnerReferral>[1] }) => updatePartnerReferral(id, input), onSuccess: () => { client.invalidateQueries({ queryKey: workspaceKeys.referrals }); client.invalidateQueries({ queryKey: workspaceKeys.activity }); toast.success('Referral updated'); }, onError: (error: Error) => toast.error(error.message || 'Could not update referral') });
}
