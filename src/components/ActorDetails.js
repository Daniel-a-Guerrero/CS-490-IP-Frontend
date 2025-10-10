const ActorDetails = ({actor}) => {
  return (<div>
    <h2>Actor Details Component</h2>
    <p>Actor ID: {actor.actor_id}</p>
    <p>Name: {actor.first_name} {actor.last_name}</p>
    <p>Film Count: {actor.film_count}</p>
  </div>);
}
export default ActorDetails;