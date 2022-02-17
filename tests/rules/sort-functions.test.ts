import {ESLintUtils} from "@typescript-eslint/utils";
import rule, { MessageIds, RULE_NAME } from "../../src/rules/sort-functions";


const ruleTester: ESLintUtils.RuleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
});

const messageId: MessageIds = 'incorrectOrder';

let validStatements = [
    `export function testExported(){}
    function testPublic(){}
    function _testPrivate(){}`,
    `function testPublic(){}`,
    `export function testExported(){}`,
    `function _testPrivate(){}`,
];

let invalidStatements = [
    {
        code:
        `export function testExported(){}function _testPrivate(){}function testPublic(){}`,
        output: 
        `export function testExported(){}function testPublic(){}\n\nfunction _testPrivate(){}`,
    },
]

ruleTester.run(RULE_NAME, rule, {
    valid: validStatements,
    invalid: [
        { code: invalidStatements[0].code.trim(), errors: [{ messageId }, { messageId }], output: invalidStatements[0].output },
        
    ]
})
