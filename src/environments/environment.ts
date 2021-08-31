// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API: 'http://66.23.233.252:9999/api',
  //API: 'http://127.0.0.1:8000/api',
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

export const TemplatesNew: TemplateNew[] = [
  {
    name: 'Plantilla por Defecto',
    url: 'template-four',
    id: 'templateFour',
    operation: 'N/A',
  },
  {
    name: 'Registro de Rondas',
    url: 'template-one',
    id: 'templateOne',
    operation: 'N/A',
  },
  {
    name: 'Entrada de Vehiculos',
    url: 'template-two',
    id: 'templateTwoIn',
    operation: 'ENTRADA',
  },
  {
    name: 'Salida de Vehiculos',
    url: 'template-two',
    id: 'templateTwoOut',
    operation: 'SALIDA',
  },
  {
    name: 'Entrada de Materiales',
    url: 'template-three',
    id: 'templateThreeIn',
    operation: 'ENTRADA',
  },
  {
    name: 'Salida de Materiales',
    url: 'template-three',
    id: 'templateThereOut',
    operation: 'SALIDA',
  },
  {
    name: 'Plantilla_5',
    url: 'template-five',
    id: 'templateFive',
    operation: 'N/A',
  },
  {
    name: 'Plantilla_6',
    url: 'template-six',
    id: 'templateSix',
    operation: 'N/A',
  },
  {
    name: 'Plantilla_7',
    url: 'template-seven',
    id: 'templateSeven',
    operation: 'N/A',
  },
  {
    name: 'Plantilla_8',
    url: 'template-eight',
    id: 'templateEight',
    operation: 'N/A',
  },
]
