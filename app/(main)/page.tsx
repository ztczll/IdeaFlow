import { RequirementsTable } from "@/components/requirements/RequirementsTable";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-h1 font-display mb-6">需求管理</h1>
      <RequirementsTable />
    </div>
  );
}

