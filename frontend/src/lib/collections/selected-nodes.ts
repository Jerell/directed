import { createCollection, liveQueryCollectionOptions, eq } from "@tanstack/db";
import { nodesCollection } from "./flow";

export const selectedNodesCollection = createCollection(
  liveQueryCollectionOptions({
    query: (q) =>
      q
        .from({ node: nodesCollection })
        .where(({ node }) => eq(node.selected, true)),
  })
);

export const selectedGroupsCollection = createCollection(
  liveQueryCollectionOptions({
    query: (q) =>
      q
        .from({ node: nodesCollection })
        .where(({ node }) => eq(node.type, "labeledGroupNode"))
        .where(({ node }) => eq(node.selected, true)),
  })
);

export const selectedBranchesCollection = createCollection(
  liveQueryCollectionOptions({
    query: (q) =>
      q
        .from({ node: nodesCollection })
        .where(({ node }) => eq(node.type, "branchNode"))
        .where(({ node }) => eq(node.selected, true)),
  })
);

export const selectedChildrenCollection = createCollection(
  liveQueryCollectionOptions({
    query: (q) =>
      q
        .from({ child: nodesCollection })
        .innerJoin({ parent: nodesCollection }, ({ child, parent }) =>
          eq(child.parentId, parent.id)
        )
        .where(({ parent }) => eq(parent.selected, true))
        .select(({ child }) => child),
  })
);
