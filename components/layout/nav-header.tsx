import { Menu, Search, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface NavHeaderProps {
  onMenuClick: () => void
}

export function NavHeader({ onMenuClick }: NavHeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-[#0B0F1A]">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-6 w-6 text-slate-400" />
          </Button>
          <div className="relative flex w-96 items-center">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Quick search..."
              className="h-9 w-full bg-slate-900 pl-9 text-sm text-slate-400 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-sm text-slate-400 lg:flex">
            <span>Tuesday, January 17, 2024</span>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-400">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              <Image
                src="https://avatars.githubusercontent.com/u/1?v=4"
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-sm font-medium text-slate-200">John Doe</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

