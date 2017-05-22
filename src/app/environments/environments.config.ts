/**
 * Be sure to set NODE_ENV to the envName configured below
 * to load its configuration on Ionic serve / build or any other command
 * 
 * eg: export NODE_ENV=prod && ionic serve
 */
export const environmentList = [
  {
    envName: 'khalid',
    apiEndpoint: 'http://localhost/~BAWES/payroll/candidate/web/v1',
    environmentName: 'Khalid Local Machine'
  },
  {
    envName: 'krushn',
    apiEndpoint: 'http://localhost/payroll/candidate/web/v1',
    environmentName: 'Krushn Local Machine'
  },
  {
    envName: 'anil',
    apiEndpoint: 'http://candidate.payroll.local/v1',
    environmentName: 'Anil Local Machine'
  },
  {
    envName: 'prod',
    apiEndpoint: 'https://payroll-candidate.studenthub.co/v1',
    environmentName: 'Production Server'
  },
  {
    envName: 'dev',
    apiEndpoint: 'http://payroll-candidate.dev.studenthub.co/v1',
    environmentName: 'Dev Server'
  }
];