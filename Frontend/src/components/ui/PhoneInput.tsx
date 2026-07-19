
import { MuiTelInput } from 'mui-tel-input'

interface PhoneInputProps {
  name: string
  label: string
  error?: boolean
  helperText?: string
}

const PhoneInput = ({name,label,error,helperText,...props}:PhoneInputProps) => {
  
  return <MuiTelInput  
  name={name}
  label={label}
  error={error}
  helperText={helperText}
  fullWidth={true}
  size="small"
  defaultCountry='IN'
  sx={{mb:2}}
  variant='standard'
  {...props}/>
}

export default PhoneInput