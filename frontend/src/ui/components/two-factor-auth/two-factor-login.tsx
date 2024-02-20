import { useState, ChangeEvent, useContext, useEffect } from "react";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import { DataContext } from "@/pages/context";
import axios from "axios";
import toast from "react-hot-toast";
import { Typography } from "@/ui/design-system/typography/typography";

const TwoFactorLogin = () => {
  const [otp, setOtp] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const router = useRouter();
  const {user, token} = useContext(DataContext);

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  const validateOTP = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL}/tfa/authenticate`, {
        code: otp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type' : 'application/json',
        },
        withCredentials: true,
      }
     );
      if (res.data === true) {
        router.push('/settings');
      }
    } catch (error) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray p-8 rounded shadow-md text-center items-center border border-primary">
        <h1 className="text-2xl font-semibold mb-4 text-primary">
          Two-Factor Authentication
        </h1>
        {(
          <>
            <label className="block mt-4 text-white"> Enter OTP from your app: </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-4 py-2 border rounded mt-2"
            />
            <button
              onClick={validateOTP}
              className="mt-4 bg-primary text-black px-4 py-2 rounded border border-none"
            >
              Validate OTP
            </button>
          </>
            )
            }
              </div>
            </div>
          );
        };
        
    export default TwoFactorLogin;