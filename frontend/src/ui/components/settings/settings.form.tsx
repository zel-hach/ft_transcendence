import { DataContext } from "@/pages/context";
import { UserSettings } from "@/types/forms";
import { Button } from "@/ui/design-system/Button/button";
import { Input } from "@/ui/design-system/forms/input";
import { Typography } from "@/ui/design-system/typography/typography";
import axios from "axios";
import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosSave } from "react-icons/io";
import Popup from "reactjs-popup";
import TwoFactorAuth from "../two-factor-auth/two-factor-auth";
import { UploadAvatar } from "../upload-avatar/upload-avatar";
import toast from "react-hot-toast";

export const SettingsForm = () => {
  const { user, token, setUser } = useContext(DataContext);
  const [isTwoFactorAuthActive, setIsTwoFactorAuthActive] = useState(user?.tfa);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<UserSettings>({
    defaultValues: {
      username: user?.username || "",
      avatar: user?.avatar || "",
      tfa: user?.tfa ? true : false,
    },
  });

  useEffect(() => {
    if (user) {
      setIsTwoFactorAuthActive(user?.tfa);
      setValue("tfa", user.tfa);
      setValue("avatar", user.avatar);
      setValue("username", user.username);
    }
  }, [user]);

  const handleUpdateUserDocument = async (formData: UserSettings) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/user/update`,
        {
          username: formData.username,
          avatar: formData.avatar,
          tfa: formData.tfa,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      setIsLoading(false);
    } catch (err) {
      if (err === 406)
      {
        toast.error("this username is already exists!");
      }
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<UserSettings> = async (formData) => {
    handleUpdateUserDocument(formData);
  };
  const handleToggleChange = () => {

    if (user?.tfa) {
      setValue("tfa", false);
      setIsTwoFactorAuthActive(false);
    } else setOpened(true);
  };

  return (
    <>
      {opened && (
        <Popup
          open={opened}
          closeOnDocumentClick
          onClose={() => {
            setOpened(false);
            close();
          }}
        >
          <TwoFactorAuth
            setIsTwoFactorAuthActive={(value: boolean) => {
              setIsTwoFactorAuthActive(value);
              setValue("tfa", value);
            }}
            setOpened={setOpened}
          />
        </Popup>
      )}
      <div
        className={clsx(
          "bg-black px-4 md:px-8 lg:px-12 py-20 space-y-12 border border-primary max-w-2xl mx-auto rounded", {'blur-background': opened}
        )}
      >
        <UploadAvatar onPress={(avatar) => setValue("avatar", avatar)} />
        <Input
          isLoading={isLoading}
          placeholder="Username..."
          type="text"
          register={register}
          errors={errors}
          errorMsg="This field is required!"
          id="username"
          isAutocompleted={false}
        />
        <div className="flex items-center justify-between">
          <Typography variant="caption3" className="mr-4 text-primary">
            Enable 2 Factor Authentication
          </Typography>
          <div
            className={clsx("relative w-12 h-6 rounded-full", {
              "bg-primary": isTwoFactorAuthActive,
              "bg-gray-300": !isTwoFactorAuthActive,
            })}
          >
            <label
              htmlFor="tfa"
              className={clsx(
                "absolute left-0 w-6 h-6 bg-white rounded-full cursor-pointer transition-transform transform",
                {
                  "translate-x-full": isTwoFactorAuthActive,
                }
              )}
            ></label>
            <input
              type="checkbox"
              id="tfa"
              className="w-0 h-0 opacity-0"
              checked={isTwoFactorAuthActive}
              onChange={handleToggleChange}
            />
          </div>
        </div>

        <Button
          variant="secondary"
          iconPosition="left"
          icon={{ Icon: IoIosSave }}
          iconTheme="black"
          isLoading={isLoading}
          action={handleSubmit(onSubmit)}
          type="button"
          size="small"
        >
          <Typography variant="caption3">Save Changes</Typography>
        </Button>
      </div>
    </>
  );
};