import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const kbdVariants = cva(
  "inline-flex w-fit items-center gap-1 font-medium font-mono text-[10px] text-foreground/70 sm:text-[11px]",
  {
    variants: {
      size: {
        default: "h-6 rounded px-1.5",
        sm: "h-5 rounded-sm px-1",
        lg: "h-7 rounded-md px-2",
      },
      variant: {
        default: "bg-accent",
        outline:
          "bg-background px-0 [&_[data-slot='kbd-key']]:min-w-[20px] [&_[data-slot='kbd-key']]:border [&_[data-slot='kbd-key']]:border-border [&_[data-slot='kbd-key']]:bg-muted/30 [&_[data-slot='kbd-key']]:px-1.5 [&_[data-slot='kbd-key']]:shadow-xs",
        ghost: "bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

interface KbdRootProps
  extends React.ComponentProps<"kbd">,
    VariantProps<typeof kbdVariants> {
  asChild?: boolean;
}

/**
 * Render a styled keyboard container that groups key elements and supports size and visual variants.
 *
 * @param variant - Visual variant of the container; controls background, border, and nested key styling (e.g., "default", "outline", "ghost").
 * @param size - Size variant for spacing and radius (e.g., "sm", "default", "lg").
 * @param asChild - If true, renders using a Slot to delegate rendering to a child element; otherwise renders a native `kbd` element.
 * @param className - Additional class names to apply to the root element.
 * @returns The rendered keyboard root element with role="group" and data-slot="kbd".
 */
function KbdRoot({
  variant = "default",
  size = "default",
  asChild,
  className,
  ...rootProps
}: KbdRootProps) {
  const RootPrimitive = asChild ? Slot : "kbd";

  return (
    <RootPrimitive
      role="group"
      data-slot="kbd"
      {...rootProps}
      className={cn(kbdVariants({ size, variant, className }))}
    />
  );
}

const KEY_DESCRIPTIONS: Record<string, string> = {
  "⌘": "Command",
  "⇧": "Shift",
  "⌥": "Option",
  "⌃": "Control",
  Ctrl: "Control",
  "⌫": "Backspace",
  "⎋": "Escape",
  "↩": "Return",
  "⇥": "Tab",
  "⌤": "Enter",
  "↑": "Arrow Up",
  "↓": "Arrow Down",
  "←": "Arrow Left",
  "→": "Arrow Right",
  "⇪": "Caps Lock",
  fn: "Function",
  "⌦": "Delete",
  "⇞": "Page Up",
  "⇟": "Page Down",
  "↖": "Home",
  "↘": "End",
  "↕": "Page Up/Down",
  "↔": "Left/Right",
} as const;

interface KbdKeyProps extends React.ComponentProps<"span"> {
  asChild?: boolean;
}

/**
 * Renders an individual keyboard key element with an accessible title and optional asChild rendering.
 *
 * The displayed title for the key is `titleProp` if provided, otherwise a human-friendly description is looked up from `KEY_DESCRIPTIONS` using the key's text, and finally falls back to the key text. The element is wrapped in an `<abbr>` (providing the title tooltip/accessibility) and the inner element is either a Radix `Slot` when `asChild` is true or a `span` when false. Applies `data-slot="kbd-key"` and base key styling; additional `className` and other span props are forwarded.
 *
 * @param asChild - If true, render the key using a Slot primitive instead of a native `span`.
 * @param titleProp - Explicit title to use for the key; overrides description lookup and text fallback.
 */
function KbdKey({
  asChild,
  className,
  children,
  title: titleProp,
  ...keyProps
}: KbdKeyProps) {
  const keyText = children?.toString() ?? "";
  const title = titleProp ?? KEY_DESCRIPTIONS[keyText] ?? keyText;

  const KeyPrimitive = asChild ? Slot : "span";

  return (
    <abbr title={title} className="no-underline">
      <KeyPrimitive
        data-slot="kbd-key"
        {...keyProps}
        className={cn(
          "inline-flex items-center justify-center rounded",
          className,
        )}
      >
        {children}
      </KeyPrimitive>
    </abbr>
  );
}

interface KbdSeparatorProps extends React.ComponentProps<"span"> {
  asChild?: boolean;
}

/**
 * Renders a keyboard key separator (defaults to "+") with appropriate accessibility attributes.
 *
 * @param asChild - If true, render using the provided child element instead of a `span`.
 * @param children - Content to display inside the separator; defaults to `"+"`.
 * @param className - Additional CSS classes applied to the separator element.
 * @returns A React element representing a keyboard separator with role, aria attributes, and styling.
 */
function KbdSeparator({
  asChild,
  children = "+",
  className,
  ...separatorProps
}: KbdSeparatorProps) {
  const SeparatorPrimitive = asChild ? Slot : "span";

  return (
    <SeparatorPrimitive
      role="separator"
      aria-orientation="horizontal"
      aria-hidden="true"
      data-slot="kbd-separator"
      {...separatorProps}
      className={cn("text-foreground/70", className)}
    >
      {children}
    </SeparatorPrimitive>
  );
}

const Kbd = KbdRoot;
const Root = KbdRoot;
const Key = KbdKey;
const Separator = KbdSeparator;

export {
  Kbd,
  KbdKey,
  KbdSeparator,
  //
  Root,
  Key,
  Separator,
};