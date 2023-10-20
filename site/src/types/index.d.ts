export {}

declare global {
  interface Window {
    enterView: ({
      selector,
      enter,
      exit,
      progress,
      offset,
      once
    }: EnterViewOptions) => void
  }

  interface HTMLElement {
    __ev_entered: boolean
    __ev_progress: number
  }
}
