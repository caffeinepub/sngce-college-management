import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AcademicRecord, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

// ── Public queries ─────────────────────────────────────

export function useAllCourses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllFeeStructures() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["feeStructures"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeeStructures();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFacultyDirectory() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["faculty"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFacultyDirectory();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Student queries ────────────────────────────────────

export function useAttendanceByStudent(studentId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["attendance", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getAttendanceByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useMarksByStudent(studentId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["marks", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getMarksByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useExamTimetable(department: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["exams", department],
    queryFn: async () => {
      if (!actor || !department) return [];
      return actor.getExamTimetableByDepartment(department);
    },
    enabled: !!actor && !isFetching && !!department,
  });
}

export function useFeesDue(studentId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["feesDue", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return [];
      return actor.getFeesDueByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useStudentRecord(studentId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["studentRecord", studentId],
    queryFn: async () => {
      if (!actor || !studentId) return null;
      return actor.getStudentRecord(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

// ── Mutations ──────────────────────────────────────────

export function useSaveAcademicRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      record,
    }: { studentId: string; record: AcademicRecord }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addOrUpdateAcademicRecord(studentId, record);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["studentRecord", variables.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance", variables.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["marks", variables.studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["feesDue", variables.studentId],
      });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
  });
}

// ── Chatbot ────────────────────────────────────────────

export function useChatbotResponse() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.getChatbotResponse(message);
    },
  });
}
