import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const mockMarketplaceQuizzes = [
  { id: 1, title: "AWS Solutions Architect Associate", author: "AWS Expert", price: 19.99, rating: 4.5 },
  { id: 2, title: "AWS Developer Associate", author: "Cloud Guru", price: 24.99, rating: 4.7 },
  { id: 3, title: "AWS SysOps Administrator", author: "DevOps Master", price: 29.99, rating: 4.6 },
]

export default function Marketplace() {
  return (
    <DashboardLayout>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Quiz Marketplace</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockMarketplaceQuizzes.map((quiz) => (
            <div key={quiz.id} className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
              <p className="text-sm text-gray-500 mb-2">By {quiz.author}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">${quiz.price.toFixed(2)}</span>
                <span className="text-yellow-500">★ {quiz.rating}</span>
              </div>
              <Button asChild className="w-full">
                <Link href={`/marketplace/${quiz.id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

