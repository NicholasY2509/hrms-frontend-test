export const AUDIT_ENDPOINTS = {
  CONFIG: {
    LOGS: "/v1/audit/configuration/logs",
    TASKS: "/v1/system/configuration/tasks",
    QUEUE_CLEAR: "/v1/system/configuration/tasks/queue/clear",
    QUEUE_RESTART: "/v1/system/configuration/tasks/queue/restart",
  },
} as const
