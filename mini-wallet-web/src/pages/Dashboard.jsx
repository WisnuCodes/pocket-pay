import { useState, useEffect } from 'react';
import { useAuth, useWallet, useTransactions } from '../hooks';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  InputAdornment,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Stack,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const {
    balance,
    loading: walletLoading,
    topupLoading,
    transferLoading,
    error: walletError,
    success: walletSuccess,
    setError: setWalletError,
    setSuccess: setWalletSuccess,
    clearFeedback: clearWalletFeedback,
    fetchBalance,
    topup,
    transfer,
    formatRupiah,
  } = useWallet();

  const {
    filteredTransactions,
    loading: trxLoading,
    error: trxError,
    filter,
    searchQuery,
    stats,
    setFilter,
    setSearchQuery,
    fetchTransactions,
    clearError: clearTrxError,
  } = useTransactions();

  const [initialLoading, setInitialLoading] = useState(true);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [transferData, setTransferData] = useState({ to: '', amount: '' });

  // Initial load
  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        await Promise.all([fetchBalance(), fetchTransactions()]);
      } catch (err) {
        console.error('Initial data fetch error:', err);
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, [fetchBalance, fetchTransactions]);

  const handleRefresh = async () => {
    clearWalletFeedback();
    clearTrxError();
    await Promise.all([fetchBalance(), fetchTransactions()]);
  };

  const handleTopupSubmit = async (e) => {
    e.preventDefault();
    if (!topupAmount || Number(topupAmount) <= 0) return;

    try {
      await topup(topupAmount);
      setTopupAmount('');
      setShowTopup(false);
      fetchTransactions();
    } catch {
      // Error handled by useWallet hook
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferData.to || !transferData.amount) return;

    try {
      await transfer({ to: transferData.to, amount: transferData.amount });
      setTransferData({ to: '', amount: '' });
      fetchTransactions();
    } catch {
      // Error handled by useWallet hook
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={44} thickness={4} />
        <Typography variant="body2" color="text.secondary">
          Memuat data akun Anda...
        </Typography>
      </Box>
    );
  }

  const activeError = walletError || trxError;
  const activeSuccess = walletSuccess;

  // Generate initials for avatar
  const userInitials = (user?.name || user?.username || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Top Navigation Bar */}
      <Box
        component="header"
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          px: { xs: 2, sm: 4 },
          py: 1.75,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <Box sx={{ maxWidth: 'lg', mx: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px -2px rgba(37, 99, 235, 0.35)',
              }}
            >
              <AccountBalanceWalletIcon fontSize="small" />
            </Box>
            <Typography variant="h6" component="h1" fontWeight="800" sx={{ letterSpacing: '-0.02em', color: '#111827' }}>
              MiniWallet
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Muat ulang data">
              <IconButton
                onClick={handleRefresh}
                size="small"
                disabled={walletLoading || trxLoading}
                sx={{ border: '1px solid #e5e7eb' }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* User Profile Capsule */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                pl: 1.5,
                pr: 0.5,
                py: 0.5,
                borderRadius: 3,
                bgcolor: '#f9fafb',
                border: '1px solid #e5e7eb',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  bgcolor: 'primary.main',
                }}
              >
                {userInitials}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', pr: 1 }}>
                <Typography variant="body2" fontWeight="700" color="text.primary" sx={{ lineHeight: 1.2 }}>
                  {user?.name || 'Pengguna'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || user?.username || ''}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                borderColor: '#e5e7eb',
                color: '#4b5563',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#d1d5db',
                  bgcolor: '#f3f4f6',
                },
              }}
            >
              Keluar
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Global Alerts */}
        {activeError && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => {
              setWalletError('');
              clearTrxError();
            }}
          >
            {activeError}
          </Alert>
        )}

        {activeSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setWalletSuccess('')}
          >
            {activeSuccess}
          </Alert>
        )}

        {/* Stats and Action Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Main Balance Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                p: 3,
                bgcolor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="700" color="text.secondary" textTransform="uppercase">
                    Saldo Aktif
                  </Typography>
                  <Chip
                    icon={<SwapHorizIcon />}
                    label="Dompet Utama"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: '0.75rem', borderColor: '#e5e7eb' }}
                  />
                </Box>

                <Typography
                  variant="h3"
                  component="div"
                  fontWeight="800"
                  sx={{
                    color: '#111827',
                    letterSpacing: '-0.02em',
                    mb: 3,
                    wordBreak: 'break-word',
                  }}
                >
                  {formatRupiah(balance)}
                </Typography>

                {/* Sub-stats Overview */}
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#f0fdf4',
                        border: '1px solid #dcfce7',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                        <TrendingUpIcon sx={{ fontSize: 16, color: '#16a34a' }} />
                        <Typography variant="caption" fontWeight="600" color="#166534">
                          Total Masuk
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700" color="#15803d">
                        {formatRupiah(stats.totalIncome)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: '#fef2f2',
                        border: '1px solid #fee2e2',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                        <TrendingDownIcon sx={{ fontSize: 16, color: '#dc2626' }} />
                        <Typography variant="caption" fontWeight="600" color="#991b1b">
                          Total Keluar
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="700" color="#b91c1c">
                        {formatRupiah(stats.totalExpense)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Top-up Form / Toggle */}
                {!showTopup ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddCircleOutlinedIcon />}
                    onClick={() => {
                      setShowTopup(true);
                      clearWalletFeedback();
                    }}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      px: 3,
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    Top Up Saldo
                  </Button>
                ) : (
                  <Box component="form" onSubmit={handleTopupSubmit} sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1 }}>
                      Pilih atau Masukkan Nominal Top Up:
                    </Typography>

                    {/* Quick Amount Chips */}
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {QUICK_AMOUNTS.map((amt) => (
                        <Chip
                          key={amt}
                          label={formatRupiah(amt)}
                          onClick={() => setTopupAmount(String(amt))}
                          variant={Number(topupAmount) === amt ? 'filled' : 'outlined'}
                          color={Number(topupAmount) === amt ? 'primary' : 'default'}
                          clickable
                          sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                        />
                      ))}
                    </Stack>

                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Nominal (IDR)"
                        variant="outlined"
                        size="small"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value)}
                        required
                        inputProps={{ min: 1 }}
                        placeholder="Contoh: 100000"
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={
                          topupLoading ||
                          !topupAmount ||
                          Number(topupAmount) <= 0 ||
                          !Number.isInteger(Number(topupAmount))
                        }
                        startIcon={topupLoading ? <CircularProgress size={18} color="inherit" /> : null}
                        sx={{ textTransform: 'none', fontWeight: 600, minWidth: 100 }}
                      >
                        {topupLoading ? 'Proses...' : 'Kirim'}
                      </Button>
                      <Button
                        variant="text"
                        color="inherit"
                        onClick={() => {
                          setShowTopup(false);
                          setTopupAmount('');
                        }}
                        sx={{ textTransform: 'none' }}
                      >
                        Batal
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Transfer Form Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                p: 3,
                bgcolor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)',
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SendIcon color="primary" fontSize="small" />
                  <Typography variant="h6" component="h2" fontWeight="700">
                    Transfer Saldo
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  Kirim saldo ke sesama pengguna MiniWallet secara instan tanpa biaya admin.
                </Typography>

                <Box component="form" onSubmit={handleTransferSubmit} noValidate>
                  <TextField
                    fullWidth
                    label="Tujuan Transfer (Email atau No. Handphone)"
                    variant="outlined"
                    size="small"
                    placeholder="Contoh: user@email.com atau 08123456789"
                    value={transferData.to}
                    onChange={(e) => setTransferData({ ...transferData, to: e.target.value })}
                    required
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Nominal Transfer (IDR)"
                    variant="outlined"
                    size="small"
                    placeholder="Contoh: 50000"
                    value={transferData.amount}
                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    required
                    inputProps={{ min: 1 }}
                    helperText={`Maksimal transfer: ${formatRupiah(balance)}`}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={
                      transferLoading ||
                      !transferData.to.trim() ||
                      !transferData.amount ||
                      Number(transferData.amount) <= 0 ||
                      !Number.isInteger(Number(transferData.amount)) ||
                      Number(transferData.amount) > balance
                    }
                    startIcon={transferLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    sx={{
                      borderRadius: 2,
                      py: 1.25,
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                    }}
                  >
                    {transferLoading ? 'Memproses Pengiriman...' : 'Kirim Uang Sekarang'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Transaction History Section */}
        <Card
          sx={{
            borderRadius: 3,
            p: 3,
            bgcolor: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 16px -2px rgba(0,0,0,0.04)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Header & Controls */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
                mb: 2.5,
              }}
            >
              <Box>
                <Typography variant="h6" component="h2" fontWeight="700">
                  Riwayat Transaksi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Daftar transaksi masuk dan keluar di akun Anda
                </Typography>
              </Box>

              {/* Search Field */}
              <TextField
                size="small"
                placeholder="Cari transaksi atau ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', sm: 260 } }}
              />
            </Box>

            {/* Filter Tabs */}
            <Tabs
              value={filter}
              onChange={(_e, val) => setFilter(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  minHeight: 44,
                },
              }}
            >
              <Tab label={`Semua (${stats.totalCount})`} value="all" />
              <Tab label="Top Up" value="topup" />
              <Tab label="Transfer Masuk" value="transfer_in" />
              <Tab label="Transfer Keluar" value="transfer_out" />
            </Tabs>

            {/* Transactions Table */}
            <TableContainer>
              <Table aria-label="tabel riwayat transaksi">
                <TableHead>
                  <TableRow sx={{ '& th': { borderBottom: '2px solid #f3f4f6', color: '#6b7280', fontWeight: 700, fontSize: '0.8rem' } }}>
                    <TableCell>JENIS</TableCell>
                    <TableCell>DESKRIPSI & REF</TableCell>
                    <TableCell align="right">NOMINAL</TableCell>
                    <TableCell align="right">TANGGAL & WAKTU</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trxLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Memperbarui data transaksi...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Box sx={{ maxWidth: 300, mx: 'auto', textAlign: 'center' }}>
                          <Typography variant="subtitle1" fontWeight="600" color="text.primary" gutterBottom>
                            Tidak Ada Transaksi
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchQuery
                              ? `Tidak ditemukan transaksi dengan kata kunci "${searchQuery}".`
                              : 'Belum ada catatan aktivitas pada kategori ini.'}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((trx, index) => {
                      const isIncome = trx.type === 'topup' || trx.type === 'transfer_in';
                      let chipLabel = 'Top Up';
                      let chipColor = 'primary';

                      if (trx.type === 'transfer_in') {
                        chipLabel = 'Masuk';
                        chipColor = 'success';
                      } else if (trx.type === 'transfer_out') {
                        chipLabel = 'Keluar';
                        chipColor = 'warning';
                      }

                      return (
                        <TableRow
                          key={trx.id || trx.reference_id || `trx-${index}`}
                          sx={{
                            '&:hover': { bgcolor: '#f9fafb' },
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell>
                            <Chip
                              icon={isIncome ? <CallReceivedIcon fontSize="small" /> : <CallMadeIcon fontSize="small" />}
                              label={chipLabel}
                              color={chipColor}
                              size="small"
                              variant="filled"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                borderRadius: 1.5,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="600" color="text.primary">
                              {trx.description || 'Transaksi'}
                            </Typography>
                            {trx.reference_id && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                                Ref: {trx.reference_id}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.95rem',
                              color: isIncome ? '#16a34a' : '#111827',
                            }}
                          >
                            {isIncome ? '+' : '-'}{formatRupiah(trx.amount)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                            {trx.created_at
                              ? new Date(trx.created_at).toLocaleString('id-ID', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })
                              : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer Summary */}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Menampilkan {filteredTransactions.length} dari {stats.totalCount} transaksi
              </Typography>
              <Button
                variant="text"
                size="small"
                startIcon={<RefreshIcon fontSize="small" />}
                onClick={() => fetchTransactions()}
                disabled={trxLoading}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
              >
                Segarkan Daftar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Dashboard;
