const TopFiveA = ({actor}) =>{
    return (
        <div className="topActors">
            <h4>{actor.actor_id}</h4>
            <p><strong>Name: </strong>{actor.last_name}, {actor.first_name}</p>
            <p><strong>Count: </strong>{actor.cuenta}</p>
        </div>
    )
}
export default TopFiveA