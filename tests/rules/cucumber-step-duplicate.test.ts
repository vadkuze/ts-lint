import { ESLintUtils } from '@typescript-eslint/utils';
import rule, { MessageIds, RULE_NAME } from '../../src/rules/cucumber-step-duplicate';

const ruleTester: ESLintUtils.RuleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
});

const messageId: MessageIds = 'cucumberStepDuplicateLocalRequired';

// TODO: replace code examples on custom code

let validStatements = [
    `But(\`I should click on Close button\`, () => {
      basePage.clickCloseButton();
    });`
];

let invalidStatements = [
    `But(\`I should click on Close button\`, () => {
      basePage.clickCloseButton();
    });
    
    But(\`I should click on Close button\`, () => {
      basePage.clickCloseButton();
    });`
    ,
];

ruleTester.run(RULE_NAME, rule, {
    valid: validStatements,
    invalid: [
        { code: invalidStatements[0], errors: [{ messageId }] },
    ]
})
