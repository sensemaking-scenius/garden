import { QuartzComponent, QuartzComponentProps } from "./types"

interface ScriptOptions {
  src?: string
  script?: string
}

export function Script(options: ScriptOptions): QuartzComponent {
  function Script({ displayClass }: QuartzComponentProps) {
    if (options.src) {
      return <script src={options.src} defer className={displayClass}></script>
    }
    if (options.script) {
      return <script defer className={displayClass}>{options.script}</script>
    }
    return null
  }

  Script.css = ""
  return Script
} 