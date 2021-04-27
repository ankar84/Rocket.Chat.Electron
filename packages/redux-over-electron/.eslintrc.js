module.exports = {
  root: true,
  extends: '@rocket.chat/eslint-config-alt/typescript',
  rules: {
    'new-cap': ['error', { capIsNewExceptions: ['Reconciler'] }],
  },
  env: {
    jest: true,
  },
};
