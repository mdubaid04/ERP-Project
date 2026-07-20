import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";

interface InputProps extends Omit<TextFieldProps, "error"> {
  name: string;
  label: string;
  requireValue?: boolean;
  type?: string;
  error?: boolean;
  helperText?: string;
}
function Input({
  requireValue = true,
  name,
  label,
  type = "text",
  error,
  helperText,
  ...props
}: InputProps) {
  return (
    <TextField
      required={requireValue}
      name={name}
      label={label}
      type={type}
      error={error}
      helperText={helperText}
      variant="standard"
      fullWidth={true}
      autoComplete="off"
      size="small"
      sx={{ mb: 4, py: 1 }}
      slotProps={{ htmlInput: { maxLength: 50 } }}
      {...props}
    />
  );
}

export default Input;
