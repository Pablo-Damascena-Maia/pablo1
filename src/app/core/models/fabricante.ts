import { FabricanteTipo } from "../../shared/enums/fabricantetipo";

export interface Fabricante {
  fabricante_id : number,
  fabricante_nome: string,
  fabricante_identificacao: string,
  fabricante_tipo: FabricanteTipo,
  fabricante_email: string,
  fabricante_telefone:string,
  fabricante_status: number
}
