/**
 * Home Page - Sticky Horizontal Gallery Scroll
 *
 * Implements a pinned section where vertical scroll translates
 * to horizontal movement of a gallery track.
 * Pure vanilla JS, no external libraries.
 */

document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('gallery');
  if (!section) return;

  const wrapper = section.querySelector('.gallery-wrapper');
  const track = section.querySelector('.gallery-track');

  if (!wrapper || !track) return;

  // Calculate the maximum horizontal scroll needed
  function calculateMaxScroll() {
    const trackWidth = track.scrollWidth;
    const wrapperWidth = wrapper.clientWidth;
    return Math.max(0, trackWidth - wrapperWidth);
  }

  let maxScroll = calculateMaxScroll();
  let sectionTop = section.offsetTop;
  let sectionHeight = section.offsetHeight;

  // Update measurements on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      maxScroll = calculateMaxScroll();
      sectionTop = section.offsetTop;
      sectionHeight = section.offsetHeight;
      updateHorizontalScroll();
      updateExpansionScroll();
    }, 100);
  });

  function updateHorizontalScroll() {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Calculate section boundaries
    const sectionStart = sectionTop;

    // The sticky container handles the pinning.
    // We just need to calculate horizontal translation based on
    // how far we've scrolled from the start of this section
    const scrolledIntoSection = Math.max(0, scrollTop - sectionStart);
    const scrollableDistance = sectionHeight - viewportHeight;

    // Clamp progress between 0 and 1
    const progress = Math.min(scrolledIntoSection / scrollableDistance, 1);
    const translateX = maxScroll * progress;

    track.style.transform = `translateX(-${translateX}px)`;
  }

  // Throttled scroll handler
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHorizontalScroll();
        updateExpansionScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial call to set state
  updateHorizontalScroll();

  // ===== FEATURED IMAGE EXPANSION =====
  const expansionSection = document.getElementById('featured-expansion');
  const imageWrapper = document.querySelector('.featured-image-wrapper');
  const caption = document.querySelector('.featured-caption');

  if (!expansionSection || !imageWrapper || !caption) return;

  function updateExpansionScroll() {
    const scrollTop = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate section boundaries
    const rect = expansionSection.getBoundingClientRect();
    const sectionStart = rect.top + scrollTop; // document-relative top position
    const sectionHeight = rect.height;
    const scrollableDistance = sectionHeight - viewportHeight;

    // Avoid division by zero
    if (scrollableDistance <= 0) return;

    // Calculate progress (can be less than 0 or greater than 1, we'll clamp)
    let progress = (scrollTop - sectionStart) / scrollableDistance;
    progress = Math.max(0, Math.min(1, progress));

    // Use an easing function for smoother expansion (ease-out)
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    // Initial dimensions (small frame)
    const initialWidth = 320;
    const initialHeight = 240;

    // Target: fill viewport completely
    const targetWidth = viewportWidth;
    const targetHeight = viewportHeight;

    // Smooth interpolation
    const currentWidth = initialWidth + (targetWidth - initialWidth) * easedProgress;
    const currentHeight = initialHeight + (targetHeight - initialHeight) * easedProgress;

    // Border radius: from ~16px to 0
    const currentRadius = 16 * (1 - easedProgress);

    // Apply size and border-radius
    imageWrapper.style.width = `${currentWidth}px`;
    imageWrapper.style.height = `${currentHeight}px`;
    imageWrapper.style.borderRadius = `${currentRadius}px`;

    // Keep centered
    imageWrapper.style.transform = `translate(-50%, -50%)`;

    // Remove border and shadow when nearly expanded for true fullscreen
    if (progress > 0.85) {
      imageWrapper.style.border = 'none';
      imageWrapper.style.boxShadow = 'none';
    } else {
      imageWrapper.style.border = '2px solid rgba(200, 133, 58, 0.3)';
      imageWrapper.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(200, 133, 58, 0.1)';
    }

    // Fade caption out as we expand (start at 10% progress, fade out by 40%)
    if (progress > 0.1) {
      const captionOpacity = Math.max(0, 1 - (progress - 0.1) / 0.3);
      caption.style.opacity = captionOpacity;
    } else {
      caption.style.opacity = 1;
    }
  }

  // Initial expansion state
  updateExpansionScroll();
});
