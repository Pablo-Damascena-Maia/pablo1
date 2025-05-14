import { ProdutoTipo } from "../../shared/enums/produtotipo";

export interface Produto {
  produto_id : number,
  produto_nome : string,
  produto_descricao : string,
  produto_status : number,
  produto_tipo : ProdutoTipo,
  fabricante_id : number,
  categoria_id : number
}
