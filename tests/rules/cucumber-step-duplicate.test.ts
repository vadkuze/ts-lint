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
    `import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

    const basePage: BasePo = new BasePo();
    
    Then('I should go to {string} page', (path: string) => {
      if (path.toLocaleLowerCase() === 'lms') {
        openLMS();
    
        return;
      }
    
      openLMS(path.toLocaleLowerCase());
    });
    
    Then('I should click Save button in {string} block', (blockName: string) => {
      basePage.clickSaveButton(blockName);
    });
    
    Then('I should check that changes are saved', () => {
      basePage.checkAllSaved();
    });
    
    When(\`I should see who can approve text {string}\`, (text: string) => {
      userPage.checkQualificationPermission(text);
    });
    
    When(\`I should see who can approve text {string}\`, (text: string) => {
      userPage.checkQualificationPermission(text);
    });
    
    Then(
      'I should see status label in {string} block with {string} text',
      (blockName: string, statusText: string) => {
        basePage.checkContentStatus(blockName, statusText);
      },
    );
    
    Then(
      'I should see status label in {string} block with {string} text',
      (blockName: string, statusText: string) => {
        basePage.checkContentStatus(blockName, statusText);
      },
    );
    
    When(\`I should open information block with {string} name\`, (informationName: string) => {
      basePage.openInformationBlockByName(informationName);
    }); `
    ,

    `
    Then('I should click Save button in {string} block', (blockName: string) => {
      basePage.clickSaveButton(blockName);
    });`
];

ruleTester.run(RULE_NAME, rule, {
    valid: validStatements,
    invalid: [
        // { code: invalidStatements[0], errors: [{ messageId }, { messageId }] },
        { code: invalidStatements[1], errors: [{ messageId }] },
    ]
})
