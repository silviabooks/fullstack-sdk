import { Link } from "react-router-dom";
import { useLayout } from "../../one-front";

export const Dashboard = () => {
  const { isEmbed, setIsEmbed, title, setTitle } = useLayout();

  return (
    <div>
      <p>
        Change the app title:
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </p>
      <p style={{ background: "yellow" }} onClick={() => setIsEmbed(false)}>
        <small>
          {isEmbed && "working in embed mode - click here to disable"}
        </small>
      </p>
      <hr />
      <ul>
        <li>
          <Link to="/page/luke">Luke</Link>
        </li>
        <li>
          <Link to="/page/ian">Ian</Link>
        </li>
        <li>
          <Link to="/page/leia">Leia</Link>
        </li>
      </ul>
    </div>
  );
};
