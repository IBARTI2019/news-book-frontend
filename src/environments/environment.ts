// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API: 'http://66.23.233.252:9999/api'
  //API: 'http://oesvica.ddns.net:5005'
  //API: 'http://161.97.112.156:5002'
};

export interface TemplateNew {
  name: string;
  url: string;
  id: string;
}

export const TemplatesNew: TemplateNew[] = [
  {
    name: 'Plantilla_1',
    url: 'template-one',
    id: 'templateOne',
  },
  {
    name: 'Plantilla_2',
    url: 'template-two',
    id: 'templateTwo',
  },
  {
    name: 'Plantilla_3',
    url: 'template-three',
    id: 'templateThree',
  },
  {
    name: 'Plantilla_4',
    url: 'template-four',
    id: 'templateFour',
  },
  {
    name: 'Plantilla_5',
    url: 'template-five',
    id: 'templateFive',
  },
  {
    name: 'Plantilla_6',
    url: 'template-six',
    id: 'templateSix',
  },
  {
    name: 'Plantilla_7',
    url: 'template-seven',
    id: 'templateSeven',
  },
  {
    name: 'Plantilla_8',
    url: 'template-eight',
    id: 'templateEight',
  },
]
