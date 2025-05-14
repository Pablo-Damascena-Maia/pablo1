import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../enviroment';
import { Usuario } from '../../core/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly baseUrl: string;

  usuarioAtual = signal<Usuario | null>(null);

  constructor(private http: HttpClient, private jwtHelper:JwtHelperService) {
    this.baseUrl = environment.microserviceUsuario + 'usuario';
  }


}
