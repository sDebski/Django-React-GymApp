function HitComponent({ hit }) {
  return (
    <article>
      <h1>{hit.get_owner_first_name_last_name}</h1>
      <p>{hit.body}</p>
      <h3>{hit.get_categories}</h3>
      <p>${hit.get_likes}</p>

      {/* "title",
        "body",
        "get_owner_first_name_last_name",
        "get_categories",
        "get_likes", */}
    </article>
  );
}

export default HitComponent;
