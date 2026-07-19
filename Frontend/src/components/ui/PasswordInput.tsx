import { VisibilityOff, Visibility } from '@mui/icons-material';
import { FormHelperText, IconButton, InputAdornment } from '@mui/material';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';

interface PasswordProps  {
  name: string;
  label: string;
  type?: string;
  error?: boolean;
  helperText?: string;
}

function PasswordInput({name,label,type="text",error,helperText,...props}:PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormControl fullWidth size='small' variant="standard">
          <InputLabel htmlFor={name}>{label}</InputLabel>
          <Input
            id={name}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={                   // aria lable=browser assessibility for screen readers as blind cant see hide/show button
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={() => setShowPassword((prev)=>!prev)}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <Visibility />:<VisibilityOff /> }
                </IconButton>
              </InputAdornment>
            }
            error={error}
            {...props}
          />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
  )
}

export default PasswordInput