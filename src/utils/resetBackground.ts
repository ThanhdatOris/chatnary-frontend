// Reset localStorage to apply new default background
// Run this once to clear old preferences
if (typeof window !== 'undefined') {
  // Clear old background preference to apply new default
  localStorage.removeItem('chatnary-background')
  console.log('Background preferences reset to new default: Neon')
}

export { }
