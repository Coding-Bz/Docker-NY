import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import { useEffect, useState, useContext } from "react";
import { User } from "../../../types/models/User.model";
import UserService from "../../../Services/UserService";
import { useNavigate } from "react-router-dom";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";

const UserTable = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const activeUserContext = useContext(ActiveUserContext);

  useEffect(() => {
    if (activeUserContext.checkRole("ADMIN")) {
      console.log("Loading ALL users");
      UserService.getAllUsers()
        .then((res) => setUsers(res.data))
        .catch(() => setUsers([]));
    } else {
      console.log("Loading CURRENT user");
      UserService.getCurrentUser()
        .then((res) => setUsers([res.data]))
        .catch(() => setUsers([]));
    }
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/user/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    await UserService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleDeleteMe = async () => {
    const confirmed = window.confirm(
      "Do you really want to delete your profile?",
    );

    if (!confirmed) return;

    try {
      await UserService.deleteOwnProfile();
      localStorage.clear();
      navigate("/login");
    } catch {
      alert("Couldn't delete profile.");
    }
  };

  const handleProfileClick = () => {
    if (activeUserContext.user?.id) {
      navigate(`/user/edit/${activeUserContext.user.id}`);
    }
  };

  return (
    <Box>
      {/* Website-style header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2,
          px: 2,
          mb: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h1" fontWeight="bold">
            User Management
          </Typography>
          <IconButton
            color="primary"
            onClick={handleProfileClick}
            aria-label="Go to my profile"
            size="large"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <PersonIcon />
          </IconButton>
        </Box>
      </Box>

      {users.map((user) => (
        <Card key={user.id} sx={{ minWidth: 275, mb: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={
                  user.profile?.profileImageUrl?.startsWith("http")
                    ? user.profile.profileImageUrl
                    : undefined
                }
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 64, height: 64 }}
              />

              <Stack>
                <Typography variant="h6">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2">{user.email}</Typography>
                <Typography variant="body2">{user.profile?.address}</Typography>
                <Typography variant="body2">
                  {user.profile?.birthDate}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>

          <CardActions>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={() => handleEdit(user.id)}
            >
              Edit
            </Button>

            {activeUserContext.checkRole("ADMIN") && (
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </Button>
            )}

            {!activeUserContext.checkRole("ADMIN") && (
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={handleDeleteMe}
              >
                Delete
              </Button>
            )}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default UserTable;
