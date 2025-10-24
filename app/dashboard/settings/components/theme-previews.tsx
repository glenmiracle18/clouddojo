/**
 * Theme Preview Components
 * Separated visual previews for different theme options
 */

interface ThemePreviewProps {
  className?: string;
}

/**
 * Renders a light-themed mock preview of an interface with a top bar, sidebar, and content lines.
 *
 * @param className - Additional CSS class names applied to the root container
 * @returns The rendered light-themed preview element
 */
export function LightThemePreview({ className = "" }: ThemePreviewProps) {
  return (
    <div className={`h-full w-full p-3 space-y-1 bg-white ${className}`}>
      {/* Top bar */}
      <div className="h-2 w-full rounded-[3px] bg-gradient-to-l from-gray-300 to-gray-400" />

      {/* Content area */}
      <div className="flex gap-1">
        {/* Sidebar representation */}
        <div className="w-4 h-16 rounded-[3px] bg-gray-200" />

        {/* Main content */}
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-300 to-gray-200" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />

          <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a dark-themed visual preview of a simple dashboard layout.
 *
 * The preview contains a top gradient bar, a sidebar block, a main content column
 * with three horizontal gradient lines, and a short emerald accent bar.
 *
 * @param className - Optional additional CSS class names to apply to the root container
 * @returns A JSX element containing the dark-themed preview
 */
export function DarkThemePreview({ className = "" }: ThemePreviewProps) {
  return (
    <div className={`h-full w-full p-3 space-y-1 bg-gray-900 ${className}`}>
      {/* Top bar */}
      <div className="h-2 w-full rounded-[3px] bg-gradient-to-l from-gray-700 to-gray-800" />

      {/* Content area */}
      <div className="flex gap-1">
        {/* Sidebar representation */}
        <div className="w-4 h-16 rounded-[3px] bg-gray-800" />

        {/* Main content */}
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
          <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />

          <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a split theme preview with a light panel on the left and a dark panel on the right.
 *
 * @param className - Optional additional CSS classes applied to the root container
 * @returns A JSX element displaying side-by-side light and dark theme previews
 */
export function SystemThemePreview({ className = "" }: ThemePreviewProps) {
  return (
    <div className={`h-full w-full flex ${className}`}>
      {/* Light Half */}
      <div className="w-1/2 h-full p-3 space-y-1 bg-white">
        {/* Top bar */}
        <div className="h-2 w-full rounded-l-[3px] bg-gradient-to-l from-gray-300 to-gray-400" />

        {/* Content area */}
        <div className="flex gap-1">
          {/* Sidebar representation */}
          <div className="w-4 h-16 rounded-[3px] bg-gray-200" />

          {/* Main content */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-300 to-gray-200" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-100 to-gray-200" />

            <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
          </div>
        </div>
      </div>

      {/* Dark Half */}
      <div className="w-1/2 h-full p-3 space-y-1 bg-gray-900">
        {/* Top bar */}
        <div className="h-2 w-full rounded-r-[3px] bg-gradient-to-l from-gray-700 to-gray-800" />

        {/* Content area */}
        <div className="flex gap-1">
          {/* Sidebar representation */}
          <div className="w-4 h-16 rounded-[3px] bg-gray-800" />

          {/* Main content */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />
            <div className="h-3 w-full rounded-[3px] bg-gradient-to-r from-gray-600 to-gray-700" />

            <div className="h-1 w-4 bg-emerald-500 rounded-sm justify-end items-end flex" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generic Theme Preview Wrapper
 * Renders the appropriate theme preview based on the theme value
 */
interface ThemePreviewWrapperProps {
  theme: "light" | "dark" | "system";
  className?: string;
}

/**
 * Render a visual preview matching the provided theme selection.
 *
 * @param theme - The theme to preview: `"light"`, `"dark"`, or `"system"`.
 * @param className - Additional CSS class names to apply to the preview container.
 * @returns A JSX element rendering the preview for the selected theme.
 */
export function ThemePreviewWrapper({
  theme,
  className = "",
}: ThemePreviewWrapperProps) {
  switch (theme) {
    case "light":
      return <LightThemePreview className={className} />;
    case "dark":
      return <DarkThemePreview className={className} />;
    case "system":
      return <SystemThemePreview className={className} />;
    default:
      return <SystemThemePreview className={className} />;
  }
}