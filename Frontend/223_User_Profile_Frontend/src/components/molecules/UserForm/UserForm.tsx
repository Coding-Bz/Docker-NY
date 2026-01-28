import { useFormik } from "formik";
import { User } from "../../../types/models/User.model";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { object, string } from "yup";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import CakeIcon from "@mui/icons-material/Cake";
import ImageIcon from "@mui/icons-material/Image";

interface UserProps {
  user: User;
  submitActionHandler: (values: User) => void;
}

const UserForm = ({ user, submitActionHandler }: UserProps) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      id: user.id,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      roles: user?.roles ?? [],
      password: "",
      profile: {
        address: user.profile?.address ?? "",
        birthDate: user.profile?.birthDate ?? "",
        profileImageUrl: user.profile?.profileImageUrl ?? "",
      },
    },
    validationSchema: object({
      firstName: string().required().min(2).max(50),
      lastName: string().required().min(2).max(50),
      email: string().required().email(),
      profile: object({
        address: string().required().min(2).max(100),
        birthDate: string()
          .required("Birth date is required")
          .test("is-13", "You must be at least 13 years old", (value) => {
            if (!value) return true;

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
        profileImageUrl: string()
          .notRequired()
          .matches(/^https?:\/\/.*$/, {
            message: "Invalid URL",
            excludeEmptyString: true,
          }),
      }),
      password: string().when("id", {
        is: (id: string) => !id,
        then: (schema) => schema.required().min(4),
      }),
    }),
    onSubmit: async (values, { setErrors }) => {
      try {
        await submitActionHandler(values);
      } catch (backendErrors: any) {
        setErrors(backendErrors);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        {/* Profile Header */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={formik.values.profile.profileImageUrl || undefined}
              sx={{
                width: 80,
                height: 80,
                border: "4px solid white",
                boxShadow: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {formik.values.firstName || "First Name"}{" "}
                {formik.values.lastName || "Last Name"}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {formik.values.email || "email@example.com"}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Personal Information Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <PersonIcon color="primary" />
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.firstName && formik.errors.firstName,
                  )}
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  value={formik.values.firstName}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.lastName && formik.errors.lastName,
                  )}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  value={formik.values.lastName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  value={formik.values.email}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <HomeIcon color="primary" />
              Profile Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="profile.address"
                  label="Address"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.profile.address}
                  error={Boolean(
                    formik.touched.profile?.address &&
                    formik.errors.profile?.address,
                  )}
                  helperText={
                    formik.touched.profile?.address &&
                    formik.errors.profile?.address
                  }
                  InputProps={{
                    startAdornment: (
                      <HomeIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="birthDate"
                  name="profile.birthDate"
                  label="Birth Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.profile.birthDate}
                  error={Boolean(
                    formik.touched.profile?.birthDate &&
                    formik.errors.profile?.birthDate,
                  )}
                  helperText={
                    formik.touched.profile?.birthDate &&
                    formik.errors.profile?.birthDate
                  }
                  InputProps={{
                    startAdornment: (
                      <CakeIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="profileImageUrl"
                  name="profile.profileImageUrl"
                  label="Profile Image URL"
                  variant="outlined"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.profile.profileImageUrl}
                  error={Boolean(
                    formik.touched.profile?.profileImageUrl &&
                    formik.errors.profile?.profileImageUrl,
                  )}
                  helperText={
                    formik.touched.profile?.profileImageUrl &&
                    formik.errors.profile?.profileImageUrl
                  }
                  InputProps={{
                    startAdornment: (
                      <ImageIcon sx={{ mr: 1, color: "action.active" }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Password Section (only for new users) */}
        {!user.id && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Account Security
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={Boolean(
                  formik.touched.password && formik.errors.password,
                )}
                helperText={formik.touched.password && formik.errors.password}
                value={formik.values.password}
              />
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Box
          display="flex"
          justifyContent="center"
          gap={2}
          sx={{ mt: 4, mb: 4 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            disabled={!(formik.dirty && formik.isValid)}
            sx={{ minWidth: 120, py: 1.5 }}
          >
            {user.id ? "Save Changes" : "Create Account"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="large"
            onClick={() => navigate("/user")}
            sx={{ minWidth: 120, py: 1.5 }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UserForm;
