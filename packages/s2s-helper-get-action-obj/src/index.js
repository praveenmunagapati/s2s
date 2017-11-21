// @flow
import { parse } from 'babylon'
import traverse from 'babel-traverse'
import type { Code } from 'types'
// import blog from 'babel-log'

const ACTIONS = 'Actions'

export default function getActionObj(code: Code): string[] {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['flow', 'objectRestSpread'],
  })
  const actions = []

  traverse(ast, {
    VariableDeclarator(path) {
      if (path.get('id').node.name !== ACTIONS) {
        return
      }
      const objPath = path.get('init')
      if (!objPath.isObjectExpression()) {
        return
      }
      const props = objPath.get('properties')
      for (const prop of props) {
        actions.push(prop.get('key').node.name)
      }
    },
  })

  return actions
}
