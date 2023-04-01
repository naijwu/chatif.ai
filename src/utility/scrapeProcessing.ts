import { Summary, TreeNode } from "./types";

export function summaryToTree(summaryList: Summary[]): TreeNode {
  const rootNode = summaryList.find((e) => e.path === "/") as Summary;
  return makeSubTree(summaryList, rootNode);
}

function makeSubTree(summaryList: Summary[], node: Summary): TreeNode {
  const currLevelSummaries: Summary[] = summaryList.filter((candidate) => {
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
  });

  return {
    ...node,
    children: currLevelSummaries.map((e) => makeSubTree(summaryList, e)),
  };
}
