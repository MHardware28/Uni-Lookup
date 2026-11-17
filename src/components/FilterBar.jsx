// makes a dropdown option for one country
function makeOption(country) {
  // key allows React to track each option
  return <option key={country} value={country}>{country}</option>;
}

// a country dropdown and a name search
function FilterBar(props) {
  // runs every time the dropdown changes
  function handleCountryChange(event) {
    // read the country that is now chosen
    const chosenCountry = event.target.value;
    // hand it up to App, which keeps the state
    props.onCountryChange(chosenCountry);
  }

  // runs every time the search box changes
  function handleSearchChange(event) {
    // read the text that is now in the box
    const typedText = event.target.value;
    // hand it up to App, which keeps the state
    props.onSearchChange(typedText);
  }

  // turns each country into an option
  const options = props.countries.map(makeOption);
  // return the box
  return (
    <section className="box filter">
      {/*heading */}
      <h2>Find universities from all over the world</h2>
      {/* label for the dropdown */}
      <label htmlFor="country">Country</label>
      {/* shows App's state, reports each change */}
      <select
        id="country"
        value={props.selectedCountry}
        onChange={handleCountryChange}
      >
        {/* empty choice means every country */}
        <option value="">All countries</option>
        {/* one option for each country in the file */}
        {options}
      </select>
      {/* label for search box */}
      <label htmlFor="search">Search by name</label>
      {/* shows App's state, reports each key */}
      <input
        id="search"
        value={props.searchText}
        onChange={handleSearchChange}
      />
    </section>
  );
}

// make FilterBar available to other files
export default FilterBar;