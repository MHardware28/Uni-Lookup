// defines about box component
function AboutBox(props) {
  // read the three parts of the problem statement from props
  const whoText = props.who;
  const problemText = props.problem;
  const whyText = props.why;
  // returns the box
  return (
    <section className="box wide">
      {/* the heading */}
      <h2>About this app</h2>
      {/* who it is for */}
      <p><strong>Who it is for:</strong> {whoText}</p>
      {/* the problem they face */}
      <p><strong>The problem:</strong> {problemText}</p>
      {/* why it matters */}
      <p><strong>Why it matters:</strong> {whyText}</p>
    </section>
  );
}

// make AboutBox available to other files
export default AboutBox;