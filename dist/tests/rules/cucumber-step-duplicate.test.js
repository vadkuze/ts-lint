"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const cucumber_step_duplicate_1 = __importStar(require("../../src/rules/cucumber-step-duplicate"));
const ruleTester = new utils_1.ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json'
    },
});
const messageId = 'cucumberStepDuplicateLocalRequired';
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
    }); `,
    `
    Then('I should click Save button in {string} block', (blockName: string) => {
      basePage.clickSaveButton(blockName);
    });`
];
ruleTester.run(cucumber_step_duplicate_1.RULE_NAME, cucumber_step_duplicate_1.default, {
    valid: validStatements,
    invalid: [
        // { code: invalidStatements[0], errors: [{ messageId }, { messageId }] },
        { code: invalidStatements[1], errors: [{ messageId }] },
    ]
});
