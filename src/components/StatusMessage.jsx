// defines status message component
function StatusMessage(props) {
  // read the kind of message from props: loading, error, or empty
  const messageType = props.type;
  // read the words to show from props
  const messageText = props.text;
  // errors use the red style; every other message is plain
  const className = messageType === "error" ? "error" : "message";
  // return the message
  return <p className={className}>{messageText}</p>;
}

// make StatusMessage available to other files
export default StatusMessage;