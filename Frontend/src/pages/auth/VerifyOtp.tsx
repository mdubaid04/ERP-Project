import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import OtpInput from "../../components/auth/OtpInput";
import { verifyOtp } from "../../features/auth/authSlice";
import type { verifyOTPPayload } from "../../features/auth/authTypes";
import type { ApiErrorResponse } from "../../features/auth/authTypes";
import toast from "react-hot-toast";

function VerifyOtp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<verifyOTPPayload>({
    defaultValues: { otp: "" },
  });

  const onSubmit: SubmitHandler<verifyOTPPayload> = async (
    data: verifyOTPPayload,
  ) => {
    try {
      await dispatch(verifyOtp(data)).unwrap();
      toast.success("Log In Successfully");
      switch (user?.role) {
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "EMPLOYEE":
          navigate("/employee/dashboard", { replace: true });
          break;
        case "MANAGER":
          navigate("/manager/dashboard", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
      navigate("/admin/dashboard");
    } catch (err) {
      const error = err as ApiErrorResponse;
      toast.error(error?.message || "Invalid OTP");
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
          mt: 2,
          mb: 2,
        }}
      >
        Check Your Inbox
      </Typography>
      <Typography
        variant="body2"
        component="p"
        gutterBottom
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
        sx={{ borderRadius: 3 }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Verify"
        )}
      </Button>
    </form>
  );
}

export default VerifyOtp;
