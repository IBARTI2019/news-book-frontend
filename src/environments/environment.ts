// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API: 'https://api-dev-news.ibartisoftware.com.ve/api',
  cryptPass: 'SoyElMasCapo(PeroEnDisminutivo)$k&'
};

export interface TemplateNew {
  name: string;
  url: string;
  id: string;
  operation: string
}
