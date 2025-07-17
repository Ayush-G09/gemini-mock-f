import { useEffect, useState } from "react";
import InputField from "../../components/InputField";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import axiosInstance from "../../config/axiosInstance";
import CountryCode from "../../components/CountryCode";
import { CountryCodeType } from "../../types";
import Button from "../../components/Button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../../schema/formSchema";
import { z } from "zod";
import OtpInput from "../../components/OtpInput";
import Label from "../../components/Label";
import { useSelector } from "react-redux";
import { modeType, RootState } from "../../types/redux";
import { useNavigate } from "react-router-dom";

type FormValues = z.infer<typeof formSchema>;

function Home() {
  const [countryCodes, setCountryCodes] = useState<CountryCodeType[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const mode = useSelector((state: RootState) => state.mode);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: "",
      country: {
        name: "",
        callingCode: "",
        flag: "",
      },
    },
  });

  const getCountryCodes = async () => {
    try {
      const res = await axiosInstance.get(
        "https://restcountries.com/v3.1/all?fields=name,idd,flags"
      );
      const phoneCodes = res.data
        .map((country: any) => {
          const root = country.idd?.root || "";
          const suffixes = country.idd?.suffixes || [""];
          return suffixes.map((suffix: string) => ({
            name: country.name.common,
            callingCode: `${root}${suffix}`,
            flag: country.flags.png,
          }));
        })
        .flat();
      setCountryCodes(phoneCodes);
    } catch {
      console.log("error fetching country codes");
    }
  };

  useEffect(() => {
    getCountryCodes();
  }, []);

  const handleOtpSubmit = () => {
    if (otp === "111111") {
      console.log("OTP Verified:", otp);
      setOtpError("");
      const userData = {
        mobileNumber: getValues("mobileNumber"),
        country: getValues("country"),
      };

      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/app");
    } else {
      setOtpError("Invalid OTP. Please try again.");
    }
  };

  const onSubmit = (data: FormValues) => {
    console.log("Form Data (Phone Info):", data);
    setOtpSent(true);
    // Simulate sending OTP...
    setTimeout(() => {
      console.log(
        "OTP sent to",
        `${data.country.callingCode} ${data.mobileNumber}`
      );
    }, 500);
  };

  return (
    <HomeContainer>
      <FormCard
        mode={mode}
        as="form"
        onSubmit={
          otpSent
            ? (e) => {
                e.preventDefault();
                handleOtpSubmit();
              }
            : handleSubmit(onSubmit)
        }
      >
        {!otpSent && (
          <>
            <SectionTitle>
              <Label size="1.2rem" weight={600}>
                Welcome Back
              </Label>
              <Label size="0.8rem" color="#a9a9a9">
                Verify your number to get started.
              </Label>
            </SectionTitle>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <CountryCode
                  value={{
                    value: searchValue,
                    selected: field.value,
                    error: errors.country?.callingCode?.message || "",
                  }}
                  onChange={(val) => setSearchValue(val)}
                  onSelect={(selected) => {
                    setValue("country", selected);
                    setSearchValue("");
                  }}
                  options={countryCodes}
                />
              )}
            />

            <Controller
              control={control}
              name="mobileNumber"
              render={({ field }) => (
                <InputField
                  value={field.value}
                  error={errors.mobileNumber?.message || ""}
                  field="mobileNumber"
                  type="number"
                  name="Mobile Number"
                  logo={faPhone}
                  onChange={field.onChange}
                />
              )}
            />
          </>
        )}

        {otpSent && (
          <>
            <SectionTitle>
              <Label size="1.2rem" weight={600}>
                Verify OTP
              </Label>
              <Label size="0.8rem" color="#a9a9a9">
                Please check your phone and enter the OTP.
              </Label>
            </SectionTitle>
            <OtpInput
              value={otp}
              active={otpSent}
              error={otpError}
              onChange={(value: string) => {
                setOtp(value);
                setOtpError("");
              }}
            />
          </>
        )}

        <Button type="submit" sx={{ width: "80%", fontSize: "1rem" }}>
          {otpSent ? "Verify OTP" : "Get OTP"}
        </Button>
      </FormCard>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormCard = styled.div<{ mode: modeType }>`
  background: ${(p) =>
    p.mode === "light"
      ? `linear-gradient(
    160deg,
    rgba(56, 139, 255, 0.3) 0%,
    rgba(255, 255, 255, 1) 30%
  )`
      : `linear-gradient(
    160deg,
    rgba(56, 139, 255, 0.3) 0%,
    rgba(0, 0, 0, 1) 30%
  )`};
  width: 40%;
  height: 70%;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const SectionTitle = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

export default Home;
