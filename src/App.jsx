// import the stylesheet for this page
import "./App.css";
// bring in the useState and useEffect hooks from React
import { useState, useEffect } from "react";
// bring in PageHeader from the components folder
import PageHeader from "./components/PageHeader.jsx";
// bring in AboutBox from the components folder
import AboutBox from "./components/AboutBox.jsx";
// bring in FilterBar from the components folder
import FilterBar from "./components/FilterBar.jsx";
// bring in StatusMessage from the components folder
//import StatusMessage from "./components/StatusMessage.jsx";
// bring in UniversityCard from the components folder
import UniversityCard from "./components/UniversityCard.jsx";

// the list of every university, hosted on GitHub
const SITE =
  "https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json";

//card amount seen on screen at any given time
const PAGE_SIZE = 10;

// turn one record from the file into a plain university object
// map hands this function the record and its spot in the list
function makeUniversity(record, index) {
  // start with no website
  let website = "";
  // use the first web page when the record has one
  if (record.web_pages && record.web_pages.length > 0) {
    website = record.web_pages[0];
  }
  // start with no state or province
  let region = "";
  // only some records have one
  if (record["state-province"]) {
    region = record["state-province"];
  }
  // the spot in the file works as a unique id
  return {
    id: index,
    name: record.name,
    country: record.country,
    region: region,
    website: website,
  };
}

// builds a list of every country with no repeats
function makeCountryList(universities) {
  // the list starts empty
  const countries = [];
  // look at each university
  for (let i = 0; i < universities.length; i++) {
    // read its country
    const country = universities[i].country;
    // add it only if it is not in the list yet
    if (countries.includes(country) === false) {
      countries.push(country);
    }
  }
  // put the countries in A to Z order
  countries.sort();
  // hand the list back
  return countries;
}

// define the App component as a function
function App() {
  // state: make every university, it appears empty until the file arrives
  const [universities, setUniversities] = useState([]);
  // state: is the file still loading? starts at true
  const [loading, setLoading] = useState(true);
  // state: the error message; empty means no error
  const [error, setError] = useState("");
  // state: the chosen country; empty means every country
  const [selectedCountry, setSelectedCountry] = useState("");
  // state: the text in the search box; starts empty
  const [searchText, setSearchText] = useState("");
  // state: how many cards are on screen; starts at one page
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  // state: the universities the student saved; starts empty
  const [shortlist, setShortlist] = useState([]);

  // the side effect: ask for the file
  function startLoad() {
    // useEffect cannot take an async function, so the async work lives in here
    async function loadUniversities() {
      try {
        // starts the request and waits for the response
        const responsePromise = await fetch(SITE);
        // a bad status like 404 counts as a failure
        if (responsePromise.ok === false) {
          throw new Error("bad status " + responsePromise.status);
        }
        // reads the body as JSON and waits for it
        const records = await responsePromise.json();
        // turn every record into a plain university object
        const list = records.map(makeUniversity);
        // stores it as a list of the universities
        setUniversities(list);
      } catch (problem) {
        // show a message instead of the list
        setError("Could not load the university list. Try again later.");
      }
      setLoading(false);
    }
    // loads the file and stores it in state
    loadUniversities();
  }
  //load the file only once, when the page first appears
  useEffect(startLoad, []);

  // runs when the country dropdown changes
  function handleCountryChange(country) {
    // store the new country; React draws App again
    setSelectedCountry(country);
    // go back to the first page of cards
    setVisibleCount(PAGE_SIZE);
  }

  // runs when the search box changes
  function handleSearchChange(text) {
    // store the new text; React draws App again
    setSearchText(text);
    // go back to the first page of cards
    setVisibleCount(PAGE_SIZE);
  }

  // runs when the show more button is clicked
  function handleShowMore() {
    // add one more page of cards
    const newCount = visibleCount + PAGE_SIZE;
    // store it; React draws App again
    setVisibleCount(newCount);
  }

  // runs when a Save button is clicked
  function saveUniversity(university) {
    // checks to see if it is already in the shortlist
    function isSame(saved) {
      return saved.id === university.id;
    }
    const alreadySaved = shortlist.some(isSame);
    // only adds it once
    if (alreadySaved === false) {
      // the old shortlist plus this university
      const newShortlist = [...shortlist, university];
      // store its
      setShortlist(newShortlist);
    }
  }

  // runs when the Remove button is clicked
  function removeUniversity(university) {
    // keeps everything except the one thats being removed
    function isNotRemoved(saved) {
      return saved.id !== university.id;
    }
    // keeps everything except the removed one
    const newShortlist = shortlist.filter(isNotRemoved);
    // store its
    setShortlist(newShortlist);
  }

  // returns true when the university matches the filters
  function matchesFilters(university) {
    const countryMatches =
      selectedCountry === "" || university.country === selectedCountry;
    // lowercase so "uni" and "Uni" both match
    const lowerName = university.name.toLowerCase();
    // lowercase the search text too
    const lowerSearch = searchText.toLowerCase();
    // is the search text inside the name?
    const nameMatches = lowerName.includes(lowerSearch);
    // both must be true to keep the university
    return countryMatches && nameMatches;
  }

  // build one card for the results
  function makeResultCard(university) {
    // key tells React which card is which
    return (
      <UniversityCard
        key={university.id}
        university={university}
        buttonLabel="Save"
        onButtonClick={saveUniversity}
      />
    );
  }

  // build one card for the shortlist
  function makeShortlistCard(university) {
    // key tells React which card is which
    return (
      <UniversityCard
        key={university.id}
        university={university}
        buttonLabel="Remove"
        onButtonClick={removeUniversity}
      />
    );
  }

  // checks to see if the user has picked a country or typed a name
  const hasFilter = selectedCountry !== "" || searchText !== "";
  // keep only the universities that match
  const matching = universities.filter(matchesFilters);
  // keep only the first few to draw
  const visible = matching.slice(0, visibleCount);
  // lists every country in the file for the dropdown
  const countries = makeCountryList(universities);
  // picks the heading from state
  const headingText =
    selectedCountry === "" ? "Universities" : "Universities in " + selectedCountry;

  // pick the message to show above the cards
let message = null;
if (loading) {
  // the file is still on its way
  message = <p className="message">Loading universities...</p>;
} else if (error !== "") {
  // the request failed
  message = <p className="error">{error}</p>;
} else if (hasFilter === false) {
  // nothing picked yet
  message = <p className="message">Pick a country or type a name to see universities.</p>;
} else if (matching.length === 0) {
  // the filters matched nothing
  message = <p className="message">No universities match your search.</p>;
}

  // the cards stay empty until there is something to show
  let cards = [];
  if (loading === false && error === "" && hasFilter) {
    // turns each visible university into a card
    cards = visible.map(makeResultCard);
  }

  // says how many cards are showing
  let countText = "";
  if (cards.length > 0) {
    countText = "Showing " + cards.length + " of " + matching.length + " universities";
  }
  // this is true when there are more cards waiting to be shown
  const moreLeft = cards.length > 0 && matching.length > visibleCount;
  // turns each saved university into a card
  const shortlistCards = shortlist.map(makeShortlistCard);

  // returns one parent div that holds everything
  return (
    <div>
      {/* the header at the top of the page */}
      <PageHeader
        title="World University Finder"
        subtitle="Browse universities by country"
      />
      {/* the problem statement */}
      <AboutBox
        who="Students thinking about studying abroad who do not know which universities exist in a country."
        problem="University information is spread across many sites and languages, so even finding the schools in one country takes a long time."
        why="Finding schools is the first step in choosing where to apply, and missing an option can mean missing a better fit."
      />
      <main>
        {/* the country dropdown and the name search */}
        <FilterBar
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          searchText={searchText}
          onSearchChange={handleSearchChange}
        />
        {/* the universities that match the filters */}
        <section className="box wide">
          {/* the heading */}
          <h2>{headingText}</h2>
          {/* loading, error, or empty message */}
          {message}
          {/* how many are showing */}
          <p className="message">{countText}</p>
          {/* the cards, in a row that wraps */}
          <div className="card-row">{cards}</div>
          {/* the button only exists while more cards are waiting */}
          {moreLeft && <button onClick={handleShowMore}>Show more</button>}
        </section>
        {/* the saved universities */}
        <section className="box wide">
          {/* the heading */}
          <h2>My shortlist</h2>
          {/* a hint while the shortlist is empty */}
          {shortlist.length === 0 && (
            <p className="message">Nothing saved yet. Use Save on a card.</p>
          )}
          {/* the saved cards */}
          <div className="card-row">{shortlistCards}</div>
        </section>
      </main>
      {/* where the data comes from */}
      <footer className="footer">
        Data is from the Hipo University's GitHub repository.
      </footer>
    </div>
  );
}

// make App available to main.jsx
export default App;