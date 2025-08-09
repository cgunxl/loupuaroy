import { get, set, del, keys } from 'idb-keyval'
import type { Project } from '../store'

export class ProjectStorage {
  static async saveProject(project: Project, name?: string): Promise<void> {
    const key = name || `project_${Date.now()}`
    await set(key, project)
  }

  static async loadProject(key: string): Promise<Project | null> {
    try {
      return await get(key) || null
    } catch {
      return null
    }
  }

  static async deleteProject(key: string): Promise<void> {
    await del(key)
  }

  static async listProjects(): Promise<string[]> {
    try {
      const allKeys = await keys()
      return allKeys.filter(k => typeof k === 'string' && k.startsWith('project_')) as string[]
    } catch {
      return []
    }
  }

  static async getProjectNames(): Promise<{ key: string; name: string; date: Date }[]> {
    const projectKeys = await this.listProjects()
    const projects = []
    
    for (const key of projectKeys) {
      try {
        const project = await this.loadProject(key)
        if (project) {
          projects.push({
            key,
            name: project.prompt || 'ไม่มีชื่อ',
            date: new Date(parseInt(key.split('_')[1]) || Date.now())
          })
        }
      } catch {
        // Skip corrupted projects
      }
    }
    
    return projects.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
}