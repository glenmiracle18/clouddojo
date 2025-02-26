import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    period: "month",
    features: ["Access to all practice tests", "Basic progress tracking", "Community forum access"],
  },
  {
    name: "Pro",
    price: "$19.99",
    period: "month",
    features: [
      "All Basic features",
      "Personalized study plans",
      "Advanced analytics",
      "1-on-1 expert consultation (1 hour/month)",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49.99",
    period: "month",
    features: [
      "All Pro features",
      "Unlimited 1-on-1 expert consultations",
      "Custom practice test creation",
      "Team management and reporting",
    ],
  },
]

export default function MembershipPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Choose Your Membership Plan</h1>
        <p className="mt-2 text-xl text-slate-400">
          Unlock premium features to accelerate your AWS certification journey
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`flex flex-col border-slate-700 ${
              plan.popular ? "bg-blue-600 text-white" : "bg-slate-800/50 text-slate-200"
            }`}
          >
            <CardHeader>
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              {plan.popular && (
                <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-blue-800">
                  Most Popular
                </span>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-lg">/{plan.period}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-slate-100"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Choose Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

