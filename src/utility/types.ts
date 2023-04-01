export type FlatSummaryNode = {
  path: string;
  content: string;
  summary: string;
  title: string;
};

export type TreeNode = FlatSummaryNode & {
  children: TreeNode[];
};
