import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchComponent from "../components/SearchComponent";
import ExerciseHitComponent from "../components/ExerciseHitComponent";
import ChatIcon from "@mui/icons-material/Chat";

function UserHitComponent({ hit }) {
  const handleChat = (id) => {
    console.log(id);
  };
  return (
    <ListItem
      key={hit.objectID}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={() => handleChat(hit.objectID)}
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
