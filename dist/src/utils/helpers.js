"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTemplateLiteral = exports.isLiteral = exports.isTemplateLiteral = void 0;
const utils_1 = require("@typescript-eslint/utils");
function isTemplateLiteral(node) {
    return node.type === utils_1.AST_NODE_TYPES.TemplateLiteral;
}
exports.isTemplateLiteral = isTemplateLiteral;
function isLiteral(node) {
    return node.type === utils_1.AST_NODE_TYPES.Literal;
}
exports.isLiteral = isLiteral;
function findTemplateLiteral(args) {
    return args.find((node) => isTemplateLiteral(node) || isLiteral(node));
}
exports.findTemplateLiteral = findTemplateLiteral;
