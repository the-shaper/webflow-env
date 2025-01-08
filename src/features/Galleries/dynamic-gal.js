// Tab Component Implementation
export function initTabs() {
  // Get all tab buttons
  const tabButtons = document.querySelectorAll('.standard-button-style')

  // Get all content panes
  const contentPanes = {
    foto: document.querySelector('.gallery-grid-wrapper'),
    video: document.querySelector('.video-gallery-grid-wrapper'),
  }

  // Add data attributes to tabs and panes in Webflow
  tabButtons.forEach((button, index) => {
    // Set data-tab attribute based on index
    button.setAttribute('data-tab', index === 0 ? 'foto' : 'video')
  })

  // Click handler for tabs
  function handleTabClick(e) {
    const clickedTab = e.target
    const tabType = clickedTab.getAttribute('data-tab')

    // Remove active class from all tabs
    tabButtons.forEach((tab) => {
      tab.classList.remove('is-active')
    })

    // Remove active class from all panes
    Object.values(contentPanes).forEach((pane) => {
      pane.classList.remove('is-active')
    })

    // Add active class to clicked tab and corresponding pane
    clickedTab.classList.add('is-active')
    contentPanes[tabType].classList.add('is-active')
  }

  // Add click listeners to all tabs
  tabButtons.forEach((tab) => {
    tab.addEventListener('click', handleTabClick)
  })

  // Initialize first tab as active
  tabButtons[0].click()
}

export default initTabs
