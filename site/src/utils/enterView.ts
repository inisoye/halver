/**
 * EnterView.js library source with types added.
 * Visit the GitHub repository for more information: https://github.com/russellsamora/enter-view
 */

/**
 * Options for the EnterView function.
 */
interface EnterViewOptions {
  selector: string | NodeListOf<HTMLElement> | HTMLElement[]
  enter?: (element: HTMLElement) => void // Callback when an element enters the view.
  exit?: (element: HTMLElement) => void // Callback when an element exits the view.
  progress?: (element: HTMLElement, progress: number) => void // Callback for progress within the view.
  offset?: number // Offset to trigger events relative to the viewport's height.
  once?: boolean // Whether to trigger events only once for each element.
}

/**
 * Initializes the EnterView functionality.
 * @param options - The configuration options for EnterView.
 */
export function enterView({
  selector,
  enter = () => {},
  exit = () => {},
  progress = () => {},
  offset = 0,
  once = false
}: EnterViewOptions): void {
  let raf: ((callback: FrameRequestCallback) => number) | null = null
  let ticking = false
  let elements: HTMLElement[] = []
  let height = 0

  /**
   * Sets up the requestAnimationFrame function.
   */
  function setupRaf() {
    raf =
      window.requestAnimationFrame ||
      function (callback) {
        return setTimeout(callback, 1000 / 60)
      }
  }

  /**
   * Calculates the height for offset triggering.
   * @returns The offset height based on the viewport's height.
   */
  function getOffsetHeight() {
    if (offset && typeof offset === 'number') {
      const fraction = Math.min(Math.max(0, offset), 1)
      return height - fraction * height
    }
    return height
  }

  /**
   * Updates the viewport's height.
   */
  function updateHeight() {
    const cH = document.documentElement.clientHeight
    const wH = window.innerHeight || 0
    height = Math.max(cH, wH)
  }

  /**
   * Handles scroll events and triggers element callbacks.
   */
  function updateScroll() {
    ticking = false
    const targetFromTop = getOffsetHeight()

    elements = elements.filter((el) => {
      const { top, bottom, height } = el.getBoundingClientRect()
      const entered = top < targetFromTop
      const exited = bottom < targetFromTop

      // enter + exit
      if (entered && !el['__ev_entered']) {
        enter(el)
        el['__ev_progress'] = 0
        progress(el, el['__ev_progress'])
        if (once) return false
      } else if (!entered && el['__ev_entered']) {
        el['__ev_progress'] = 0
        progress(el, el['__ev_progress'])
        exit(el)
      }

      // progress
      if (entered && !exited) {
        const delta = (targetFromTop - top) / height
        el['__ev_progress'] = Math.min(1, Math.max(0, delta))
        progress(el, el['__ev_progress'])
      }

      if (entered && exited && el['__ev_progress'] !== 1) {
        el['__ev_progress'] = 1
        progress(el, el['__ev_progress'])
      }

      el['__ev_entered'] = entered
      return true
    })

    if (!elements.length) {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize, true)
      window.removeEventListener('load', onLoad, true)
    }
  }

  /**
   * Handles scroll events to update the viewport's state.
   */
  function onScroll() {
    if (!ticking) {
      ticking = true
      raf?.(updateScroll)
    }
  }

  /**
   * Handles resize events and updates the viewport's height.
   */
  function onResize() {
    updateHeight()
    updateScroll()
  }

  /**
   * Handles the load event and ensures that the viewport's state is up to date.
   */
  function onLoad() {
    updateHeight()
    updateScroll()
  }

  /**
   * Converts a NodeList to an array of HTMLElements.
   * @param selection - The NodeList to convert.
   * @returns An array of HTMLElements.
   */
  function selectionToArray(selection: NodeListOf<HTMLElement>): HTMLElement[] {
    const len = selection.length
    const result: HTMLElement[] = []
    for (let i = 0; i < len; i += 1) {
      result.push(selection[i])
    }
    return result
  }

  /**
   * Selects all elements based on the given selector.
   * @param selector - The selector for elements to select.
   * @param parent - The parent element to search within.
   * @returns An array of selected HTMLElements.
   */
  function selectAll(
    selector: string | NodeListOf<HTMLElement> | HTMLElement[],
    parent = document
  ): HTMLElement[] {
    if (typeof selector === 'string') {
      return selectionToArray(parent.querySelectorAll(selector))
    } else if (selector instanceof NodeList) {
      return selectionToArray(selector)
    } else if (Array.isArray(selector)) {
      return selector
    }
    return []
  }

  /**
   * Sets up the initial set of elements.
   */
  function setupElements() {
    elements = selectAll(selector)
  }

  /**
   * Sets up the necessary event listeners.
   */
  function setupEvents() {
    window.addEventListener('resize', onResize, true)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('load', onLoad, true)
    onResize()
  }

  /**
   * Initializes the EnterView library.
   */
  function init() {
    if (!selector) {
      console.error('Must pass a selector.')
      return
    }

    setupElements()

    if (!elements || !elements.length) {
      console.error('No elements match the selector.')
      return
    }

    setupRaf()
    setupEvents()
    updateScroll()
  }

  // Call the initialization function when this module is imported.
  init()
}
