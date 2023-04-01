import { FlatSummaryNode, TreeNode } from "./types";

export function flatSummaryToTree(summaryList: FlatSummaryNode[]): TreeNode {
  const rootNode = summaryList.find((e) => e.path === "/") as FlatSummaryNode;
  return makeSubTree(summaryList, rootNode);
}

function makeSubTree(
  summaryList: FlatSummaryNode[],
  node: FlatSummaryNode
): TreeNode {
  const currLevelSummaries: FlatSummaryNode[] = summaryList.filter(
    (candidate) => {
      const base = node.path;
      const baseCleaned = base.endsWith("/")
        ? base.slice(0, base.length - 1)
        : base;
      const candPath = candidate.path;

      const excess = candPath.slice(baseCleaned.length);

      const notSubstringCheck = excess.startsWith("/");
      const oneDepthCheck =
        excess.split("/").filter((e) => e.length !== 0).length === 1;

      return notSubstringCheck && oneDepthCheck;
    }
  );

  return {
    ...node,
    children: currLevelSummaries.map((e) => makeSubTree(summaryList, e)),
  };
}
