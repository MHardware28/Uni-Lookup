// defines university card component
function UniversityCard(props) {
  // read the university from props
  const university = props.university;
  // start with just the country
  let placeText = university.country;
  // add the state or province when there is one
  if (university.region !== "") {
    placeText = university.country + ", " + university.region;
  }
  // runs when the button on this card is clicked
  function handleClick() {
    // hands this university up to App
    props.onButtonClick(university);
  }

  // returns the card
  return (
    <article className="card">
      {/* the university name */}
      <h3>{university.name}</h3>
      {/* the country, and the state or province if there is one */}
      <p>{placeText}</p>
      {/* this is only here when the university has a website */}
      {university.website !== "" && (
        <a href={university.website} target="_blank" rel="noreferrer">
          Visit website
        </a>
      )}
      {/* the button label comes from props */}
      <button onClick={handleClick}>{props.buttonLabel}</button>
    </article>
  );
}

// make UniversityCard available to other files
export default UniversityCard;