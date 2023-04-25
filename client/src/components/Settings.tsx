import "./Settings.scss";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Compressor from "compressorjs";

import { useAppSelector } from "../redux/hooks";
import { setUser } from "../redux/userauth/userauthSlice";
import { getAuthTokenHeaders, promiseCopyPaste } from "../utils";
import { addPopup } from "../redux/popup/popupSlice";

import no_avatar from "../assets/img/no-user-image.gif";

interface IResult {
  first_name: string;
  last_name: string;
  avatar: string;
}

const Settings = () => {
  const user = useAppSelector((state) => state.userauth.user);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);

  const dispatch = useDispatch();

  // TODO refactor
  const handleImageRemove = (e: any) => {
    if (!user) return;

    promiseCopyPaste(
      fetch("/api/v1/authapp/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        },
        body: JSON.stringify({ avatar: null }),
      }),
      (result: IResult) => {
        dispatch(
          setUser({
            ...user,
            avatar: result.avatar,
          })
        );
      }
    );
  };

  const handleImageUpload = async (e: any) => {
    if (!user) return;
    const image = e.target.files.length > 0 && e.target.files[0];
    if (!image) return;

    new Compressor(image, {
      width: 96,
      height: 96,
      resize: "cover",
      success: (result: any) => {
        const formData = new FormData();
        formData.append("avatar", result, result.name);

        promiseCopyPaste(
          fetch("/api/v1/authapp/user/update", {
            method: "PUT",
            headers: {
              ...getAuthTokenHeaders(),
            },
            body: formData,
          }),
          (result: IResult) => {
            dispatch(
              setUser({
                ...user,
                avatar: result.avatar,
              })
            );
          }
        );
      },
    });
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    promiseCopyPaste(
      fetch("/api/v1/authapp/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthTokenHeaders(),
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName }),
      }),
      (result: IResult) => {
        dispatch(addPopup("Settings were updated successfully"));
        dispatch(
          setUser({
            ...user,
            firstName: result.first_name,
            lastName: result.last_name,
          })
        );
      }
    );
  };

  return (
    <div className="settings block">
      <form onSubmit={handleSubmit}>
        <div className="settings__input-flex">
          <div>
            <div className="settings__input-block">
              <label htmlFor="first-name">First name</label>
              <input
                type="text"
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="settings__input-block">
              <label htmlFor="last-name">Last name</label>
              <input
                type="text"
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="settings__image-field">
            <label htmlFor="avatar">Avatar</label>
            <img src={user?.avatar || no_avatar} alt="avatar" />
            {user?.avatar ? (
              <button
                className="settings__image-input"
                type="button"
                onClick={handleImageRemove}
              >
                Remove
              </button>
            ) : (
              <input
                className="settings__image-input"
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                placeholder="Upload"
              />
            )}
          </div>
        </div>
        <input className="btn3" type="submit" value="Save changes" />
      </form>
    </div>
  );
};

export default Settings;
