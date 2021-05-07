// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API: 'http://localhost:3000'
  //API: 'http://oesvica.ddns.net:5005'
  //API: 'http://161.97.112.156:5002'
};

export interface TemplateNew {
  name: string;
  url: string;
}

export const TemplatesNew: TemplateNew[] = [
  {
    name: 'Plantilla_1',
    url: 'template-one',
  },
  {
    name: 'Plantilla_2',
    url: 'template-two',
  },
  {
    name: 'Plantilla_3',
    url: 'template-three',
  },
  {
    name: 'Plantilla_4',
    url: 'template-four',
  },
  {
    name: 'Plantilla_5',
    url: 'template-five',
  },
  {
    name: 'Plantilla_6',
    url: 'template-six',
  },
  {
    name: 'Plantilla_7',
    url: 'template-seven',
  },
  {
    name: 'Plantilla_8',
    url: 'template-eight',
  },
]
