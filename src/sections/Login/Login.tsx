import { useNavigate } from "react-router-dom";
import { useFirebaseAppContext } from "../../providers/FirebaseAppContext/FirebaseAppContext";

const Login = () => {
  const { singIn, errorMessage } = useFirebaseAppContext();
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "600px",
        padding: "50px",
        fontSize: "20px",
        border: "2px solid black",
      }}
    >
      <button
        onClick={singIn}
        style={{ padding: "20px 50px", fontSize: "20px", fontWeight: "bold" }}
      >
        Login
      </button>

      {errorMessage && (
        <div style={{ margin: "50px 0 0", color: "#d8234b" }}>
          {errorMessage}
        </div>
      )}

      {
        <div>
          <hr />
          <ul
            style={{
              listStyle: "none",
              fontSize: "20px",
            }}
          >
            <li
              style={{
                cursor: "pointer",
                marginBottom: "20px",
              }}
              onClick={() => navigate("/productList")}
            >
              ↗️ Product list
            </li>
            <li
              style={{
                cursor: "pointer",
                marginBottom: "20px",
              }}
              onClick={() => navigate("/subscriptionList")}
            >
              ↗️ Subscription list
            </li>
          </ul>
        </div>
      }
    </div>
  );
};

export default Login;
