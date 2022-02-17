"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const enums_1 = require("../utils/enums");
const selectors_1 = require("../utils/selectors");
exports.RULE_NAME = 'sort-functions';
// function getNumberOfEmptyLinesBetween(currentNode: TSESTree.Node | TSESTree.Token, nextNode: TSESTree.Node | TSESTree.Token | null, context: Readonly<RuleContext<MessageIds, Options>> ) {
//     if(!nextNode) return 0;
//
//     let linesBetweenImports = context.getSourceCode().lines.slice(
//         currentNode.loc.end.line,
//         nextNode.loc.start.line);
//
//     return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
// }
function getInsertRemoveFixers(fixer, node, funcNodeForInsertAfter, text) {
    return [
        fixer.remove(node),
        fixer.insertTextAfter(funcNodeForInsertAfter, text),
    ];
}
exports.default = (0, create_eslint_rule_1.createEslintRule)({
    create(context) {
        const functions = new Map();
        let lastExportedFunc, lastPrivateFunc, lastPublicFunc;
        return {
            FunctionDeclaration(node) {
                if (!node.id)
                    return;
                const functionName = node.id.name;
                const isPrivate = functionName.startsWith('_');
                functions.set(functionName, {
                    modificator: isPrivate ? enums_1.FuncModificator.PRIVATE : enums_1.FuncModificator.PUBLIC,
                    node
                });
                if (isPrivate)
                    lastPrivateFunc = functionName;
                else
                    lastPublicFunc = functionName;
            },
            [selectors_1.EXPORTED_FUNC](node) {
                if (!node.id)
                    return;
                const functionName = node.id.name;
                functions.set(functionName, {
                    modificator: enums_1.FuncModificator.EXPORT,
                    node
                });
                lastExportedFunc = functionName;
            },
            "Program:exit"() {
                const sourceCode = context.getSourceCode();
                let functionsArray = [...functions], indexLastExportFunc = functionsArray.findIndex(([name]) => name === lastExportedFunc), indexLastPrivateFunc = functionsArray.findIndex(([name]) => name === lastPrivateFunc), indexLastPublicFunc = functionsArray.findIndex(([name]) => name === lastPublicFunc), indexLastAnyPublicFunc = indexLastPublicFunc > indexLastExportFunc ? indexLastPublicFunc : indexLastExportFunc > 0 ? indexLastExportFunc : -1;
                if (!functionsArray.length)
                    return;
                for (let len = functionsArray.length - 1, i = len; 0 <= i; i--) {
                    const [fn, info] = functionsArray[i];
                    if (info.modificator === enums_1.FuncModificator.PRIVATE && i < indexLastAnyPublicFunc) {
                        context.report({
                            node: info.node,
                            messageId: "incorrectOrder",
                            data: {
                                name: fn,
                                orderModificatorMessage: "public"
                            },
                            // TODO implement removing node considering empty line and /n, /t, comments
                            fix: (fixer) => getInsertRemoveFixers(fixer, info.node, functionsArray[indexLastAnyPublicFunc][1].node, `\n\n${sourceCode.getText(info.node)}`)
                        });
                    }
                    if (info.modificator === enums_1.FuncModificator.PUBLIC && (i < indexLastExportFunc || i > indexLastPrivateFunc)) {
                        context.report({
                            node: info.node,
                            messageId: "incorrectOrder",
                            data: {
                                name: fn,
                                orderModificatorMessage: "exported members but before private"
                            },
                            fix: (fixer) => getInsertRemoveFixers(fixer, info.node, functionsArray[indexLastExportFunc][1].node, `\n\n${sourceCode.getText(info.node)}`)
                        });
                    }
                }
            }
        };
    },
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Private functions should located after public',
            recommended: 'error'
        },
        fixable: 'code',
        schema: [],
        messages: {
            incorrectOrder: 'The {{name}} function should be declared after {{orderModificatorMessage}} functions'
        }
    },
    defaultOptions: []
});
