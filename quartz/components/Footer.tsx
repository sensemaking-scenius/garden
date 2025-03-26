import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links?: Record<string, string>
  socialLinks?: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}
    const socialLinks = opts?.socialLinks ?? {
      GitHub: "https://github.com/sensemaking-scenius"
    }

    return (
      <footer className={`${displayClass ?? ""}`}>
        <div className="container py-8 md:py-12">
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            {socialLinks.GitHub && (
                  <a href={socialLinks.GitHub} className="text-muted-foreground hover:text-foreground" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span className="sr-only">GitHub</span>
                  </a>
                )}
            <p>
              {i18n(cfg.locale).components.footer.createdWith}{" "}
              <a href="https://quartz.jzhao.xyz/" className="text-muted-foreground hover:text-foreground">Quartz v{version}</a>
              {" "}&copy; {year} Sensemaking Scenius 
            </p>
          </div>
        </div>
      </footer>
    )
  }

  Footer.css = `
    footer {
      margin-top: 2rem;
      padding-top: 2rem;
      background-color: var(--light);
      border-top: 1px solid var(--lightgray);
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      box-sizing: border-box;
    }

    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }

    .space-y-4 > * + * {
      margin-top: 1rem;
    }

    .flex {
      display: flex;
    }

    .items-center {
      align-items: center;
    }

    .gap-4 {
      gap: 1rem;
    }

    .text-lg {
      font-size: 1.125rem;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    .font-medium {
      font-weight: 500;
    }

    .text-muted-foreground {
      color: var(--gray);
    }

    .text-muted-foreground:hover {
      color: var(--dark);
    }

    .border-t {
      border-top: 1px solid var(--lightgray);
    }

    .pt-8 {
      padding-top: 2rem;
    }

    .mt-8 {
      margin-top: 2rem;
    }

    .text-center {
      text-align: center;
    }

    .py-8 {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    footer a {
      text-decoration: none;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    @media (min-width: 768px) {
      .md\\:grid-cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .md\\:py-12 {
        padding-top: 3rem;
        padding-bottom: 3rem;
      }
    }

    /* Dark mode styles */
    .dark footer {
      background-color: var(--dark);
      border-top-color: var(--darkgray);
    }

    .dark .text-muted-foreground {
      color: var(--gray);
    }

    .dark .text-muted-foreground:hover {
      color: var(--light);
    }

    .dark .border-t {
      border-top-color: var(--darkgray);
    }
  `

  return Footer
}) satisfies QuartzComponentConstructor
