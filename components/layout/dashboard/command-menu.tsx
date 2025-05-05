"use client"

import * as React from "react"
import {
  BookOpen,
  Code2,
  GraduationCap,
  MessageSquare,
  Settings,
  Trophy,
  User,
  Brain,
  Target,
  Clock,
  History,
  Home,
} from "lucide-react"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useFeedbackStore } from "@/store/use-feedback-store"
import { useCommandMenuStore } from "@/store/use-command-menu-store"

export function CommandMenu() {
  const router = useRouter()
  const { setIsOpen: setFeedbackOpen } = useFeedbackStore()
  const { isOpen, setIsOpen, toggle } = useCommandMenuStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [toggle])

  return (
    <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Dashboard">
          <CommandItem onSelect={() => router.push("/dashboard")}>
            <Home className="mr-2 h-4 w-4 text-emerald-700" />
            <span>Home</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Practice">
          <CommandItem onSelect={() => router.push("/dashboard/practice")}>
            <Brain className="mr-2 h-4 w-4 text-emerald-700" />
            <span>Practice Tests</span>
          </CommandItem>
          <CommandItem onSelect={() => router.push("/dashboard/practice")}>
            <Clock className="mr-2 h-4 w-4 text-emerald-700" />
            <span>Quick Practice</span>
          </CommandItem>
          <CommandItem 
            disabled 
            onSelect={() => {}} 
            className="opacity-50 cursor-not-allowed"
          >
            <Code2 className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Coding Challenges</span>
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Personal">
          <CommandItem disabled onSelect={() => {}} className="opacity-50 cursor-not-allowed">
            <Trophy className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Achievements</span>
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </CommandItem>
          <CommandItem onSelect={() => router.push("/dashboard/profile")}>
            <User className="mr-2 h-4 w-4 text-emerald-700" />
            <span>Profile Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Learning">
          <CommandItem disabled onSelect={() => {}} className="opacity-50 cursor-not-allowed">
            <Target className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Learning Roadmap</span>
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </CommandItem>
          <CommandItem disabled onSelect={() => {}} className="opacity-50 cursor-not-allowed">
            <BookOpen className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Courses</span>
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </CommandItem>
          <CommandItem disabled onSelect={() => {}} className="opacity-50 cursor-not-allowed">
            <GraduationCap className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Hands-on Labs</span>
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Support">
          <CommandItem onSelect={() => setFeedbackOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4 text-emerald-700" />
            <span>Send Feedback</span>
          </CommandItem>
          <CommandItem disabled onSelect={() => {}} className="opacity-50 cursor-not-allowed">
            <Settings className="mr-2 h-4 w-4 text-emerald-500" />
            <span>Settings</span>
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 