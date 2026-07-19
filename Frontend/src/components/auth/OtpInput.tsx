import {
  MuiOtpInput,
  type MuiOtpInputProps,
} from "mui-one-time-password-input";
import { Box, FormHelperText } from "@mui/material";
interface OtpInputProps extends Partial<MuiOtpInputProps> {
  length: number;
  error?: boolean;
  helperText?: string;
}

const OtpInput = ({ length, error, helperText, ...props }: OtpInputProps) => {
  return (
    <Box>
      <MuiOtpInput length={length} {...props} />
      {error && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </Box>
  );
};

export default OtpInput;
