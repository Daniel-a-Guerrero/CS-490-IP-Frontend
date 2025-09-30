import {useEffect, useState} from 'react' //React hooks for managing states
import TopFive from "../components/TopFive";
import SelectedTop from '../components/SelectedTop';
import TopFiveA from '../components/TopFiveA';
import TopActorTopFilms from '../components/TopActorTopFilms';
function Landing(){
    const [films, setFilms] = useState([])
    const [actors, setActors] = useState([])
    const [selectedFilm, setSelectedFilm] = useState(null)
    const [actorFilms, setActorFilms] = useState([])
    useEffect(()=>{
        const fetchTopFive = async ()=>{
            const response = await fetch('http://localhost:3000/api/films/top5')
            const response2 = await fetch ('http://localhost:3000/api/films/top5C')
            const json = await response.json()
            const json2 = await response2.json()

            if(response.ok){
                setFilms(json.items)
                //console.log('Top 5 API response:',json.items)
            }
            if(response2.ok){
                setActors(json2.items)
                //console.log('Top 5 actors API response:', json2.items)
            }
        }
        fetchTopFive()
    }, [])

    //For getting more film information
    const handleFilm = async(film_id)=>{
        console.log('Clicked film ',film_id)
        console.log(`${film_id}`)
        const response = await fetch(`http://localhost:3000/api/films/details/${film_id}`)
        console.log(response)
        const json = await response.json()
        console.log(json)
        if(response.ok){
            setSelectedFilm(json); // store it somewhere
            console.log('Film details:', json);
        }
    }
    
    //For getting top five actor films
    const handleActor = async(actor_id)=>{
        console.log('Clicked actor ',actor_id)
        console.log(`${actor_id}`)
        const response = await fetch(`http://localhost:3000/api/films/top5C/${actor_id}`)
        const json = await response.json()
        if(response.ok){
            setActorFilms(json); // store it somewhere
        }
    }

    return(
        <div>
            <h1>Welcome to video rental webiste landing page!</h1>
            <div className='topFive'>
                <h2>Top five most popular films:</h2>
                {
                films && films.map((film)=>(
                    <div
                    key={film.film_id}
                    onClick={()=>{handleFilm(film.film_id);console.log(`Recorded film value, debug attempt #2: `, film);}}
                    style={{cursor: 'pointer'}}
                    >
                    <TopFive film={film}/>
                    </div>
                ))}
                 {selectedFilm && (
                <div className='filmDetails'>
                    <SelectedTop film={{selectedFilm}}/>
                </div>
            )}
            </div>
            <div className='topActors'>
            <h2>Top five most popular actors:</h2>
                {actors && actors.map((actor)=>(
                    <div
                    key={actor.actor_id}
                    onClick={()=>{handleActor(actor.actor_id)}}
                    style={{cursor: 'pointer'}}
                    >
                    <TopFiveA actor={actor}/>
                    </div>
                ))}
            </div>
            <div className='actorFilms'>
            {actorFilms.items && actorFilms.items.map((topFilm)=>(
                    <div
                    key={topFilm.film_id}
                    >
                    <TopActorTopFilms topFilm={topFilm}/>
                    </div>
                ))}
            </div>
            <style>
                {`
                .topFive, .topActors, .actorFilms{
                    border: 2px solid black;
                    margin: 10px;
                    padding: 10px;
                }
                .filmDetails{
                    border: 2px solid blue;
                    margin: 10px;
                    padding: 10px;
                }
                `}
            </style>
        </div>
    )
}

export default Landing;