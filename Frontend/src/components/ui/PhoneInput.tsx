import { MuiTelInput } from "mui-tel-input";

interface PhoneInputProps {
  name: string;
  requireValue?: boolean;
  label: string;
  error?: boolean;
  helperText?: string;
}

const PhoneInput = ({
  requireValue = false,
  name,
  label,
  error,
  helperText,
  ...props
}: PhoneInputProps) => {
  return (
    <MuiTelInput
      required={requireValue}
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      fullWidth={true}
      size="small"
      sx={{ mb: 4, py: 1 }}
      variant="standard"
      {...props}
    />
  );
};

export default PhoneInput;
