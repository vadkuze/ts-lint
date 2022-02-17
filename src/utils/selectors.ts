export const ANY_STEP_DEFINITION_FUNC =
    'ExpressionStatement > CallExpression:matches(' +
    '[callee.name="And"], ' +
    '[callee.name="When"], ' +
    '[callee.name="But"], ' +
    '[callee.name="Given"], ' +
    '[callee.name="Then"])' +
    '[arguments.length=2]'

export const EXPORTED_FUNC = 'ExportNamedDeclaration > FunctionDeclaration'
