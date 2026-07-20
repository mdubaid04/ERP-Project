import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Input from "../../components/ui/Input";

import PhoneInput from "../../components/ui/PhoneInput";
import PasswordInput from "../../components/ui/PasswordInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logIn } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { ApiErrorResponse } from "../../features/auth/authTypes";

interface FormInput {
  email: string;
  phoneNo?: undefined | string;
  password: string;
}
function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormInput>({
    defaultValues: { email: "", password: "", phoneNo: "" },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    const payload = {
      ...data,
      phoneNo: data.phoneNo?.trim() === "" ? undefined : data.phoneNo,
    };
    try {
      await dispatch(logIn(payload)).unwrap();
      toast.success("OTP sent successfully");
      navigate("/verify-otp");
    } catch (err) {
      const error = err as ApiErrorResponse;
      toast.error(error?.message || "Login Failed");
      console.log("Login Failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant="h6"
        color="primary"
        component="p"
        gutterBottom
        sx={{
          fontSize: 18,
          fontWeight: 450,
          letterSpacing: "0.5px",
          textAlign: "center",
          mt: 1,
        }}
      >
        Welcome Back
      </Typography>
      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value:
              /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
            message: "Invalid email address",
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <Input
            {...field}
            label="Email"
            type="email"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Controller
        name="phoneNo"
        control={control}
        rules={{
          pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" },
        }}
        render={({ field, fieldState: { error } }) => (
          <PhoneInput
            {...field}
            label="Phone No (optional)"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: "Password is required" }}
        render={({ field, fieldState: { error } }) => (
          <PasswordInput
            {...field}
            label="Password"
            type="password"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Link
          to="/forgot-password"
          style={{ textDecoration: "none", fontSize: "14px", fontWeight: 500 }}
        >
          <Typography
            variant="body2"
            color="primary"
            sx={{ letterSpacing: "0.5px" }}
          >
            Forgot Password?
          </Typography>
        </Link>
      </Box>
      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={isSubmitting}
        sx={{ borderRadius: 3 }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

export default Login;
