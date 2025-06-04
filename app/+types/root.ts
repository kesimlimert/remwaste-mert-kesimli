import type { LinksFunction as RouterLinksFunction } from "react-router";

export namespace Route {
  export type LinksFunction = RouterLinksFunction;
  export interface ErrorBoundaryProps {
    error: any;
  }
} 