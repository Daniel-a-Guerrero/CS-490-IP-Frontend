import {useEffect, useState} from 'react' //React hooks for managing states
import SelectedTop from '../components/SelectedTop';
function Films(){
    const [searchBy, setSearchBy] = useState('title')
    const [searchTerm, setSearchTerm] = useState('')
    const [films, setFilms] = useState([])
    const [rentedFilms, setRentedFilms] = useState(null) //array of rented film IDs

    const handleSearchByChange = (e) => {
        setSearchBy(e.target.value)
    }
        const fetchFilms = async ()=>{
            //console.log('Searching for', searchTerm, 'by', searchBy)
            //console.log(`http://localhost:3000/api/films/search/${searchBy}/${encodeURI(searchTerm)}`)
            
            console.log(`Searching for ${searchTerm} by ${searchBy}`);
            const response = await fetch(`http://localhost:3000/api/films/search/${searchBy}/${encodeURIComponent(searchTerm)}`)
            const json = await response.json()
            if(response.ok){
                console.log(json)
                setFilms(json.item)
                console.log('Films API response:',films)
            }
        }
        
        
    const getRentedFilms = async()=>{
        const response = await fetch(`http://localhost:3000/api/films/rented`)
        const json = await response.json()
        if(response.ok){
            let rentedFilmsArray = [];
            rentedFilmsArray = json.items.map(item=>item.film_id);
            console.log(rentedFilmsArray)
            setRentedFilms(rentedFilmsArray); //array of rented film IDs
            console.log('Rented films:', rentedFilms)
        }
    }
    useEffect(()=>{ //put rented film IDs in an array when page loads
        getRentedFilms()
    }, [])
    return(
        <div>
            <h1>Welcome to video rental webiste films page!</h1>
            <label htmlFor="thingsToDo">Things you can do as a customer:</label>
            <ol className="thingsToDo">
                <li>Look up films by name of film, name of an actor, or genre of the film</li>
                <li>View details of the film</li>
                <li>Rent out a film to a customer</li>
            </ol>
            <div className="filmSearch">
                <form className="searchForm">
                    <label htmlFor="searchBy">Search by:</label>
                    <br/>
                    <select value= {searchBy} onChange={handleSearchByChange} name="searchBy" id="searchBy">
                        <option value="title">Film Name</option>
                        <option value="actor">Actor Name</option>
                        <option value="genre">Genre</option>
                    </select>
                    <input 
                    value={searchTerm}
                    onChange={(e)=>{setSearchTerm(e.target.value)}}
                    type="text"
                    placeholder="Enter search term"
                    />
                    <br/>
                    <button onClick = {(e)=>{e.preventDefault(fetchFilms({searchTerm}));console.log(`The film before being sent to SelectedTop: `, films)}}>Search</button>
                </form>
            </div>
            
            {/**in filmResults, it displays all retrieved films from fetchFilms, but in their detailed versions with handleFilm */}
            <div className="filmResults">
                <h2>Film Results:</h2>
                {films && films.map((selectedFilm)=>(
                    <div
                    key={selectedFilm.film_id}
                    >
                        {selectedFilm &&(
                <div className='filmDetails'>
                    <SelectedTop film={{selectedFilm}}/>
                    {console.log(rentedFilms.includes(selectedFilm.film_id))}
                    <button disabled={rentedFilms.includes(selectedFilm.film_id)}>Rent</button>
                </div>
            )}
                    
                        
                    </div>
                ))}
            </div>
                    
        </div>
    )
}

export default Films;