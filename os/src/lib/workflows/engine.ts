import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { enqueueJob } from "../jobs";

export type WorkflowEvent =
  | "lead.created"
  | "lead.qualified"
  | "assessment.completed"
  | "payment.paid"
  | "proposal.accepted"
  | "booking.created"
  | "invoice.overdue";

type TriggerParams = {
  event: WorkflowEvent;
  organizationId: string;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
  assigneeId?: string | null;
};

/**
 * Lightweight workflow trigger: creates Tasks + Jobs from event rules.
 * Definitions may live in Setting key `workflows` (JSON array) or use built-ins.
 */
export async function triggerWorkflow(params: TriggerParams) {
  const custom = await loadWorkflowDefs();
  const matched = custom.filter((w) => w.event === params.event && w.enabled !== false);
  const defs = matched.length > 0 ? matched : defaultDefsFor(params.event);

  const createdJobs = [];
  const createdTasks = [];

  for (const def of defs) {
    if (def.jobType) {
      const job = await enqueueJob({
        type: def.jobType,
        organizationId: params.organizationId,
        payload: {
          event: params.event,
          entityType: params.entityType,
          entityId: params.entityId,
          ...(params.payload || {}),
          ...(def.jobPayload || {}),
        } as Prisma.InputJsonValue,
        runAfter: def.delayMinutes
          ? new Date(Date.now() + def.delayMinutes * 60_000)
          : undefined,
      });
      createdJobs.push(job);
    }

    if (def.createTask) {
      const task = await prisma.task.create({
        data: {
          organizationId: params.organizationId,
          title: interpolate(def.createTask.title, params),
          priority: def.createTask.priority || "medium",
          status: "open",
          source: `workflow:${params.event}`,
          dueAt: def.createTask.dueInHours
            ? new Date(Date.now() + def.createTask.dueInHours * 3600_000)
            : undefined,
          assigneeId: params.assigneeId || null,
          relatedType: params.entityType || null,
          relatedId: params.entityId || null,
        },
      });
      createdTasks.push(task);
    }
  }

  return { jobs: createdJobs, tasks: createdTasks, event: params.event };
}

type WorkflowDef = {
  event: WorkflowEvent | string;
  enabled?: boolean;
  delayMinutes?: number;
  jobType?: string;
  jobPayload?: Record<string, unknown>;
  createTask?: {
    title: string;
    priority?: string;
    dueInHours?: number;
  };
};

async function loadWorkflowDefs(): Promise<WorkflowDef[]> {
  const row = await prisma.setting.findUnique({ where: { key: "workflows" } });
  if (!row?.value) return [];
  if (Array.isArray(row.value)) return row.value as WorkflowDef[];
  if (typeof row.value === "object" && row.value && Array.isArray((row.value as { items?: unknown }).items)) {
    return (row.value as { items: WorkflowDef[] }).items;
  }
  return [];
}

function defaultDefsFor(event: WorkflowEvent): WorkflowDef[] {
  switch (event) {
    case "lead.created":
      return [
        {
          event,
          jobType: "lead.followup_notify",
          delayMinutes: 30,
          createTask: {
            title: "Follow up new lead {{entityId}}",
            priority: "high",
            dueInHours: 4,
          },
        },
      ];
    case "lead.qualified":
      return [
        {
          event,
          createTask: {
            title: "Book strategy call for qualified lead",
            priority: "high",
            dueInHours: 24,
          },
        },
      ];
    case "assessment.completed":
      return [
        {
          event,
          createTask: {
            title: "Review Growth360 assessment results",
            priority: "medium",
            dueInHours: 12,
          },
        },
      ];
    case "payment.paid":
      return [
        {
          event,
          createTask: {
            title: "Confirm paid booking / proposal next step",
            priority: "high",
            dueInHours: 2,
          },
        },
      ];
    case "proposal.accepted":
      return [
        {
          event,
          jobType: "payment.reminder",
          delayMinutes: 60,
          createTask: {
            title: "Collect proposal payment & start onboarding",
            priority: "critical",
            dueInHours: 8,
          },
        },
      ];
    case "booking.created":
      return [
        {
          event,
          createTask: {
            title: "Prepare strategy call briefing",
            priority: "high",
            dueInHours: 24,
          },
        },
      ];
    case "invoice.overdue":
      return [
        {
          event,
          jobType: "payment.reminder",
          createTask: {
            title: "Chase overdue invoice",
            priority: "critical",
            dueInHours: 4,
          },
        },
      ];
    default:
      return [];
  }
}

function interpolate(template: string, params: TriggerParams) {
  return template
    .replace(/\{\{entityId\}\}/g, params.entityId || "")
    .replace(/\{\{event\}\}/g, params.event)
    .replace(/\{\{organizationId\}\}/g, params.organizationId);
}

export async function listWorkflowDefinitions() {
  const custom = await loadWorkflowDefs();
  if (custom.length > 0) return { source: "setting" as const, workflows: custom };
  const builtIn: WorkflowDef[] = [
    ...defaultDefsFor("lead.created"),
    ...defaultDefsFor("lead.qualified"),
    ...defaultDefsFor("assessment.completed"),
    ...defaultDefsFor("payment.paid"),
    ...defaultDefsFor("proposal.accepted"),
    ...defaultDefsFor("booking.created"),
    ...defaultDefsFor("invoice.overdue"),
  ];
  return { source: "builtin" as const, workflows: builtIn };
}
