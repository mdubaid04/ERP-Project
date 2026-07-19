import Input from "./components/ui/Input";
import { Box } from "@mui/material";
import PasswordInput from "./components/ui/PasswordInput";
import OtpInput from "./components/auth/OtpInput";
import PhoneInput from "./components/ui/PhoneInput";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          width: "50%",
          border: "1px solid black",
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Input name="input" label="Phone NO" type="tel" />
        <PasswordInput name="password" label="Password" />
        <PhoneInput name="phone" label="Phone" />
        <OtpInput length={7} />
      </Box>
    </Box>
  );

  return <></>;
}

export default App;
