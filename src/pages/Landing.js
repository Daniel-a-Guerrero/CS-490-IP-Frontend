import {useEffect, useState} from 'react' //React hooks for managing states
import TopFive from "../components/TopFive";
import SelectedTop from '../components/SelectedTop';
import TopFiveA from '../components/TopFiveA';
import TopActorTopFilms from '../components/TopActorTopFilms';
import ActorDetails from '../components/ActorDetails';
function Landing(){
    const [films, setFilms] = useState([])
    const [actors, setActors] = useState([])
    const [selectedFilm, setSelectedFilm] = useState(null)
    const [actorFilms, setActorFilms] = useState([])
    const [selectedActor, setSelectedActor] = useState(null)
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
        const response = await fetch(`http://localhost:3000/api/films/actor/${actor_id}`)
        const json = await response.json()
        if(response.ok){
            console.log(json.topFilms)
            setActorFilms(json.topFilms); // store it somewhere
            setSelectedActor(json.actor)
            console.log(actorFilms)
        }
    }

    return(
        <div className='principalDiv'>
            <h1>Welcome to video rental webiste landing page!</h1>
            <div className='topFive'>
                <div className='topList'>
                    <h2>Top five most popular films:</h2>
                    {
                    films && films.map((film)=>(
                        <div
                        key={film.film_id} className='topFiveFilmClass'
                        onClick={()=>{handleFilm(film.film_id);console.log(`Recorded film value, debug attempt #2: `, film);}}
                        style={{cursor: 'pointer'}}
                        >
                        <TopFive film={film}/>
                        </div>
                    ))}
                </div>
                <div className='topSel'>
                 {selectedFilm && (
                <div className='filmDetails'>
                    <SelectedTop film={{selectedFilm}}/>
                </div>
            )}
                </div>
            </div>
            <div className='topFiveAct'>
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
            <div className='actorDetails'>
            {selectedActor && (
                <div>
                    <ActorDetails actor={selectedActor}/>
                    </div>)}
            </div></div>
            <div className='actorFilms'>
            {actorFilms && actorFilms.map((topFilm)=>(
                    <div
                    key={topFilm.film_id}
                    >
                        {console.log("Top actor's top films: ", topFilm)}
                    <TopActorTopFilms topFilm={topFilm}/>
                    </div>
                ))}
            </div>
            <style>
                {`
                .topFive {
                      display: flex;
                      gap: 1rem;
                      align-items: flex-start;
                      padding: 1rem 0;
                      background-color:blue;
                    }
                .topList {
                  flex: 0 0 320px;     
                  max-height: 70vh;
                  overflow-y: auto;
                  border-right: 1px solid #ddd;
                  padding-right: 1rem;
                  box-sizing: border-box;
                }
                  .topActors{
                    background-color:blue
                  }
                  .actorDetails {
                  background-color:blue} 
                  .topFiveFilmClass{
                  color:grey;
                  transition: color 0.3s ease, background-color 0.3s ease;
                  }
                  .topFiveFilmClass:hover{
                  color:red
                  }
                .topSel {
                    flex: 1 1 0;      
                    min-width: 280px;
                    padding-left: 1rem;
                }
                .emptySelected {
                color: #666;
                padding: 1rem;
                }
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
                    h2{
                    color:grey}
                `}
            </style>
        </div>
    )
}

export default Landing;