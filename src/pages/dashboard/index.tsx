import React from 'react';
import { Package, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { ProductWithInventory } from '../../types/database.types';

export function Dashboard() {
  const [totalProducts, setTotalProducts] = React.useState<number>(0);
  const [lowStockCount, setLowStockCount] = React.useState<number>(0);
  const [totalSuppliers, setTotalSuppliers] = React.useState<number>(0);
  const [recentActivity, setRecentActivity] = React.useState<number>(0);
  const [lowStockItems, setLowStockItems] = React.useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Get total products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Get total suppliers count
        const { count: suppliersCount } = await supabase
          .from('suppliers')
          .select('*', { count: 'exact', head: true });
        
        // Get recent activity count (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: activityCount } = await supabase
          .from('inventory_transactions')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());
        
        // Get low stock items
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select(`
            *,
            product:product_id(
              id, name, description, sale_price, cost_price, supplier_id,
              supplier:supplier_id(id, name)
            )
          `)
          .lt('quantity', supabase.raw('minimum_quantity'));
        
        // Transform data
        const lowStock = inventoryData?.map(item => ({
          ...item.product,
          inventory: {
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            minimum_quantity: item.minimum_quantity,
            location: item.location,
            created_at: item.created_at,
            updated_at: item.updated_at
          },
          supplier: item.product.supplier
        })) || [];
        
        setTotalProducts(productsCount || 0);
        setTotalSuppliers(suppliersCount || 0);
        setRecentActivity(activityCount || 0);
        setLowStockCount(lowStock.length);
        setLowStockItems(lowStock as ProductWithInventory[]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : totalProducts}
            </div>
            <p className="text-xs text-gray-500">Produtos cadastrados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : lowStockCount}
            </div>
            <p className="text-xs text-gray-500">Itens abaixo do mínimo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fornecedores</CardTitle>
            <Users className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : totalSuppliers}
            </div>
            <p className="text-xs text-gray-500">Fornecedores ativos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Movimentações Recentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : recentActivity}
            </div>
            <p className="text-xs text-gray-500">Últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Itens com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : lowStockItems.length === 0 ? (
              <p className="text-gray-500">Não há itens com estoque baixo</p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Estoque: {item.inventory?.quantity} / Mínimo: {item.inventory?.minimum_quantity}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Crítico
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Carregando atividades recentes...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}