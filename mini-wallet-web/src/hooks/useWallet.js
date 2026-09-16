import { useState, useCallback } from 'react';
import { walletApi, formatRupiah } from '../api';

/**
 * Custom hook to manage wallet balance and wallet transactions (top-up, transfer)
 */
export const useWallet = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearFeedback = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  /**
   * Fetch current balance from API
   */
  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const response = await walletApi.getBalance();
      const currentBalance = response.data?.balance ?? response.data ?? 0;
      setBalance(Number(currentBalance));
      return currentBalance;
    } catch (err) {
      const msg = err.userMessage || 'Gagal memuat saldo dompet.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Top up wallet balance
   * @param {number|string} amount
   */
  const topup = useCallback(async (amount) => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      const validationMsg = 'Nominal top up harus lebih besar dari 0.';
      setError(validationMsg);
      throw new Error(validationMsg);
    }

    setTopupLoading(true);
    clearFeedback();

    try {
      const response = await walletApi.topup(numericAmount);
      // Refresh balance immediately
      await fetchBalance();
      setSuccess(`Top up berhasil sebesar ${formatRupiah(numericAmount)}!`);
      return response.data;
    } catch (err) {
      const msg = err.userMessage || 'Top up gagal diproses.';
      setError(msg);
      throw err;
    } finally {
      setTopupLoading(false);
    }
  }, [fetchBalance, clearFeedback]);

  /**
   * Transfer funds to another user
   * @param {{ to: string, amount: number|string }} payload
   */
  const transfer = useCallback(async ({ to, amount }) => {
    const numericAmount = Number(amount);
    if (!to || !to.trim()) {
      const validationMsg = 'Penerima transfer (email/nomor HP) wajib diisi.';
      setError(validationMsg);
      throw new Error(validationMsg);
    }

    if (!numericAmount || numericAmount <= 0) {
      const validationMsg = 'Nominal transfer harus lebih besar dari 0.';
      setError(validationMsg);
      throw new Error(validationMsg);
    }

    if (numericAmount > balance) {
      const validationMsg = 'Saldo tidak cukup.';
      setError(validationMsg);
      throw new Error(validationMsg);
    }

    setTransferLoading(true);
    clearFeedback();

    try {
      const response = await walletApi.transfer({ to: to.trim(), amount: numericAmount });
      // Refresh balance immediately
      await fetchBalance();
      setSuccess(`Transfer sebesar ${formatRupiah(numericAmount)} ke "${to.trim()}" berhasil!`);
      return response.data;
    } catch (err) {
      const msg = err.userMessage || 'Transfer gagal diproses.';
      setError(msg);
      throw err;
    } finally {
      setTransferLoading(false);
    }
  }, [balance, fetchBalance, clearFeedback]);

  return {
    balance,
    loading,
    topupLoading,
    transferLoading,
    error,
    success,
    setError,
    setSuccess,
    clearFeedback,
    fetchBalance,
    topup,
    transfer,
    formatRupiah,
  };
};

export default useWallet;
