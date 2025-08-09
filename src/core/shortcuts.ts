import { useStore } from '../store'
import { ProjectStorage } from './storage'

export function setupKeyboardShortcuts() {
  const { project, set, setShots } = useStore.getState()

  document.addEventListener('keydown', async (e) => {
    // Ctrl/Cmd + S: Save project
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      try {
        await ProjectStorage.saveProject(project)
        console.log('Project saved via keyboard shortcut')
      } catch (err) {
        console.error('Failed to save project:', err)
      }
    }

    // Ctrl/Cmd + Enter: Generate storyboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      // This would need to be handled by the component
      console.log('Generate storyboard shortcut pressed')
    }

    // Ctrl/Cmd + R: Render video
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault()
      console.log('Render video shortcut pressed')
    }

    // Escape: Clear error messages
    if (e.key === 'Escape') {
      // This would need to be handled by the component
      console.log('Escape pressed')
    }
  })
}

export function cleanupKeyboardShortcuts() {
  // Remove event listeners if needed
  document.removeEventListener('keydown', () => {})
}