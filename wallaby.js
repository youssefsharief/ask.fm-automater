
module.exports = function (w) {
    const dotenv = require('dotenv');
    dotenv.config();
    require('reflect-metadata');
  
    return {
      files: [
        'test/ioc_config_test.ts',
        'src/**/*.ts',
        'test/testing-operations/**/*',
      ],
  
      tests: [
        'test/unit-tests/**/*.spec.ts',
      ],
      env: {
        type: 'node'
      },
      testFramework: "mocha",
    };
  };
  