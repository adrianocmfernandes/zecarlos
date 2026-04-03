import { PipelineSection } from "@/components/dashboard/pipeline-section";
import { TaskList } from "@/components/dashboard/task-list";
import { InstallationsList } from "@/components/dashboard/installations-list";
import { Metrics } from "@/components/dashboard/metrics";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Metrics />
      <PipelineSection />
      <div className="grid gap-4 md:grid-cols-2">
        <TaskList />
        <InstallationsList />
      </div>
    </div>
  );
}
