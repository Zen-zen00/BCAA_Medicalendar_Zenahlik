function StateResolver({ data, error, children }) {
  if (error) {
    return (
      <div>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (data === null) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  return children;
}

export default StateResolver;