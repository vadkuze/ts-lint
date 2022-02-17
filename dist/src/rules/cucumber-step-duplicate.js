"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULE_NAME = void 0;
const create_eslint_rule_1 = require("../utils/create-eslint-rule");
const selectors_1 = require("../utils/selectors");
const helpers_1 = require("../utils/helpers");
exports.RULE_NAME = 'cucumber-step-duplicate';
let stepDefinitions = new Map();
// let duplicates: Map<string, ISteDuplicateInfo[]> = new Map();
// Explanation: uncomment to check if steps duplicate each other from another files
// .set('test', new Map().set("'I should click Save button in {string} block'", {repeats: 0, node: {
//     type: 'Literal',
//     value: 'I should click Save button in {string} block',
//     raw: "'I should click Save button in {string} block'",
//     range: [ 420, 466 ],
//     loc: { start: { line: 20, column: 5 }, end: { line: 20, column: 51 } },
// }}));
// TODO filter commented parts of code
exports.default = (0, create_eslint_rule_1.createEslintRule)({
    create(context) {
        let duplicatedSteps = new Map();
        const currentFileName = context.getFilename();
        const sourceCode = context.getSourceCode();
        let currentValue = { raw: '', pretty: '' };
        return {
            Program() {
                stepDefinitions.set(currentFileName, new Map());
            },
            [selectors_1.ANY_STEP_DEFINITION_FUNC](node) {
                const stepDefinitionNode = (0, helpers_1.findTemplateLiteral)(node.arguments);
                currentValue = {
                    raw: sourceCode.getText(stepDefinitionNode),
                    pretty: sourceCode.getText(stepDefinitionNode).slice(1, -1)
                };
                if (!currentValue.raw)
                    return;
                const repeats = [...sourceCode.getText().matchAll(new RegExp(currentValue.raw, 'g'))].length - 1;
                const currentStepData = {
                    repeats,
                    node: stepDefinitionNode
                };
                if (repeats > 0) {
                    duplicatedSteps.set(currentValue.raw, stepDefinitionNode);
                }
                stepDefinitions.get(currentFileName)?.set(currentValue.raw, currentStepData);
                Array.from(stepDefinitions)
                    .filter(([fileName,]) => fileName !== currentFileName)
                    .forEach(([fileName, steps]) => {
                    let stepNode = steps.get(currentValue.raw)?.node;
                    // let stepForReport: TSESTree.LiteralExpression = duplicatedSteps.get(currentValue.raw) || stepDefinitionNode;
                    if (stepNode && !repeats) {
                        context.report({
                            messageId: 'cucumberStepDuplicateGlobalRequired',
                            node: stepDefinitionNode,
                            data: {
                                file: `/${fileName.split('/').pop()}`,
                                ...stepNode.loc.start
                            }
                        });
                    }
                });
            },
            "Program:exit"() {
                duplicatedSteps.forEach((node) => {
                    context.report({
                        messageId: 'cucumberStepDuplicateLocalRequired',
                        node: node,
                    });
                });
                duplicatedSteps = new Map();
            }
        };
    },
    name: exports.RULE_NAME,
    meta: {
        type: 'problem',
        docs: {
            description: 'Step Definitions should not have duplicates',
            recommended: 'error'
        },
        schema: [],
        messages: {
            cucumberStepDuplicateLocalRequired: 'The step definition repeats at the same file',
            cucumberStepDuplicateGlobalRequired: 'The step definition repeats at {{line}}:{{column}} {{file}} file'
        }
    },
    defaultOptions: []
});
