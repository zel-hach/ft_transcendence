import { Avatar } from "@/ui/design-system/Avatar/avatar";
import { Typography } from "@/ui/design-system/typography/typography";

interface HistoryProps
{
    avatar1: string,
    username1: string,
    score1: number,
    avatar2: string,
    username2: string,
    score2: number,
}

export const History: React.FC<HistoryProps> = ({
   avatar1,
   username1,
   score1,
   avatar2,
   username2,
   score2,
  }) => {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center space-y-4 p-4 bg-black rounded-lg shadow-md rounded border border-primary">
          <div className="relative">
            <Avatar size="small" src={avatar1} alt={username1} />

          </div>
          <div className="text-center">

            <div className="flex items-center">
              <Typography variant="caption1" color="secondary">
                {username1}
              </Typography>
            </div>
          </div>
          <Typography variant="body-lg" color="primary">{score1}</Typography>
        </div>
        <div className="text-center">
          <Typography variant="body-lg" color="primary"> VS</Typography>
        </div>
        <div className="flex flex-col items-center space-y-4 p-4 bg-black rounded-lg shadow-md rounded border border-primary">
          <Typography variant="body-lg" color="primary">{score2}</Typography>
          <div className="text-center">
            <div className="flex items-center">
              <Typography variant="caption1" color="secondary">
                {username2}
              </Typography>
            </div>
          </div>
          <div className="relative">
            {/* <img src={avatar2} alt={username2} className="w-24 h-24 rounded-full"/> */}
            <Avatar size="small" src={avatar2} alt={username2} />
          </div>
        </div>
      </div>
    );
  };