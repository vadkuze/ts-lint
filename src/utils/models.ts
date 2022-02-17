import {TSESTree} from "@typescript-eslint/utils";
import {FuncModificator} from "./enums";
import {RuleContext} from "@typescript-eslint/utils/dist/ts-eslint";
import {MessageIds, Options} from "../rules/cucumber-step-duplicate";
// export interface ISteDuplicateInfo { duplicateFileName: string, value: string, stepNode: TSESTree.LiteralExpression | null}
export interface IStepDefinition { repeats: number, node: TSESTree.LiteralExpression, context?: Readonly<RuleContext<MessageIds, Options>> }
export interface IFunctionInfo { modificator: FuncModificator, node: TSESTree.FunctionDeclaration}
