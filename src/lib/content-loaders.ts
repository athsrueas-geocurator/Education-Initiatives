import dichotomiesJson from "@content/dichotomies.json";
import initiativesJson from "@content/initiatives.json";
import landingCardsJson from "@content/landing-cards.json";
import methodsJson from "@content/methods.json";
import sourcesJson from "@content/sources.json";
import {
  dichotomySchema,
  glossarySchema,
  initiativeSchema,
  landingCardSchema,
  methodSchema,
  sourceSchema,
  type Dichotomy,
  type Initiative,
  type LandingCard,
  type Method,
  type Source
} from "./content-schema";
import glossaryJson from "@content/glossary.json";

const dichotomies = dichotomySchema.array().parse(dichotomiesJson);
const initiatives = initiativeSchema.array().parse(initiativesJson);
const sources = sourceSchema.array().parse(sourcesJson);
const methods = methodSchema.array().parse(methodsJson);
const glossary = glossarySchema.array().parse(glossaryJson);
const landingCards = landingCardSchema.array().parse(landingCardsJson);

export function getDichotomies(): Dichotomy[] {
  return [...dichotomies].sort((a, b) => a.landingPriority - b.landingPriority);
}

export function getDichotomy(slug: string): Dichotomy | undefined {
  return dichotomies.find((dichotomy) => dichotomy.slug === slug);
}

export function getInitiatives(): Initiative[] {
  return [...initiatives].sort((a, b) => a.name.localeCompare(b.name));
}

export function getInitiative(slug: string): Initiative | undefined {
  return initiatives.find((initiative) => initiative.slug === slug);
}

export function getSources(): Source[] {
  return sources;
}

export function getSourceMap(): Map<string, Source> {
  return new Map(sources.map((source) => [source.id, source]));
}

export function getSourcesByIds(ids: string[]): Source[] {
  const sourceMap = getSourceMap();
  return ids.map((id) => sourceMap.get(id)).filter((source): source is Source => Boolean(source));
}

export function getMethods(): Method[] {
  return methods;
}

export function getGlossary() {
  return glossary;
}

export function getLandingCards(): LandingCard[] {
  return landingCards;
}

export function getDichotomyInitiatives(dichotomy: Dichotomy): Initiative[] {
  const slugs = new Set(dichotomy.keyInitiativeSlugs);
  return initiatives.filter((initiative) => slugs.has(initiative.slug));
}

export function getRelatedDichotomies(initiative: Initiative): Dichotomy[] {
  const slugs = new Set(initiative.relatedDichotomySlugs);
  return dichotomies.filter((dichotomy) => slugs.has(dichotomy.slug));
}
