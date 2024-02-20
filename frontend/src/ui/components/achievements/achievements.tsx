import { DataContext } from "@/pages/context";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { userType } from "../login-button/login-button";

const Achievements = () => {
  const { token } = useContext(DataContext);
  const router = useRouter();
  const { id } = router.query;
  const [userAch, setUserAch] = useState<userType | null>();

  useEffect(() => {
    const fetchAch = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/user/${id}`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.data) {
            setUserAch(response.data);
          }
        } catch (error) {
          console.error("Error fetching achievements:", error);
        }
      } else {
        router.push('/');
      }
    };

    fetchAch();
  }, [id]);

  const loss: number = userAch?.loss || 0;
  const wins: number = userAch?.wins || 0;

  const achievementsData = [
    {
      image: "/assets/images/welcome.png",
      title: "Welcome",
      description: "You played your first game!",
      status: wins >= 1 ? "Unlocked" : "Locked", 
    },
    {
      image: "/assets/images/winner.png",
      title: "Winner",
      description: "You won 5 games, such a fighter!",
      status: wins >= 5 ? "Unlocked" : "Locked", 
    },
    {
      image: "/assets/images/looser.png",
      title: "Loser",
      description: "You lost 5 games, only with failure can you reach success!",
      status: loss >= 5 ? "Unlocked" : "Locked",
    },
  ];

  return (
    <div className="container mx-auto text-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {achievementsData.map((achievement, index) => (
          <div
            key={index}
            className="bg-gray p-6 rounded shadow-md transition-transform transform hover:scale-105"
          >
            <Image
              src={achievement.image}
              alt={achievement.title}
              className="mx-auto mb-4"
              width={80}
              height={80}
            />
            <h3 className="text-xl font-semibold mb-2 text-primary">
              {achievement.title}
            </h3>
            <p className="text-gray-600 mb-4">{achievement.description}</p>
            <button
              className={`bg-secondary px-4 py-2 rounded text-gray ${
                achievement.status === "Locked" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={achievement.status === "Locked"}
            >
              {achievement.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;