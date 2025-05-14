import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatCurrency, isLowStock } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { ProductWithInventory } from '../../types/database.types';

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState<ProductWithInventory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          inventory:inventory(id, quantity, minimum_quantity, location),
          supplier:supplier_id(id, name)
        `);

      if (error) throw error;

      // Transform data structure
      const transformedData = data.map(item => ({
        ...item,
        inventory: item.inventory?.[0] || null,
        supplier: item.supplier
      }));

      setProducts(transformedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      // Delete inventory first (due to foreign key constraint)
      await supabase
        .from('inventory')
        .delete()
        .eq('product_id', id);

      // Then delete product
      await supabase
        .from('products')
        .delete()
        .eq('id', id);

      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erro ao excluir produto. Verifique se não existem movimentações associadas.');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={() => navigate('/products/new')}>
          <Plus size={18} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lista de Produtos</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar produtos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando produtos...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? 'Nenhum produto encontrado para esta busca.' : 'Nenhum produto cadastrado.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Estoque</th>
                    <th className="px-4 py-3">Preço Venda</th>
                    <th className="px-4 py-3">Fornecedor</th>
                    <th className="px-4 py-3">Localização</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const lowStock = product.inventory && isLowStock(
                      product.inventory.quantity, 
                      product.inventory.minimum_quantity
                    );

                    return (
                      <tr 
                        key={product.id} 
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {product.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {lowStock && (
                              <AlertTriangle size={16} className="text-amber-500 mr-1" />
                            )}
                            <span className={lowStock ? 'text-amber-600 font-medium' : ''}>
                              {product.inventory?.quantity || 0}
                            </span>
                            {product.inventory && (
                              <span className="text-gray-500 text-xs ml-1">
                                (Min: {product.inventory.minimum_quantity})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(product.sale_price)}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {product.supplier?.name || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {product.inventory?.location || '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/products/${product.id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}