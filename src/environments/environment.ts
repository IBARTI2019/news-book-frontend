// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API: 'http://194.163.161.64:8000/api',
  // API: 'http://66.23.233.252:9999/api',
  //API: 'http://localhost:8000/api',
  //API: 'http://oesvica.ddns.net:5005',
  //API: 'http://161.97.112.156:5002',
  cryptPass: 'SoyElMasCapo(PeroEnDisminutivo)$k&'
};

export interface TemplateNew {
  name: string;
  url: string;
  id: string;
  operation: string
}
