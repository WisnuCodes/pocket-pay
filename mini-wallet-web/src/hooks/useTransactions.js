import { useState, useMemo, useCallback } from 'react';
import { walletApi } from '../api';

/**
 * Custom hook to manage transaction history, filtering, and searching
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'topup', 'transfer_in', 'transfer_out'
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetch transaction history from API
   */
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await walletApi.getTransactions();
      const list = Array.isArray(response.data) ? response.data : [];
      setTransactions(list);
      return list;
    } catch (err) {
      const msg = err.userMessage || 'Gagal memuat riwayat transaksi.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filter and search transactions based on criteria
   */
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    // Filter by type
    if (filter !== 'all') {
      result = result.filter((trx) => trx.type === filter);
    }

    // Search query matching description, reference_id, or amount
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((trx) => {
        const descMatch = trx.description?.toLowerCase().includes(query);
        const refMatch = trx.reference_id?.toLowerCase().includes(query);
        const amountMatch = String(trx.amount).includes(query);
        const typeMatch = trx.type?.replace('_', ' ').toLowerCase().includes(query);
        return descMatch || refMatch || amountMatch || typeMatch;
      });
    }

    return result;
  }, [transactions, filter, searchQuery]);

  /**
   * Computed summary statistics
   */
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((trx) => {
      const amount = Number(trx.amount) || 0;
      if (trx.type === 'topup' || trx.type === 'transfer_in') {
        totalIncome += amount;
      } else if (trx.type === 'transfer_out') {
        totalExpense += amount;
      }
    });

    return {
      totalIncome,
      totalExpense,
      totalCount: transactions.length,
    };
  }, [transactions]);

  return {
    transactions,
    filteredTransactions,
    loading,
    error,
    filter,
    searchQuery,
    stats,
    setFilter,
    setSearchQuery,
    fetchTransactions,
    refresh: fetchTransactions,
    clearError: () => setError(''),
  };
};

export default useTransactions;
