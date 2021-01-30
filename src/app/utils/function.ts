import { ActivatedRouteSnapshot } from '@angular/router';

/**
 * Funcion para retornar un string con el path de la ruta
 * @param paths lista de `ActivatedRouteSnapshot`
 */
export function pathFromRootConcat(paths: ActivatedRouteSnapshot[]): string {
  return paths.reduce((acc, v) => {
    if (v.routeConfig && v.routeConfig.path !== '') {
      //acc.push(v.routeConfig.path);
    }
    return acc;
  }, []).join('/');
}
