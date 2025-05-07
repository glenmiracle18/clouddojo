import { SearchXIcon, CheckCircle2, Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { LsSubscriptionPlan } from "@prisma/client";
import { Section } from "./section";
import { SignupButton } from "./subscribe";

export function Plan({
  plan,
  currentPlan = null,
  isChangingPlans = false,
  isPopular = false,
  onSubscribeComplete,
}: {
  plan: LsSubscriptionPlan;
  currentPlan?: LsSubscriptionPlan | null;
  isChangingPlans?: boolean;
  isPopular?: boolean;
  onSubscribeComplete?: () => void;
}) {
  const { id, productName, interval, name, price } = plan;
  const isCurrent = id && currentPlan?.id === id;
  
  // Predefined features based on plan type
  const getFeatures = () => {
    if (productName?.toLowerCase().includes('pro') && name?.toLowerCase().includes('premium')) {
      return [
        "Everything included in the Pro Plan",
        "Advanced analytics",
        "AI-powered explanations",
        "Realistic mock interviews",
        "Personalized study roadmap",
        "Access to discord/whatsapp community",
      ];
    } else if (productName?.toLowerCase().includes('pro')) {
      return [
        "Unlimited access to all practice tests",
        "Track your progress and identify weak areas",
        "Flashcard system to memorize key concepts faster",
        "Downloadable PDF reports to review anytime",
        "Fast-track your certification preparation",
      ];
    }
    return [];
  };

  const features = getFeatures();

  return (
    <Section className={cn(
      "not-prose p-6 rounded-2xl max-w-sm shadow-md border border-surface-100 bg-white dark:bg-zinc-900 relative overflow-hidden",
      isCurrent && "border-emerald-400",
      isPopular && "border-emerald-400 shadow-lg"
    )}>
      {isPopular && (
        <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1">
          <Star className="w-3 h-3" />
          Most Popular
        </div>
      )}
      
      <Section.Item className="flex-col items-start gap-4">
        <header className="flex w-full flex-col items-start mb-4">
          {name ? (
            <h2 className="text-2xl font-bold text-surface-900 dark:text-zinc-100">
              {productName} <span className="font-normal text-zinc-500">({name})</span>
            </h2>
          ) : null}
          
          <div className="mt-6 mb-2 text-3xl font-bold text-amber-900 dark:text-zinc-100">
            {formatPrice(price)}
            <span className="text-base font-normal text-zinc-500 ml-1">
              {!plan.isUsageBased && interval ? `per ${interval}` : null}
              {plan.isUsageBased && interval ? `/unit per ${interval}` : null}
            </span>
          </div>
        </header>
        
        {features.length > 0 && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-emerald-600">🔥 Everything you need to pass your AWS exam</span>
          </div>
        )}
        
        {features.length > 0 ? (
          <ul className="mb-6 space-y-3 w-full">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Section.Item>

      <SignupButton
        className={cn("w-full mt-4", 
          isPopular ? "bg-emerald-600 hover:bg-emerald-700" : "")}
        plan={plan}
        isChangingPlans={isChangingPlans}
        currentPlan={currentPlan}
        onComplete={onSubscribeComplete}
      />
    </Section>
  );
}

export function NoPlans() {
  return (
    <section className="prose mt-[10vw] flex flex-col items-center justify-center">
      <span className="flex size-24 items-center justify-center rounded-full bg-wg-red-50/70">
        <SearchXIcon
          className="text-wg-red"
          aria-hidden="true"
          size={48}
          strokeWidth={0.75}
        />
      </span>

      <p className="max-w-prose text-balance text-center leading-6 text-gray-500">
        There are no plans available at the moment.
      </p>
    </section>
  );
}

