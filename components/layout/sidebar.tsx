import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, BookOpen, GraduationCap, BarChart2, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Practice Tests", href: "/practice", icon: BookOpen },
  { name: "Learning Paths", href: "/learning-paths", icon: GraduationCap },
  { name: "Progress", href: "/progress", icon: BarChart2 },
  { name: "Membership", href: "/membership", icon: CreditCard },
]

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0B0F1A] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
        !open && "-translate-x-full",
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-4">
        <div className="flex items-center gap-2">
          <img src="/aws-logo.png" alt="AWS Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold text-white">AWS Cert Prep</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-6">
          <div>
            <div className="mb-2 px-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Main</h2>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 px-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Support</h2>
            </div>
            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div className="border-t border-slate-800 p-4">
        <Button variant="ghost" className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

