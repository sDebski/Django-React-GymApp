import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

function UserHitComponent({ hit }) {
  const navigate = useNavigate();
  const handleChat = () => {
    navigate(`room/${hit.objectID}/${hit.first_name}/${hit.last_name}/`);
  };

  return (
    <ListItem
      key={hit.objectID}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={() => handleChat()}
        >
          <ChatIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemText
        primary={`${hit.first_name} | ${hit.last_name}$`}
        secondary={hit.objectID}
      />
    </ListItem>
  );
}

export default UserHitComponent;
