import { Outlet } from "react-router-dom";
import UserLayout from "../user-layout";
import ProfileContainer from "./profile-container";

export default function ProfileLayout() {
  return (
    <UserLayout>
      <ProfileContainer>
        <Outlet />
      </ProfileContainer>
    </UserLayout>
  );
}