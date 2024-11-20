export function sayHello(name: string | null = null): string {
  return `Hello, ${name || "World"}!`;
}

export function getAIRecommendations(treeRepresentation: string | null = null): string {
  return `This is the tree representation ${treeRepresentation || "none available"}`;
}