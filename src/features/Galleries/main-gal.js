export default function initMasonryGrid() {
  const container = document.querySelector('.gal-masonry-column-list')
  if (!container) return

  const images = container.querySelectorAll('.masonry-image-rndm')
  const numCols = 3 // Number of columns

  function layoutMasonry() {
    const colHeights = Array(numCols).fill(0)

    // Reset container height to recalculate
    container.style.height = 'auto'

    // Arrange items
    images.forEach((image, i) => {
      const order = i % numCols
      image.style.order = order

      // Wait for image to load to get correct height
      if (image.complete) {
        colHeights[order] += image.clientHeight + 16 // Adding gap
      } else {
        image.onload = () => {
          colHeights[order] += image.clientHeight + 16
          container.style.height = Math.max(...colHeights) + 'px'
        }
      }
    })

    // Set final container height
    container.style.height = Math.max(...colHeights) + 'px'
  }

  // Initial layout
  layoutMasonry()

  // Handle window resize
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(layoutMasonry, 250)
  })
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMasonryGrid)
