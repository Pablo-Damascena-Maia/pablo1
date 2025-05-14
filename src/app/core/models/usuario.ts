import { UsuarioTipo } from "../../shared/enums/usuariotipo"

export interface Usuario {
  usuario_id : number,
  usuario_nome: string,
  usuario_email: string,
  usuario_identificacao: string,
  usuario_tipo: UsuarioTipo,
  usuario_endereco: string,
  usuario_codigo_postal: string,
  usuario_nacionalidade: string,
  usuario_foto: Blob,
  usuario_status: number
}
