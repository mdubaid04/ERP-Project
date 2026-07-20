import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";

interface PasswordProps {
  name: string;
  label: string;
  requireValue?: boolean;
  type?: string;
  error?: boolean;
  helperText?: string;
}

function PasswordInput({
  requireValue = true,
  name,
  label,
  type = "text",
  error,
  helperText,
  ...props
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl
      fullWidth
      size="small"
      variant="standard"
      required={requireValue}
      sx={{ mb: 2, py: 1 }}
    >
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        id={name}
        autoComplete="new-password"
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                // aria lable=browser assessibility for screen readers as blind cant see hide/show button
                showPassword ? "hide the password" : "display the password"
              }
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
              tabIndex={-1}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        error={error}
        {...props}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export default PasswordInput;
