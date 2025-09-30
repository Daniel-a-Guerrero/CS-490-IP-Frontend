const TopFive = ({film}) =>{
    return (
        <div className="topFilms">
            <h4>{film.film_id}</h4>
            <p><strong>Title: </strong>{film.title}</p>
            <p><strong>Rentals: </strong>{film.rental_count}</p>
        </div>
    )
}
export default TopFive