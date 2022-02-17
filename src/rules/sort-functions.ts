import {createEslintRule} from "../utils/create-eslint-rule";
import {RuleContext, RuleFix, RuleFixer, SourceCode} from "@typescript-eslint/utils/dist/ts-eslint";
import {TSESTree} from "@typescript-eslint/utils/dist/ts-estree";
import {FuncModificator} from "../utils/enums";
import {EXPORTED_FUNC} from "../utils/selectors";
import {IFunctionInfo} from "../utils/models";

export const RULE_NAME = 'sort-functions';
export type MessageIds = 'incorrectOrder';
export type Options = [];

// function getNumberOfEmptyLinesBetween(currentNode: TSESTree.Node | TSESTree.Token, nextNode: TSESTree.Node | TSESTree.Token | null, context: Readonly<RuleContext<MessageIds, Options>> ) {
//     if(!nextNode) return 0;
//
//     let linesBetweenImports = context.getSourceCode().lines.slice(
//         currentNode.loc.end.line,
//         nextNode.loc.start.line);
//
//     return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
// }

function getInsertRemoveFixers(fixer: RuleFixer, node: TSESTree.Node, funcNodeForInsertAfter: TSESTree.Node, text: string): Array<RuleFix> {
   return  [
        fixer.remove(node),
        fixer.insertTextAfter(funcNodeForInsertAfter, text),
    ];
}

export default createEslintRule({
    create(context: Readonly<RuleContext<MessageIds, Options>>) {
        const functions: Map<string, IFunctionInfo> = new Map();
        let lastExportedFunc: string, lastPrivateFunc: string, lastPublicFunc: string;


        return {
            FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
                if(!node.id) return;

                const functionName: string = node.id.name;
                const isPrivate: boolean = functionName.startsWith('_');

                functions.set(
                    functionName,
                    {
                        modificator: isPrivate ? FuncModificator.PRIVATE : FuncModificator.PUBLIC,
                        node
                    }
                );

                if(isPrivate) lastPrivateFunc = functionName
                else lastPublicFunc = functionName
            },
            [EXPORTED_FUNC](node: TSESTree.FunctionDeclaration){
                if(!node.id) return;

                const functionName: string = node.id.name;
                functions.set(functionName, {
                    modificator: FuncModificator.EXPORT,
                    node
                });

                lastExportedFunc = functionName;
            },
            "Program:exit"(){
                const sourceCode: Readonly<SourceCode> = context.getSourceCode();

                let functionsArray: Array<[string, IFunctionInfo]> = [...functions],
                    indexLastExportFunc: number = functionsArray.findIndex(([name]) => name === lastExportedFunc),
                    indexLastPrivateFunc: number = functionsArray.findIndex(([name]) => name === lastPrivateFunc),
                    indexLastPublicFunc: number = functionsArray.findIndex(([name]) => name === lastPublicFunc),
                    indexLastAnyPublicFunc: number  = indexLastPublicFunc > indexLastExportFunc ? indexLastPublicFunc : indexLastExportFunc;

                if(!functionsArray.length) return;

                for (let len = functionsArray.length - 1, i = len; 0 <= i; i--) {
                    const [fn, info]: [string, IFunctionInfo] = functionsArray[i];

                    if(
                        info.modificator === FuncModificator.PRIVATE && i < indexLastAnyPublicFunc
                    ) {

                        context.report({
                            node: info.node,
                            messageId: "incorrectOrder",
                            data: {
                                name: fn,
                                orderModificatorMessage: "public"
                            },
                            // TODO implement removing node considering empty line and /n, /t, comments
                            fix: (fixer: RuleFixer) => getInsertRemoveFixers(
                                fixer,
                                info.node,
                                functionsArray[indexLastAnyPublicFunc][1].node,
                                `\n\n${sourceCode.getText(info.node)}`
                            )

                        })
                    }

                    if(info.modificator === FuncModificator.PUBLIC && (i < indexLastExportFunc || (i > indexLastPrivateFunc && indexLastPrivateFunc >= 0))) {
                        context.report({
                            node: info.node,
                            messageId: "incorrectOrder",
                            data: {
                                name: fn,
                                orderModificatorMessage: "exported members but before private"
                            },
                            fix: (fixer: RuleFixer) => getInsertRemoveFixers(
                                fixer,
                                info.node,
                                functionsArray[indexLastExportFunc][1].node,
                                `\n\n${sourceCode.getText(info.node)}`
                            )

                        });
                    }
                }
            }
        }
    },
    name: RULE_NAME,
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
})
