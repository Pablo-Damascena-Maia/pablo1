export const environment = {
  //apiServer: 'http://localhost:8080/',
  apiGateway:             'http://10.136.38.50:7000',
  microserviceUsuario:    'http://10.136.38.50:7010',
  microserviceCompra:     'http://10.136.38.50:7020',
  microservicePagamento:  'http://10.136.38.50:7030',
  microserviceProduto:    'http://10.136.38.50:7040',
  microserviceEstoque:    'http://10.136.38.50:7000',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
};