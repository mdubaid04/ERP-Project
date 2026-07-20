import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Input from "../../components/ui/Input";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { forgetPassword } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type {
  ApiErrorResponse,
  ForgetPasswordPayload,
} from "../../features/auth/authTypes";
import PhoneInput from "../../components/ui/PhoneInput";

function ForgetPassword() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgetPasswordPayload>({
    defaultValues: { email: "", phoneNo: "" },
  });

  const onSubmit: SubmitHandler<ForgetPasswordPayload> = async (data) => {
    const payload = {
      ...data,
      phoneNo: data.phoneNo?.trim() === "" ? undefined : data.phoneNo,
    };
    try {
      await dispatch(forgetPassword(payload)).unwrap();
      toast.success("Reset Password OTP sent successfully");
      navigate("/reset-password");
    } catch (err) {
      const error = err as ApiErrorResponse;
      toast.error(error?.message || "User Not Found");
      console.log("Verification:", error);
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
        Let's Get You Back In
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
        Enter your email address to reset your password
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
          "Verify Yourself"
        )}
      </Button>
    </form>
  );
}

export default ForgetPassword;
