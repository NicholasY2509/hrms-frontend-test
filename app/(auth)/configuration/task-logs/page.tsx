import { Metadata } from "next"
import { TaskLogClient } from "./components/task-log-client"

export const metadata: Metadata = {
  title: "Task Logs",
  description:
    "View all background tasks and scheduled job executions.",
}

export default function TaskLogsPage() {
  return <TaskLogClient />
}
