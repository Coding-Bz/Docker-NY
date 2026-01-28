import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import ActiveUserContext from "../../../Contexts/ActiveUserContext";
import UserService from "../../../Services/UserService";
import RoleService from "../../../Services/RoleService";
import { User } from "../../../types/models/User.model";
import { Role } from "../../../types/models/Role.model";
import { TextField } from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

const AdminPage = () => {
  const { checkRole } = useContext(ActiveUserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userEditDialogOpen, setUserEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [editUserData, setEditUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    birthDate: "",
    profileImageUrl: "",
  });
  const [editUserRoles, setEditUserRoles] = useState<string[]>([]);

  // Pagination
  const [hasNextPage, setHasNextPage] = useState(true);

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    minAge: undefined as number | undefined,
    maxAge: undefined as number | undefined,
    page: 0,
    size: 10,
  });

  const userEditValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    address: Yup.string().required("Address is mandatory"),
    birthDate: Yup.string().test("is-13", "You must be at least 13 years old", (value) => {
      if (!value) return false;

      const birth = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age >= 13;
    }),
    profileImageUrl: Yup.string().url("Invalid URL"),
  });

  const updateFilter = (changes: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...changes,
      page: 0,
    }));
  };

  if (!checkRole("ADMIN")) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          p: 3,
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          403 - Forbidden
        </Typography>
        <Typography variant="body1">
          You do not have access to this page.
        </Typography>
      </Box>
    );
  }

  useEffect(() => {
    loadUsers();
  }, [filters]);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const rolesResponse = await RoleService.findAll();
      setRoles(rolesResponse.data);
    } catch (err: any) {
      console.error("Failed to load roles", err);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const usersResponse = await UserService.getFilteredUsers({
        firstName: filters.firstName || undefined,
        lastName: filters.lastName || undefined,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        page: filters.page,
        size: filters.size,
      });

      setUsers(usersResponse.data.content);
      setHasNextPage(!usersResponse.data.last);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles.map((role) => role.id));
    setRoleDialogOpen(true);
  };

  const handleCloseRoleDialog = () => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const handleEditUserRoleToggle = (roleId: string) => {
    setEditUserRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedRoles = roles.filter((role) =>
        selectedRoles.includes(role.id),
      );
      const updatedUser: User = {
        ...selectedUser,
        roles: updatedRoles,
      };

      await UserService.updateUser(updatedUser);
      setSuccess("Roles updated successfully");
      await loadUsers();
      handleCloseRoleDialog();
    } catch (err: any) {
      setError(err.message || "Failed to update roles");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUserEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUserData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.profile?.address || "",
      birthDate: user.profile?.birthDate || "",
      profileImageUrl: user.profile?.profileImageUrl || "",
    });
    setEditUserRoles(user.roles.map((role) => role.id));
    setUserEditDialogOpen(true);
  };

  const handleCloseUserEditDialog = () => {
    setUserEditDialogOpen(false);
    setSelectedUser(null);
    setEditUserRoles([]);
    setEditUserData({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      birthDate: "",
      profileImageUrl: "",
    });
  };

  const handleSaveUserEdit = async (
    values: typeof editUserData,
    formikHelpers: FormikHelpers<typeof editUserData>,
  ) => {
    if (!selectedUser) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedRoles = roles.filter((role) =>
        editUserRoles.includes(role.id),
      );
      const updatedUser: User = {
        ...selectedUser,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roles: updatedRoles,
        profile: {
          ...selectedUser.profile,
          address: values.address,
          birthDate: values.birthDate,
          profileImageUrl: values.profileImageUrl,
        },
      };

      await UserService.updateUser(updatedUser);
      setSuccess("User updated successfully");
      await loadUsers();
      handleCloseUserEditDialog();
    } catch (err: any) {
      if (err.response?.status === 409 && err.response.data?.errors?.email) {
        formikHelpers.setFieldError("email", err.response.data.errors.email);
      } else {
        setError("Failed to update user");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await UserService.deleteUser(userId);
      setSuccess("User deleted successfully");
      await loadUsers();

      if (users.length === 1 && filters.page > 0) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Management
          </Typography>
          <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="First name"
              value={filters.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter({ firstName: e.target.value })
              }
              inputProps={{ "data-cy": "filter-first-name" }}
            />

            <TextField
              label="Last name"
              value={filters.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter({ lastName: e.target.value })
              }
              inputProps={{ "data-cy": "filter-last-name" }}
            />

            <TextField
              label="Min age"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter({
                  minAge: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              inputProps={{ "data-cy": "filter-min-age" }}
            />

            <TextField
              label="Max age"
              type="number"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter({
                  maxAge: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              inputProps={{ "data-cy": "filter-max-age" }}
            />
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.profile?.profileImageUrl?.startsWith("http") && (
                          <Avatar
                            src={user.profile.profileImageUrl}
                            sx={{ width: 40, height: 40 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {user.roles.map((role) => (
                            <Chip
                              key={role.id}
                              label={role.name}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                          {user.roles.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              No roles
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <IconButton
                          data-cy={`edit-user-${user.email}`}
                            color="primary"
                            onClick={() => handleOpenUserEditDialog(user)}
                            title="Edit User"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Delete User"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {/* Role Assignment Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={handleCloseRoleDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Assign Roles to {selectedUser?.firstName} {selectedUser?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            {roles && roles.length > 0 ? (
              roles.map((role, index) => (
                <FormControlLabel
                  key={`assign-role-${role.id || index}`}
                  control={
                    <Checkbox
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{role.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {role.authorities?.map((a) => a.name).join(", ") ||
                          "No authorities"}
                      </Typography>
                    </Box>
                  }
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Loading roles...
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseRoleDialog} color="inherit">
            Cancel
          </Button>

          <Button
            onClick={handleSaveRoles}
            variant="contained"
            disabled={loading}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Edit Dialog */}
      <Dialog
        open={userEditDialogOpen}
        onClose={handleCloseUserEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit User: {selectedUser?.firstName} {selectedUser?.lastName}
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={editUserData}
            validationSchema={userEditValidationSchema}
            onSubmit={handleSaveUserEdit}
            enableReinitialize
          >
            {(props: any) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="h6">User Details</Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={props.values.firstName}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={
                        props.touched.firstName && !!props.errors.firstName
                      }
                      helperText={
                        props.touched.firstName && props.errors.firstName
                      }
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={props.values.lastName}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      error={props.touched.lastName && !!props.errors.lastName}
                      helperText={
                        props.touched.lastName && props.errors.lastName
                      }
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={props.values.email}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched.email && !!props.errors.email}
                    helperText={props.touched.email && props.errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Profile Image URL"
                    name="profileImageUrl"
                    value={props.values.profileImageUrl}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={
                      props.touched.profileImageUrl &&
                      !!props.errors.profileImageUrl
                    }
                    helperText={
                      props.touched.profileImageUrl &&
                      props.errors.profileImageUrl
                    }
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={props.values.address}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched.address && !!props.errors.address}
                    helperText={props.touched.address && props.errors.address}
                  />
                  <TextField
                    fullWidth
                    label="Birth Date"
                    name="birthDate"
                    type="date"
                    value={props.values.birthDate}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched.birthDate && !!props.errors.birthDate}
                    helperText={
                      props.touched.birthDate && props.errors.birthDate
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Roles
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                    {roles && roles.length > 0 ? (
                      roles.map((role, index) => (
                        <FormControlLabel
                          key={`edit-user-role-${role.id || index}`}
                          control={
                            <Checkbox
                              checked={editUserRoles.includes(role.id)}
                              onChange={() => handleEditUserRoleToggle(role.id)}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body1">
                                {role.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {role.authorities
                                  ?.map((a) => a.name)
                                  .join(", ") || "No authorities"}
                              </Typography>
                            </Box>
                          }
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Loading roles...
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseUserEditDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              const form = document.querySelector("form");
              if (form) form.requestSubmit();
            }}
            variant="contained"
            disabled={loading}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          disabled={filters.page === 0}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              page: prev.page - 1,
            }))
          }
        >
          Previous
        </Button>

        <Chip
          label={`Page ${filters.page + 1}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />

        <Button
          variant="contained"
          disabled={!hasNextPage}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              page: prev.page + 1,
            }))
          }
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPage;