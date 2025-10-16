import Films from "../pages/Films"

const SelectedTop = ({film}) => {
    /*console.log("Selected Top's film data: ", film)
    console.log("Selected Top's film: ", film.selectedFilm )*/
    film=film.selectedFilm
    
    return (
        <div className="selected">
            <h3>{film.film_id}: {film.title}</h3>
            <p>&copy; {film.release_year}</p>
            <p><strong>Rating: </strong>{film.rating}</p>
            <p><strong>Length: </strong>{film.length}</p>
            <p><strong>Summary: </strong>{film.description}</p>
            <p>Language: {film.language_id}</p>
            {film.original_language_id && (<p>Original Language: {film.original_language_id}</p>)}
            <p><strong>Special Features:</strong>{film.special_features}</p>
            <br/>
            <p><strong>Rentals: </strong>{film.rental_count}</p>
            <p>Rental duration: {film.rental_duration}</p>
            <p>Rental rate: {film.rental_rate}</p>
            <p>Replacement costs: {film.replacement_cost}</p>
        </div>
    )
}
export default SelectedTop