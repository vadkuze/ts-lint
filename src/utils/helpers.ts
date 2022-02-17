import {AST_NODE_TYPES, TSESTree} from "@typescript-eslint/utils";

export function isTemplateLiteral(node: TSESTree.CallExpressionArgument): boolean {
    return node.type === AST_NODE_TYPES.TemplateLiteral;
}
export function isLiteral(node: TSESTree.CallExpressionArgument): boolean {
    return  node.type === AST_NODE_TYPES.Literal;
}

export function findTemplateLiteral(args: TSESTree.CallExpressionArgument[] ): TSESTree.LiteralExpression {
    return args.find( (node: TSESTree.CallExpressionArgument ) => isTemplateLiteral(node) || isLiteral(node)) as TSESTree.LiteralExpression;
}
