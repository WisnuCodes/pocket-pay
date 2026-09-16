import { useState } from 'react';
import { useAuth } from '../hooks';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const Login = () => {
  const { login, register } = useAuth();
  const [tabIndex, setTabIndex] = useState(0); // 0: Login, 1: Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = tabIndex === 0;

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone_number: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleTabChange = (_event, newValue) => {
    setTabIndex(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          username: formData.username,
          phone_number: formData.phone_number,
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (err) {
      const displayMsg =
        err.userMessage ||
        err.response?.data?.message ||
        'Terjadi kesalahan saat memproses permintaan Anda.';
      setError(displayMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#ffffff' }}>
      {/* Left Panel - Visuals */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: 'white',
          p: 6,
        }}
      >
        {/* Abstract Background Shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(60px)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 12 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
              }}
            >
              <AccountBalanceWalletIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Typography variant="h5" fontWeight="700" letterSpacing="-0.02em">
              MiniWallet
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 480 }}>
            <Typography variant="h2" fontWeight="800" sx={{ mb: 3, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Kelola uang Anda dengan cara modern.
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400, mb: 6, lineHeight: 1.6 }}>
              Transaksi cepat, aman, dan mudah. MiniWallet membantu Anda melacak setiap pengeluaran dan pemasukan dalam satu genggaman.
            </Typography>
          </Box>
        </Box>

        {/* Floating Mockup Illustration */}
        <Box
          sx={{
            position: 'absolute',
            right: -80,
            bottom: -80,
            width: 500,
            height: 400,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            transform: 'rotate(-10deg)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            p: 4,
          }}
        >
          <Box sx={{ width: '100%', spaceY: 3 }}>
            <Box sx={{ height: 24, width: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ height: 60, flex: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
              <Box sx={{ height: 60, flex: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
            </Box>
            <Box sx={{ height: 120, width: '100%', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }} />
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Form */}
      <Box
        sx={{
          flex: { xs: 1, lg: '0 0 550px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6, md: 8 },
          position: 'relative',
        }}
      >
        {/* Mobile Logo */}
        <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5, mb: 6, width: '100%', maxWidth: 400 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 24, color: '#fff' }} />
          </Box>
          <Typography variant="h6" fontWeight="700" letterSpacing="-0.02em" color="text.primary">
            MiniWallet
          </Typography>
        </Box>

        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {isLogin ? 'Selamat Datang Kembali' : 'Mulai Bersama Kami'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
            {isLogin
              ? 'Silakan masuk ke akun Anda untuk melanjutkan.'
              : 'Buat akun baru untuk menikmati fitur MiniWallet.'}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 0, sm: 1 },
              mb: 4,
              bgcolor: 'transparent',
            }}
          >
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                minHeight: 48,
                bgcolor: '#f1f5f9',
                borderRadius: 2,
                p: 0.5,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  minHeight: 40,
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#0f172a',
                    bgcolor: '#ffffff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab label="Masuk Akun" disableRipple />
              <Tab label="Daftar Baru" disableRipple />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {!isLogin && (
                <>
                  <TextField
                    fullWidth
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nama Lengkap"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: '#ffffff' }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Username"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeOutlinedIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: '#ffffff' }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    placeholder="Nomor Handphone"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlinedIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2, bgcolor: '#ffffff' }
                    }}
                  />
                </>
              )}

              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Alamat Email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#ffffff' }
                }}
              />

              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password (Min. 8 Karakter)"
                variant="outlined"
                inputProps={{ minLength: 8 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#94a3b8' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#ffffff' }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : isLogin ? (
                  'Masuk Sekarang'
                ) : (
                  'Buat Akun'
                )}
              </Button>
            </Box>
          </Paper>

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <Link
              component="button"
              type="button"
              onClick={() => {
                setTabIndex(isLogin ? 1 : 0);
                setError('');
              }}
              sx={{
                fontWeight: 600,
                color: '#6366f1',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
