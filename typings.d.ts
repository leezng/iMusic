/* eslint-disable */
// prettier-ignore
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-router" />
/// <reference types="react-router-dom" />

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.less' {
  const content: { readonly [className: string]: string };
  export default content;
}
