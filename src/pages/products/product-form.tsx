import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { Product, Supplier } from '../../types/database.types';

type ProductFormData = {
  name: string;
  description: string;
  sale_price: string;
  cost_price: string;
  supplier_id: string;
  quantity: string;
  minimum_quantity: string;
  location: string;
};

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(isEditing);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ProductFormData>();

  React.useEffect(() => {
    async function fetchSuppliers() {
      const { data } = await supabase
        .from('suppliers')
        .select('*')
        .eq('status', 1);
      
      setSuppliers(data || []);
    }

    async function fetchProduct() {
      if (!id) return;

      try {
        // Fetch product
        const { data: product } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!product) {
          navigate('/products');
          return;
        }

        // Fetch inventory
        const { data: inventory } = await supabase
          .from('inventory')
          .select('*')
          .eq('product_id', id)
          .single();

        setValue('name', product.name);
        setValue('description', product.description || '');
        setValue('sale_price', product.sale_price?.toString() || '');
        setValue('cost_price', product.cost_price?.toString() || '');
        setValue('supplier_id', product.supplier_id || '');
        
        if (inventory) {
          setValue('quantity', inventory.quantity?.toString() || '0');
          setValue('minimum_quantity', inventory.minimum_quantity?.toString() || '0');
          setValue('location', inventory.location || '');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setInitialLoading(false);
      }
    }

    fetchSuppliers();
    if (isEditing) {
      fetchProduct();
    } else {
      setInitialLoading(false);
    }
  }, [id, isEditing, navigate, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      // Convert string values to appropriate types
      const productData = {
        name: data.name,
        description: data.description || null,
        sale_price: data.sale_price ? parseFloat(data.sale_price) : null,
        cost_price: data.cost_price ? parseFloat(data.cost_price) : null,
        supplier_id: data.supplier_id || null,
      };

      const inventoryData = {
        quantity: data.quantity ? parseInt(data.quantity) : 0,
        minimum_quantity: data.minimum_quantity ? parseInt(data.minimum_quantity) : 0,
        location: data.location || null,
      };

      let productId = id;

      if (isEditing) {
        // Update existing product
        const { error: productError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (productError) throw productError;

        // Update inventory
        const { error: inventoryError } = await supabase
          .from('inventory')
          .update(inventoryData)
          .eq('product_id', id);

        if (inventoryError) throw inventoryError;
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (productError) throw productError;
        productId = newProduct.id;

        // Create inventory entry
        const { error: inventoryError } = await supabase
          .from('inventory')
          .insert({
            ...inventoryData,
            product_id: productId,
          });

        if (inventoryError) throw inventoryError;
      }

      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" required>Nome do Produto</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  error={errors.name?.message}
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  error={errors.description?.message}
                  placeholder="Descrição detalhada do produto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sale_price">Preço de Venda (R$)</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    {...register('sale_price')}
                    error={errors.sale_price?.message}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="cost_price">Preço de Custo (R$)</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step="0.01"
                    {...register('cost_price')}
                    error={errors.cost_price?.message}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplier_id">Fornecedor</Label>
                <select
                  id="supplier_id"
                  className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...register('supplier_id')}
                >
                  <option value="">Selecione um fornecedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações de Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade em Estoque</Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register('quantity')}
                    error={errors.quantity?.message}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="minimum_quantity">Quantidade Mínima</Label>
                  <Input
                    id="minimum_quantity"
                    type="number"
                    {...register('minimum_quantity')}
                    error={errors.minimum_quantity?.message}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Localização no Estoque</Label>
                <Input
                  id="location"
                  {...register('location')}
                  error={errors.location?.message}
                  placeholder="Ex: Prateleira A3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products')}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : (
              <>
                <Save size={18} className="mr-2" />
                Salvar Produto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}