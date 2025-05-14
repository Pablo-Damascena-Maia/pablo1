import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from '../../shared/services/usuario.service';


export const UserGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UsuarioService)
  if (usuarioService.usuarioAtual()?.usuario_tipo == 1) {
    return true;
  }else{
    return false;
  }
};
