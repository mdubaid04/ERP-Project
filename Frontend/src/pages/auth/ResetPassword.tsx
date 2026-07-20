import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/ui/PasswordInput";
import OtpInput from "../../components/auth/OtpInput";
import { resetPassword } from "../../features/auth/authSlice";
import type { ResetPasswordPayload } from "../../features/auth/authTypes";
import type { ApiErrorResponse } from "../../features/auth/authTypes";
import toast from "react-hot-toast";

function ResetPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordPayload>({
    defaultValues: { password: "", otp: "" },
  });
  const onSubmit: SubmitHandler<ResetPasswordPayload> = async (
    data: ResetPasswordPayload,
  ) => {
    try {
      await dispatch(resetPassword(data)).unwrap();
      toast.success("Password reset successfully! Please Log In");
      navigate("/");
    } catch (err) {
      const error = err as ApiErrorResponse;
      toast.error(error?.message || "Invalid OTP");
      console.log("Password Reset Failed:", error);
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
          mt: 2,
          mb: 2,
        }}
      >
        Create New Password
      </Typography>
      <Typography
        variant="body2"
        component="p"
        sx={{
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: "0.5px",
          textAlign: "center",
          mb: 2,
        }}
      >
        Enter the OTP sent to your registered
        <br /> phone number or email
      </Typography>
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password is required",
        }}
        render={({ field, fieldState: { error } }) => (
          <PasswordInput
            {...field}
            label="New Password"
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Controller
        name="otp"
        control={control}
        rules={{
          required: "OTP is required",
        }}
        render={({ field, fieldState: { error } }) => (
          <OtpInput
            {...field}
            length={7}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={isSubmitting}
        sx={{ borderRadius: 3, mt: 2 }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  );
}

export default ResetPassword;
