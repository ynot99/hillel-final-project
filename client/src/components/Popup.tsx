import "./Popup.scss";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import { removePopup } from "../redux/popup/popupSlice";

const Popup = () => {
  const popups = useAppSelector((state: any) => state.popup.popups);
  const dispatch = useAppDispatch();

  return (
    <ul className="popup-list">
      {popups.map((item: any, index: number) => {
        // FIXME async work inside .map() is a very bad idea
        const timeout = setTimeout(() => {
          dispatch(removePopup(index));
        }, 5000);

        return (
          <li
            key={index}
            onMouseDown={() => {
              clearTimeout(timeout);
              dispatch(removePopup(index));
            }}
            className="popup-item"
          >
            <div className="popup-timer" />
            <p>{item}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Popup;
