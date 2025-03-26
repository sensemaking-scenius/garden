import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import fs from "fs"
import path from "path"

interface DashboardData {
  projects: Array<{
    entryID: string
    url: string
    title: string
    description: string
    banner: string | null
    status: string
    tags: string[]
  }>
  last_updated: string
  last_entry_id: number
}

export const DashboardTiles: QuartzTransformerPlugin = () => {
  let dashboard: DashboardData | null = null

  const generateTileHtml = (project: DashboardData['projects'][0]) => {
    return `<div class="project-tile" data-entry-id="${project.entryID}">
    <a href="${project.url}" target="_blank" rel="noopener noreferrer">
      <div class="project-tile-bg"${
        project.banner ? ` style="background-image: url('${project.banner}')"` : ""
      }></div>
      <div class="project-tile-title">${project.title || 'Untitled'}</div>
      <div class="project-tile-description">${project.description || ""}</div>
    </a>
  </div>`
  }

  const extractProjectIds = (html: string): string[] => {
    const ids: string[] = []
    const regex = /data-entry-id="(\d+)"/g
    let match
    while ((match = regex.exec(html)) !== null) {
      if (match[1]) {
        ids.push(match[1].padStart(5, '0'))
      }
    }
    return ids
  }

  return {
    name: "DashboardTiles",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            // Load dashboard data if not loaded
            if (!dashboard) {
              try {
                // Try both possible locations
                const possiblePaths = [
                  path.join(process.cwd(), "internal/resources/dashboard.json"),
                  path.join(process.cwd(), "dashboard.json")
                ]

                let dashboardPath = ""
                for (const p of possiblePaths) {
                  console.log(`Checking for dashboard at: ${p}`)
                  if (fs.existsSync(p)) {
                    dashboardPath = p
                    console.log(`Found dashboard at: ${p}`)
                    break
                  }
                }

                if (!dashboardPath) {
                  console.warn("Dashboard file not found in any of the expected locations")
                  return
                }

                const data = fs.readFileSync(dashboardPath, "utf-8")
                const parsed = JSON.parse(data) as DashboardData
                dashboard = parsed
                console.log(`Loaded dashboard with ${parsed.projects.length} projects`)
                console.log("Available project IDs:", parsed.projects.map(p => p.entryID).join(", "))
              } catch (error) {
                console.warn("Failed to load or parse dashboard.json:", error)
                return
              }
            }

            if (!dashboard) {
              console.warn("Dashboard data not available")
              return
            }

            visit(tree, "html", (node) => {
              if (typeof node.value === "string") {
                // Check if this is a dashboard-tiles container
                if (node.value.includes('class="dashboard-tiles"')) {
                  const projectIds = extractProjectIds(node.value)
                  
                  if (projectIds.length === 0) {
                    console.log("No project IDs found in dashboard-tiles container")
                    return
                  }

                  console.log(`Found ${projectIds.length} project IDs:`, projectIds)

                  // Generate HTML for all tiles
                  const tilesHtml = projectIds
                    .map(id => {
                      const project = dashboard?.projects.find(p => p.entryID === id)
                      if (!project) {
                        console.warn(`Project with ID ${id} not found in dashboard`)
                        console.log("Available projects:", dashboard?.projects)
                        return null
                      }
                      console.log(`Generating HTML for project ${id}: ${project.title}`)
                      return generateTileHtml(project)
                    })
                    .filter(Boolean)
                    .join("\n")

                  // Replace the entire container
                  node.value = `<div class="dashboard-tiles">
${tilesHtml}
</div>`
                  console.log("Updated container HTML:", node.value)
                }
                // Handle standalone tiles (not in a container)
                else if (node.value.includes("project-tile")) {
                  const match = node.value.match(/data-entry-id="(\d+)"/)
                  if (!match) return

                  const entryId = match[1].padStart(5, '0')
                  const project = dashboard?.projects.find(p => p.entryID === entryId)
                  if (!project) {
                    console.warn(`Project with ID ${entryId} not found in dashboard`)
                    console.log("Available projects:", dashboard?.projects)
                    return
                  }

                  node.value = generateTileHtml(project)
                  console.log(`Processed standalone tile ${entryId}: ${project.title}`)
                  console.log("Updated tile HTML:", node.value)
                }
              }
            })
          }
        },
      ]
    },
  }
} 