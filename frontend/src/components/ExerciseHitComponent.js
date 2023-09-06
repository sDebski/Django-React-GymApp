import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DetailsIcon from "@mui/icons-material/Details";
import { Link } from "react-router-dom";
import React from "react";

function ExerciseHitComponent({ hit }) {
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
