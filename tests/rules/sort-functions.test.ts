import {ESLintUtils} from "@typescript-eslint/utils";
import rule, { MessageIds, RULE_NAME } from "../../src/rules/sort-functions";


const ruleTester: ESLintUtils.RuleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
});

const messageId: MessageIds = 'incorrectOrder';

let validStatements = [`
    // export function testExported(){}
    // function testPublic(){}
    // function _testPrivate(){}
`];

let invalidStatements = [
    {
        code:
        `
            export function testExported() {
            
            }
            
            function testPublic() {
            
            }
            
            export function testExported2() {
            
            }
            
            function _testPrivate() {
            
            }
            
            function _testPrivate2() {
            
            }
            function _testPrivate3() {
            
            }
            
            export function testExported3() {
            
            }
        `,
        output:
        `
            export function testExported() {
            
            }
            
            function testPublic() {
            
            }
            
            export function testExported2() {
            
            }
            
            
            function _testPrivate2() {
            
            }
            function _testPrivate3() {
            
            }
            
            export function testExported3() {
            
            }
            
            function _testPrivate() {
            
            }
        `
    },
    {
        code:
        `
            export function testExported(){}
            function testPublic(){}
            // function _testPrivate(){}
            export function testExported2(){}
            function _testPrivate2(){}
        `,
        output: ''
    }
]

ruleTester.run(RULE_NAME, rule, {
    valid: validStatements,
    invalid: [
        { code: invalidStatements[0].code.trim(), errors: [{ messageId }, { messageId }, { messageId }, { messageId }], output: invalidStatements[0].output.trim()},
        // { code: invalidStatements[1], errors: [{ messageId }] },
    ]
})
