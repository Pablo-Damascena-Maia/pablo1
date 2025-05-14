import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { getTransactionTypeName } from '../../lib/utils';

type Transaction = {
  id: string;
  inventory_id: string;
  quantity: number;
  transaction_type: number;
  reference: string;
  notes: string;
  created_at: string;
  inventory: {
    product: {
      name: string;
    };
  };
};

export function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          *,
          inventory:inventory_id(
            product:product_id(
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  const getTransactionIcon = (type: number) => {
    switch (type) {
      case 1: // entry
        return <ArrowUp size={16} className="text-green-600" />;
      case 2: // exit
        return <ArrowDown size={16} className="text-red-600" />;
      case 3: // adjustment
        return <RefreshCcw size={16} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.inventory?.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Movimentações de Estoque</h1>
        <Button onClick={() => navigate('/transactions/new')}>
          Registrar Movimentação
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Histórico de Movimentações</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar movimentações..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Carregando movimentações...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {searchQuery ? 'Nenhuma movimentação encontrada para esta busca.' : 'Nenhuma movimentação registrada.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Quantidade</th>
                    <th className="px-4 py-3">Referência</th>
                    <th className="px-4 py-3">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {transaction.inventory?.product?.name || 'Produto não encontrado'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          {getTransactionIcon(transaction.transaction_type)}
                          <span>{getTransactionTypeName(transaction.transaction_type)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={
                          transaction.transaction_type === 1 ? 'text-green-600' : 
                          transaction.transaction_type === 2 ? 'text-red-600' : ''
                        }>
                          {transaction.transaction_type === 2 ? `-${transaction.quantity}` : transaction.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {transaction.reference || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {transaction.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}