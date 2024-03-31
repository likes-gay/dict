import ReactDOM	from "react-dom/client";
import Home	from "./Home";

const version = process.env.VERSION;
console.log(`Version: ${version}`);

ReactDOM.createRoot(document.getElementById("root")!).render(<Home />);