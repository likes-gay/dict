import ReactDOM	from "react-dom/client";
import Home	from "./Home";

const version = "2.5.0";
console.log(`Version: ${version}`);

ReactDOM.createRoot(document.getElementById("root")!).render(<Home />);