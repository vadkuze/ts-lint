import { createEslintRule } from "../utils/create-eslint-rule";
import {RuleContext, SourceCode} from "@typescript-eslint/utils/dist/ts-eslint";
import { TSESTree } from '@typescript-eslint/utils';
import { IStepDefinition} from "../utils/models";
import { ANY_STEP_DEFINITION_FUNC } from "../utils/selectors";
import { findTemplateLiteral } from "../utils/helpers";

export const RULE_NAME = 'cucumber-step-duplicate';
export type MessageIds = 'cucumberStepDuplicateLocalRequired' | 'cucumberStepDuplicateGlobalRequired';
export type Options = [];

let stepDefinitions: Map<string, Map<string, IStepDefinition>> = new Map();
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
export default createEslintRule({
    create(context: Readonly<RuleContext<MessageIds, Options>>) {
        let duplicatedSteps: Map<string, TSESTree.LiteralExpression> = new Map();
        const currentFileName: string = context.getFilename();
        const sourceCode: Readonly<SourceCode> = context.getSourceCode();
        let currentValue = { raw: '', pretty: ''};

        return {
            Program(){
               stepDefinitions.set(currentFileName, new Map())
            },
            [ANY_STEP_DEFINITION_FUNC](node: TSESTree.CallExpression) {
                const stepDefinitionNode: TSESTree.LiteralExpression = findTemplateLiteral(node.arguments);
                currentValue = {
                    raw: sourceCode.getText(stepDefinitionNode),
                    pretty: sourceCode.getText(stepDefinitionNode).slice(1, -1)
                }

                if(!currentValue.raw) return;

                const repeats: number = [...sourceCode.getText().matchAll(new RegExp(currentValue.raw, 'g'))].length - 1
                const currentStepData: IStepDefinition = {
                    repeats,
                    node: stepDefinitionNode
                }

                if(repeats > 0) {
                    duplicatedSteps.set(currentValue.raw, stepDefinitionNode);
                }

                stepDefinitions.get(currentFileName)?.set(currentValue.raw, currentStepData);

                Array.from(stepDefinitions)
                    .filter(([fileName,]: [string, Map<string, IStepDefinition>]) => fileName !== currentFileName)
                    .forEach(([fileName, steps]: [string, Map<string, IStepDefinition>]) => {
                        let stepNode: TSESTree.LiteralExpression | undefined = steps.get(currentValue.raw)?.node;

                        if(stepNode && !repeats) {
                            context.report({
                                messageId: 'cucumberStepDuplicateGlobalRequired',
                                node: stepDefinitionNode,
                                data: {
                                    file: `/${fileName.split('/').pop()}`,
                                    ...stepNode.loc.start
                                }
                            });
                         }
                     })

            },
            "Program:exit"(){
                duplicatedSteps.forEach((node: TSESTree.LiteralExpression) => {
                    context.report({
                        messageId: 'cucumberStepDuplicateLocalRequired',
                        node: node,
                    });
                })

                duplicatedSteps = new Map();

            }
        };
    },
    name: RULE_NAME,
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
