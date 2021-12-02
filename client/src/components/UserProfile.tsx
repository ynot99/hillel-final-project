import "./UserProfile.scss";
import no_avatar from "../assets/img/no-user-image.gif";

import { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router";

import { Posts } from ".";
import ProfileMenu from "./ProfileMenu";
import Users from "./Users";

import { promiseCopyPaste, getAuthTokenHeaders } from "../utils";
import Comments from "./Comments";
import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { unauthorized } from "../redux/popup/popupSlice";

interface IUser {
  id: number;
  avatar?: string;
  username: string;
  first_name: string;
  last_name: string;
  post_count: number;
  comment_count: number;
  bookmark_count: number;
  followers_count: number;
  like_count: number;
  follow_count: number;
  is_followed_by_authorized_user: boolean;
}

const UserProfile = () => {
  const user = useAppSelector((state) => state.userauth.user);
  const profileSlug = useParams()["profileSlug"];
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<IUser>();
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    promiseCopyPaste(
      fetch(`/api/v1/blog/user_profile/${profileSlug}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
      }),
      (result: IUser) => {
        setFollowing(result.is_followed_by_authorized_user);
        setProfile(result);
      }
    );
  }, [profileSlug]);

  const handleFollow = (followingUserID: number, unfollow?: boolean) => {
    if (!user) {
      dispatch(unauthorized());
      return;
    }
    let method = "POST";
    if (unfollow) {
      method = "DELETE";
    }
    promiseCopyPaste(
      fetch(`/api/v1/blog/user_follow/`, {
        method: method,
        headers: new Headers({
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        }),
        body: JSON.stringify({ follower: followingUserID }),
      }),
      (result: any) => {
        setFollowing(Object.keys(result).length !== 0);
      }
    );
  };

  return (
    <>
      {profile ? (
        <>
          <div className="profile block">
            <div className="profile__top">
              <img
                className="profile__avatar"
                src={profile["avatar"] ?? no_avatar}
                alt="avatar"
              />
              {profile.id !== user?.id && (
                <button
                  onClick={() => {
                    handleFollow(profile.id, following);
                  }}
                  className={`profile__follow btn5${
                    following ? " danger" : ""
                  }`}
                >
                  {following ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
            <div className="profile__bottom">
              <span className="profile__fullname">
                {profile.first_name} {profile.last_name}
              </span>
              <span className="profile__username">@{profile.username}</span>
            </div>
          </div>
          <ProfileMenu
            followersCount={profile.followers_count}
            bookmarkCount={profile.bookmark_count}
            commentCount={profile.comment_count}
            likesCount={profile.like_count}
            followCount={profile.follow_count}
            postCount={profile.post_count}
          />
          <Routes>
            <Route
              path="posts"
              element={<Posts fetchURL={`user_profile/${profile.id}`} />}
            >
              <Route
                path=":pageNum"
                element={<Posts fetchURL={`user_profile/${profile.id}`} />}
              />
            </Route>
            <Route
              path="comments"
              element={<Comments profileID={profile.id} />}
            >
              <Route
                path=":pageNum"
                element={<Comments profileID={profile.id} />}
              />
            </Route>
            <Route
              path="bookmarks"
              element={<Posts fetchURL={`bookmark/${profile.id}`} />}
            >
              <Route
                path=":pageNum"
                element={<Posts fetchURL={`bookmark/${profile.id}`} />}
              />
            </Route>
            <Route
              path="likes"
              element={<Posts fetchURL={`liked/${profile.id}`} />}
            >
              <Route
                path=":pageNum"
                element={<Posts fetchURL={`liked/${profile.id}`} />}
              />
            </Route>
            <Route
              path="followers"
              element={<Users fetchURL={`follower/${profile.id}`} />}
            >
              <Route
                path=":pageNum"
                element={<Users fetchURL={`follower/${profile.id}`} />}
              />
            </Route>
            <Route
              path="following"
              element={<Users fetchURL={`user/${profile.id}`} />}
            >
              <Route
                path=":pageNum"
                element={<Users fetchURL={`user/${profile.id}`} />}
              />
            </Route>
          </Routes>
        </>
      ) : (
        <p>Something went wrong</p>
      )}
    </>
  );
};

export default UserProfile;
