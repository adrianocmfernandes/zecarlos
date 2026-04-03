import { Suspense } from "react";
import { PipelineSection } from "@/components/dashboard/pipeline-section";
import { TaskList } from "@/components/dashboard/task-list";
import { InstallationsList } from "@/components/dashboard/installations-list";
import { Metrics } from "@/components/dashboard/metrics";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <Metrics />
      <Suspense fallback={<p>A carregar pipeline...</p>}>
        <PipelineSection />
      </Suspense>
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<p>A carregar tarefas...</p>}>
          <TaskList />
        </Suspense>
        <Suspense fallback={<p>A carregar instalações...</p>}>
          <InstallationsList />
        </Suspense>
      </div>
    </div>
  );
}
