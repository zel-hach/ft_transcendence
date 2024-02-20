import { DataContext } from "@/pages/context";
import { Avatar } from "@/ui/design-system/Avatar/avatar";
import { useContext, useState } from "react";
import { FaCameraRetro } from "react-icons/fa";

export const UploadAvatar = ({
  onPress,
}: {
  onPress: (value: string) => void;
}) => {
  const { user } = useContext(DataContext);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPress(reader.result as string);
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="inline-block bg-secondary hover:bg-secondary/50 text-black rounded px-[18px] py-[15px] cursor-pointer">
        <div className="flex items-center gap-2">
          <FaCameraRetro />
          <span> Choisir un fichier </span>
        </div>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
      {selectedFile ? (
        <Avatar src={selectedFile} alt="Avatar" size="small" />
      ) : (
        user && <Avatar src={user.avatar} alt="default avatar" size="small" />
      )}
    </div>
  );
};
