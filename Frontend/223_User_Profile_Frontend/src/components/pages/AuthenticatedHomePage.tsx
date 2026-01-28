import { Box } from "@mui/system";
import { Button, Stack, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo } from "react";
import ActiveUserContext from "../../Contexts/ActiveUserContext";
import logo from "../../logo1.png";

const AuthenticatedHomePage = () => {
  const navigate = useNavigate();
  const { user, loadActiveUser, logout } = useContext(ActiveUserContext);

  useEffect(() => {
    if (!user) {
      loadActiveUser();
    }
  }, [user, loadActiveUser]);

  const displayName = useMemo(() => {
    if (!user) return "User";
    if (user.firstName || user.lastName) {
      return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    }
    return user.email ?? "User";
  }, [user]);

  const userRoles = useMemo(() => {
    if (!user || !user.roles) return [];
    return user.roles.map((role) => role.name).join(", ");
  }, [user]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100vh"
      sx={{
        background: "linear-gradient(135deg, #0f0fcf, #00d4ff)",
        color: "#fff",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontFamily: "Arial, sans-serif",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          mb: 2,
        }}
      >
        Welcome back, {displayName}!
      </Typography>

      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{
          maxWidth: "300px",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
          mb: 4,
        }}
      />

      <Paper
        elevation={8}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          User Information
        </Typography>
        {user && (
          <>
            <Typography sx={{ mb: 1 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            {(user.firstName || user.lastName) && (
              <Typography sx={{ mb: 1 }}>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </Typography>
            )}
            {userRoles && (
              <Typography sx={{ mb: 1 }}>
                <strong>Roles:</strong> {userRoles || "None"}
              </Typography>
            )}
          </>
        )}
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ width: "100%", maxWidth: "500px" }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#00d4ff",
            "&:hover": { backgroundColor: "#0f0fcf" },
            py: 1.5,
          }}
          onClick={() => navigate("/user")}
        >
          Manage Users
        </Button>
        <Button
          variant="outlined"
          fullWidth
          color="inherit"
          sx={{
            borderColor: "rgba(255,255,255,0.7)",
            color: "#fff",
            "&:hover": {
              borderColor: "#fff",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
            py: 1.5,
          }}
          onClick={logout}
        >
          Logout
        </Button>
      </Stack>
    </Box>
  );
};

export default AuthenticatedHomePage;
