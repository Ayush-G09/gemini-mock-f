import { useCallback, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { modeType, NotificationType, RootState } from "../../types/redux";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../../store/actions";

type FormValues = z.infer<typeof formSchema>;

type State = {
  countryCodes: CountryCodeType[];
  searchValue: string;
  otpSent: boolean;
  otp: string;
  otpError: string;
};

function Home() {
  const [state, setState] = useState<State>({
    countryCodes: [],
    searchValue: "",
    otpSent: false,
    otp: "",
    otpError: "",
  });

  const mode = useSelector((state: RootState) => state.mode);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const getCountryCodes = useCallback(async () => {
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
      setState((prev) => ({ ...prev, countryCodes: phoneCodes }));
    } catch {
      const notification = {
        type: "error",
        title: "Error: Country codes",
        msg: "Error fetching country codes, try again",
        time: new Date(),
      } as NotificationType;
      dispatch(addNotification(notification));
    }
  }, [dispatch]);

  useEffect(() => {
    getCountryCodes();
  }, [getCountryCodes]);

  const handleOtpSubmit = () => {
    if (state.otp === "111111") {
      setState((prev) => ({ ...prev, otpError: "" }));
      const userData = {
        mobileNumber: getValues("mobileNumber"),
        country: getValues("country"),
      };
      const notification = {
        type: "success",
        title: "OTP Verified",
        msg: "OTP verified successfully, Welcome.",
        time: new Date(),
      } as NotificationType;
      dispatch(addNotification(notification));
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/app");
    } else {
      setState((prev) => ({
        ...prev,
        otpError: "Invalid OTP. Please try again.",
      }));
    }
  };

  const onSubmit = (data: FormValues) => {
    setState((prev) => ({ ...prev, otpSent: true }));
    const notification = {
      type: "success",
      title: "OTP Sent",
      msg: "OTP sent to your mobile number.",
      time: new Date(),
    } as NotificationType;
    dispatch(addNotification(notification));
  };

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (state.otpSent) {
          handleOtpSubmit();
        } else {
          handleSubmit(onSubmit)();
        }
      }
    };
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [state.otpSent, handleSubmit, onSubmit, handleOtpSubmit]);

  return (
    <HomeContainer>
      <FormCardWrapper
        onSubmit={state.otpSent ? handleOtpSubmit : handleSubmit(onSubmit)}
      >
        <FormCard mode={mode}>
          {!state.otpSent && (
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
                      value: state.searchValue,
                      selected: field.value,
                      error: errors.country?.callingCode?.message || "",
                    }}
                    onChange={(val) =>
                      setState((prev) => ({ ...prev, searchValue: val }))
                    }
                    onSelect={(selected) => {
                      setValue("country", selected);
                      setState((prev) => ({ ...prev, searchValue: "" }));
                    }}
                    options={state.countryCodes}
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

          {state.otpSent && (
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
                value={state.otp}
                active={state.otpSent}
                error={state.otpError}
                onChange={(value: string) => {
                  setState((prev) => ({ ...prev, otp: value }));
                  setState((prev) => ({ ...prev, otpError: "" }));
                }}
              />
            </>
          )}

          <Button
            type="submit"
            sx={{
              width: "100%",
              maxWidth: "300px",
              fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
            }}
          >
            {state.otpSent ? "Verify OTP" : "Get OTP"}
          </Button>
        </FormCard>
      </FormCardWrapper>
    </HomeContainer>
  );
}

const FormCardWrapper = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const HomeContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
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

  width: 30%;
  height: auto;
  padding: 2rem;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 15px;

  @media (max-width: 1024px) {
    width: 60%;
  }

  @media (max-width: 768px) {
    width: 80%;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 1rem;
  }
`;

const SectionTitle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default Home;
