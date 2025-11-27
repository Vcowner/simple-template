declare global {
  namespace JSX {
    // Allow using JSX/TSX syntax in *.vue files without individually declaring tags
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export {}
