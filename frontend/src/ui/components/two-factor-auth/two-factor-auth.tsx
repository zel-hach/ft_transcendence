import { DataContext } from "@/pages/context";
import { Typography } from "@/ui/design-system/typography/typography";
import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TwoFactorAuthProps {
  setIsTwoFactorAuthActive: (value: boolean) => void;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactorAuth = ({
  setIsTwoFactorAuthActive,
  setOpened,
}: TwoFactorAuthProps) => {
  const [otp, setOtp] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const router = useRouter();
  const { user, token } = useContext(DataContext);

  useEffect(() => {
    generateSecretAndCode();
  }, []);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const generateSecretAndCode = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/tfa/generate`,
        {
          otp,
        },
        {
          withCredentials: true,
          responseType: "blob",
        }
      );
      if (res.data) {
        const imageUrl = URL.createObjectURL(
          new Blob([res.data], { type: "image/png" })
        );
        setGeneratedCode(imageUrl);
      } else {
        toast.error("Error while generating the QR code");
      }
    } catch (error) {
      toast.error("error while generating the qr code");
    }
  };

  const validateOTP = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/tfa/activate`,
        {
          code: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setIsTwoFactorAuthActive(true);
      setOpened(false);
    } catch (error) {
      setOpened(false);
      setIsTwoFactorAuthActive(false);
      console.error("Error validating OTP:", error);
    }
  };
  return (
    <div className="flex items-center justify-center bg-black">
      <div className="bg-gray p-8 rounded shadow-md text-center items-center border border-primary">
        <h1 className="text-2xl font-semibold mb-4 text-primary">
          Two-Factor Authentication
        </h1>
        <p className="mb-4 text-white">
          Please scan the QR code with your authenticator app:
        </p>

        {generatedCode ? (
          <div>
            <img src={generatedCode} alt="qrcode" />
            <label className="block mt-4 text-white">
              Enter OTP from your app:
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-4 py-2 border rounded mt-2"
            />
            <button
              onClick={validateOTP}
              className="mt-4 bg-primary text-black px-4 py-2 rounded"
            >
              Validate OTP
            </button>
          </div>
        ) : (
          <Typography color="white">
            {" "}
            Error while generating the QR code{" "}
          </Typography>
        )}
      </div>
    </div>
  );
};
export default TwoFactorAuth;