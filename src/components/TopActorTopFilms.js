const TopActorTopFilms = ({ topFilm }) => {
    return (
        <div className = "topFilms">
            <h2>{topFilm.film_id}:</h2>
            <p>Title: {topFilm.title}</p>
            <p>Rental count: {topFilm.rental_count}</p>
        </div>
    )
}
export default TopActorTopFilms