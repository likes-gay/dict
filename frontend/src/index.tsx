import ReactDOM	from "react-dom/client";
import Home	from "./Home";

if(!document.cookie.includes("session")) {
	document.cookie = `session=${crypto.randomUUID()}; Secure; SameSite=None;` //Domain=api.likes.gay;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Home />);