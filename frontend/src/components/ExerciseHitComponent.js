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
import DetailsIcon from "@mui/icons-material/Details";
import { Link } from "react-router-dom";

function ExerciseHitComponent({ hit }) {
  const handleDetailsView = (id) => {};
  return (
    <ListItem
      key={hit.objectID}
      secondaryAction={<DetailsIcon />}
      disablePadding
    >
      <ListItemButton component={Link} to={`/exercise/details/${hit.objectID}`}>
        <ListItemText
          primary={`${hit.title} | ID: ${hit.objectID}`}
          secondary={hit.get_owner_first_name_last_name}
        />
        <p>{hit.get_categories}</p>
        <p>{hit.get_likes}</p>
      </ListItemButton>
    </ListItem>
  );
}

export default ExerciseHitComponent;
