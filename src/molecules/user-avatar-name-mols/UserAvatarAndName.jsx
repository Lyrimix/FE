import React from "react";
import "./UserAvatarAndName.css";
import { useUser } from "../../utils/context/UserContext";

export const UserAvatarAndName = ({ avatarUrl, displayName }) => {
  // Giá trị mặc định nếu avatarUrl hoặc displayName không được truyền vào
  const defaultAvatar =
    "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1731150727/e3e8df1e56e1c8839457b42bdcd750e5_smkmhm.jpg"; // Ảnh placeholder mặc định
  const defaultName = "Guest";
  const { user } = useUser();
  const handleOnclick = () => {
    console.log("Click");
    console.log("Current user from context:", user);
  };
  return (
    <div className="user-info-display" onClick={handleOnclick}>
      <img
        src={user.userAvataUrl || defaultAvatar}
        alt="User Avatar"
        className="user-avatar-display"
        crossOrigin="anonymous"
      />
      <span className="user-name-display">{user.username || defaultName}</span>
    </div>
  );
};
