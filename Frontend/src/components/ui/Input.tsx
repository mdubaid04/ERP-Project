import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

interface InputProps extends Omit<TextFieldProps,'error'> {
  name: string;
  label: string;
  type?: string;
  error?: boolean;
  helperText?: string;
}
function Input({name,label,type="text",error,helperText,...props}:InputProps) {
  
  return (
    <TextField 
    name={name}
    label={label}
    type={type}
    error={error}
    helperText={helperText}
    variant="standard"
    fullWidth={true}
    size="small"
    sx={{mb:2}}
    slotProps={{htmlInput:{maxLength:50}} }
    {...props} />
  )
}

export default Input
