import { useEffect } from "react";
import styles from "../css/style.module.css";
import avatar from "./images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faGear } from "@fortawesome/free-solid-svg-icons";
import { getProfileInfo } from "./helpers/helper";
export let Profile = ({ toast, Link, profile, setProfile, navigate }) => {
  useEffect(() => {
    const id = localStorage.getItem("id");
    const role = localStorage.getItem("role");
    let getProfile = async (id, role) => {
      try {
        const {
          data: { userData },
          status,
        } = await getProfileInfo(id, role);
        if (status === 200) {
          setProfile(userData);
        } else {
          throw new Error();
        }
      } catch (error) {
        if (error.response) {
          const { data } = error.response;
          toast.error(data.error);
        }
      }
    };
    getProfile(id, role);
  }, [setProfile, toast]);

  let logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className={styles.profile}>
        <img
          src={profile.profilePic || avatar}
          alt="profile pic"
          className="w-[150px] aspect-square rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 border-4 border-white"
        />
      </div>
      <div className="mt-[60px] p-5 flex flex-col items-center">
        <h1 className="text-4xl font-bold">{profile.username || ""}</h1>
        <span className="text-2xl">
          <b>Role</b>: {profile.role || ""}
        </span>
        <div className="flex items-center gap-1">
          <Link
            to={"/profile"}
            className="flex items-center w-[150px] text-center bg-[#fd25d6] p-3 rounded-r-md rounded-l-lg text-white"
          >
            <FontAwesomeIcon className="text-xl mr-3" icon={faGear} />
            <span className="text-xl font-bold">Profile</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center w-[150px] text-center bg-[#fc5543] p-3 rounded-l-md rounded-r-lg text-white"
          >
            <FontAwesomeIcon
              className="text-xl mr-3"
              icon={faRightFromBracket}
            />
            <span className="text-xl font-bold">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
