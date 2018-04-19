module.exports = {
  parser: 'babel-eslint',
  plugins: ['react'],
  extends: ['standard', 'standard-react'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-undef': 0,
    'no-eval': 0,
    'no-new-func': 0,
    'jsx-quotes': [2, 'prefer-double'], // 使用双引号
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/prop-types': 0, // 允许缺少类型检验
    'react/self-closing-comp': 0 // 允许自闭合组件, <Abc />
  }
}
