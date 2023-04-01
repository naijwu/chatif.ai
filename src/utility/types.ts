export type Summary = {
  path: string;
  content: string;
  summary: string;
  title: string;
};

export type TreeNode = Summary & {
  children: TreeNode[];
};
