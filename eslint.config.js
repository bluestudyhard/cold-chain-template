import Antfu from '@antfu/eslint-config'

export default Antfu({
  rules: {
    'no-undef': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'node/prefer-global/process': 'off',
    'vue/no-v-html': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-reactivity-loss': 'off',
    'unused-imports/no-unused-vars': 'off',
    'ts/no-this-alias': 'off',
    'style/indent': 'warn',
    'style/jsx-indent': 'warn',
    'vue/no-unused-refs': 'warn',
    'ts/consistent-type-imports': 'off',
  },
})
