module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    files: [
      'src/**/*.spec.ts'
    ],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.spec.json'
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'karma-typescript'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    restartOnFileChange: true
  });
};
