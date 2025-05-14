import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(mod => mod.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(mod => mod.HomeComponent),
    children:[
      {
        path: '',
        loadComponent: () => import ('./features/catalogo/catalogo.component').then(mod => mod.CatalogoComponent)
      },
      {
        path: 'visitacao',
        loadComponent: () => import ('./features/visitacao/visitacao.component').then(mod => mod.VisitacaoComponent)
      },
      {
        path: 'cursos',
        loadComponent: () => import ('./features/cursos/cursos.component').then(mod => mod.CursosComponent)
      },
      {
        path: 'doacoes',
        loadComponent: () => import ('./features/doacoes/doacoes.component').then(mod => mod.DoacoesComponent)
      },
      {
        path: 'carrinho',
        loadComponent: () => import ('./features/carrinho/carrinho.component').then(mod => mod.CarrinhoComponent)
      },
      {
        path: 'pagamento',
        loadComponent: () => import ('./features/pagamento/pagamento.component').then(mod => mod.PagamentoComponent)
      } ,
      {
        path: 'usuario',
        loadComponent: () => import ('./shared/components/user-view/user-view.component').then(mod => mod.UserViewComponent)
      }
    ]
  }
];
