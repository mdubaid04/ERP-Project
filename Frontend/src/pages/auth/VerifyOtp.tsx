import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import OtpInput from "../../components/auth/OtpInput";

interface VerifyOtp {
  otp: string;
}
function VerifyOtp() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<VerifyOtp>({
    defaultValues: { otp: "" },
  });
  const onSubmit: SubmitHandler<VerifyOtp> = (data: any) => console.log(data);

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
        Verify Your OTP
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
