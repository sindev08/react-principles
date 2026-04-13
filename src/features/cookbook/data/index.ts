export type { RecipeDetail, RuleItem, ImplTab, DemoKey, StarterLink } from "./types";

import type { RecipeDetail } from "./types";
import { eCommerceDashboard } from "./recipes/e-commerce-dashboard";
import { saasLandingPage } from "./recipes/saas-landing-page";
import { authenticationFlow } from "./recipes/authentication-flow";
import { dataVisualization } from "./recipes/data-visualization";
import { apiIntegration } from "./recipes/api-integration";
import { oauthFlow } from "./recipes/oauth-flow";
import { serverState } from "./recipes/server-state";
import { clientState } from "./recipes/client-state";
import { formValidation } from "./recipes/form-validation";
import { dataTables } from "./recipes/data-tables";
import { folderStructure } from "./recipes/folder-structure";
import { typescriptForReact } from "./recipes/typescript-for-react";
import { componentAnatomy } from "./recipes/component-anatomy";
import { useeffectRenderCycle } from "./recipes/useeffect-render-cycle";
import { componentComposition } from "./recipes/component-composition";
import { servicesLayer } from "./recipes/services-layer";
import { stateTaxonomy } from "./recipes/state-taxonomy";
import { customHooks } from "./recipes/custom-hooks";

export const RECIPE_DETAILS: Record<string, RecipeDetail> = {
  "e-commerce-dashboard": eCommerceDashboard,
  "saas-landing-page": saasLandingPage,
  "authentication-flow": authenticationFlow,
  "data-visualization": dataVisualization,
  "api-integration": apiIntegration,
  "oauth-flow": oauthFlow,
  "server-state": serverState,
  "client-state": clientState,
  "form-validation": formValidation,
  "data-tables": dataTables,
  "folder-structure": folderStructure,
  "typescript-for-react": typescriptForReact,
  "component-anatomy": componentAnatomy,
  "useeffect-render-cycle": useeffectRenderCycle,
  "component-composition": componentComposition,
  "services-layer": servicesLayer,
  "state-taxonomy": stateTaxonomy,
  "custom-hooks": customHooks,
};

export function getRecipeDetail(slug: string): RecipeDetail | null {
  return RECIPE_DETAILS[slug] ?? null;
}
