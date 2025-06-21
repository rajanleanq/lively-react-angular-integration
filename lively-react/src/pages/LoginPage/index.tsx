import React from "react";
import {
  Box,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Restaurant,
  Login as LoginIcon,
} from "@mui/icons-material";
import { useLoginForm } from "./hook";

export const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    formData,
    showPassword,
    loading,
    error,
    handleInputChange,
    handleTogglePasswordVisibility,
    handleSubmit,
    handleDemoLogin,
  } = useLoginForm();

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
      }}
      data-testid="login-container"
    >
      <Paper
        elevation={8}
        sx={{ width: "100%", borderRadius: 3, overflow: "hidden" }}
        data-testid="login-paper"
        aria-label="Login form"
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 4,
            px: 3,
            textAlign: "center",
          }}
        >
          <Restaurant
            sx={{
              fontSize: 48,
              mb: 2,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
            aria-hidden="true"
          />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Lunch Management
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Sign in to access your account
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Quick Demo Access:
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin(true)}
                sx={{ flex: 1 }}
                data-testid="admin-demo-button"
              >
                Admin Demo
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin(false)}
                sx={{ flex: 1 }}
                data-testid="user-demo-button"
              >
                User Demo
              </Button>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
            data-testid="login-form"
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!error && !formData.email}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                "aria-describedby": error ? "login-error" : undefined,
                "data-testid": "email-input",
              }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!error && !formData.password}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      data-testid="toggle-password-button"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                "aria-describedby": error ? "login-error" : undefined,
                "data-testid": "password-input",
              }}
            />

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                id="login-error"
                role="alert"
                aria-live="assertive"
                data-testid="login-error-alert"
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
                "&:disabled": { background: "rgba(0, 0, 0, 0.12)" },
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <LoginIcon />
                )
              }
              data-testid="login-button"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Login Instructions:</strong>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="ul"
              sx={{ pl: 2, m: 0 }}
              id="login-instructions"
              data-testid="login-instructions"
              aria-live="assertive"
            >
              <li>Admin access: admin@gmail.com / password</li>
              <li>User access: any valid email / password (6+ chars)</li>
            </Typography>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
};
