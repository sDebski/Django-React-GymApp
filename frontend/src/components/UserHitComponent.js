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

function UserHitComponent({ hit }) {
  return (
    <ListItem
      key={hit.objectID}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="comments"
          // onClick={() => handleDeleteExpense(expense.id)}
        >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
      // onClick={() => alert(`Description: ${expense.description}`)}
      >
        <ListItemText
          primary={`${hit.first_name} | ${hit.last_name}$`}
          secondary={hit.objectID}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default UserHitComponent;
