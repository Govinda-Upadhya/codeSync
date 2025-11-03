/// <reference types="next" />

declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}