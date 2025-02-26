import DashboardLayout from "@/components/layout/dashboard-layout"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome back, User!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Quiz Progress</h3>
            <p className="text-3xl font-bold">75%</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Average Score</h3>
            <p className="text-3xl font-bold">82%</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Flashcards Mastered</h3>
            <p className="text-3xl font-bold">124</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

