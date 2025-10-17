import {useEffect, useState} from 'react' //React hooks for managing states
import SelectedTop from '../components/SelectedTop';
function Films(){
    const [searchBy, setSearchBy] = useState('title')
    const [searchTerm, setSearchTerm] = useState('')
    const [films, setFilms] = useState([])
    const [rentedFilms, setRentedFilms] = useState(null) //array of rented film IDs
    const [customers, setCustomers]=useState([])
    const [rentalCustomer, setRentalCustomer]=useState(0)
    const [rental, setRental]=useState({inventory_id:0,customer_id:0})
    const [isRenting, setIsRenting]=useState(false)

    const handleRentalCu=(e)=>{
        setRentalCustomer(e.target.value)
        console.log(e.target.value)
    }
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
                //console.log(json)
                setFilms(json.item)
                //console.log('Films API response:',films)
            }
        }
        
        
    const getRentedFilms = async()=>{
        const response = await fetch(`http://localhost:3000/api/films/rented`)
        const json = await response.json()
        if(response.ok){
            let rentedFilmsArray = [];
            rentedFilmsArray = json.items.map(item=>item.film_id);
            //console.log(rentedFilmsArray)
            setRentedFilms(rentedFilmsArray); //array of rented film IDs
            //console.log('Rented films:', rentedFilms)
        }
    }
    const getTopAvailableFilm=async(film_id)=>{
        if (!rentalCustomer){
          console.log('Select a customer first.');
          return;
        }
        try{
        const response = await fetch(`http://localhost:3000/api/films/unrented/${film_id}`)
        if (!response.ok) {
            console.log('no available inventory found for this film');
            setIsRenting(false);
            return;}
        const json = await response.json()
        if(json.inventory_id){
            console.log(json)
            console.log({inventory_id:json.inventory_id,customer_id:rentalCustomer})
            setRental({inventory_id:json.inventory_id,customer_id:rentalCustomer})
            try{
            const response2=await fetch(`http://localhost:3000/api/films/rentals`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({inventory_id:json.inventory_id,customer_id:rentalCustomer})
                })
                if(!response2.ok){setIsRenting(false);
                    throw new Error('Network response was not ok');}
                const data2 = await response2.json();
                console.log("data:", data2)
                try{
                    const response3=await fetch(`http://localhost:3000/api/films/rented`)
                    const data3=await response3.json()
                    if(response.ok){
                            let rentedFilmsArray = [];
                            rentedFilmsArray = data3.items.map(item=>item.film_id);
                            //console.log(rentedFilmsArray)
                            setRentedFilms(rentedFilmsArray); //array of rented film IDs
                            //console.log('Rented films:', rentedFilms)
                        }
                }catch(error){console.error('Error getting rents:',error);}
            }catch(error){console.error('Error adding rent:',error);}
        }else {console.log('no available inventory found for this film');}
    }catch(error){console.error('Error adding rent:',error);}finally{setIsRenting(false)}
    }
    const fetchCustomers= async ()=>{
        try{
        const response1=await fetch('http://localhost:3000/api/films/allCustomers')
        if(!response1.ok){ throw new Error('Network response was not ok');}
        const data=await response1.json()
        setCustomers(data.items)}
        catch(error){console.error('Error fetching customers:', error);}
    }
    useEffect(()=>{ //put rented film IDs in an array when page loads
        getRentedFilms()
        fetchCustomers()
    }, [])
    return(
        <div className='principalDiv'>
        <div>
            <h1>Welcome to video rental webiste films page!</h1>
            <label htmlFor="thingsToDo">Things you can do as a customer:</label>
            <ol className="thingsToDo">
                <li>Look up films by name of film, name of an actor, or genre of the film</li>
                <li>View details of the film</li>
                <li>Rent out a film to a customer</li>
            </ol>
            <select name="rentForCustomer" onChange={handleRentalCu} id="rentForCustomer">
                        <option key={0} value={0}></option>
                        {customers && customers.map((cu)=>(
                            <option key={cu.customer_id} value={cu.customer_id}>{cu.customer_id}: {cu.email}</option>
                        ))}
                    </select>
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
                    <button disabled={rentalCustomer==0||rentedFilms.includes(selectedFilm.film_id)||isRenting} onClick={(e)=>{e.preventDefault(getTopAvailableFilm(selectedFilm.film_id))}} >{isRenting ? 'Renting...' : 'Rent'}</button>
                </div>
            )}
                    
                        
                    </div>
                ))}
            </div>
                    
        </div>
        <style>
            {`
        .container {
            font-family: Segoe UI, Arial, sans-serif;
            background: #f8f9fa;
            min-height: 100vh;
            padding: 30px;
        }
        .header {
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .thingsToDo {
            background: #fff;
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            margin-bottom: 24px;
        }
        .select {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 16px;
        }
        .filmSearch {
            background: #e9ecef;
            padding: 18px;
            border-radius: 8px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .searchForm {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .input {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
        }
        .button {
            padding: 10px 18px;
            border-radius: 4px;
            border: none;
            background: #007bff;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            margin-top: 8px;
        }
        .filmResults {
            margin-top: 32px;
        }
        .filmDetails {
            background: #fff;
            border-radius: 8px;
            padding: 18px;
            margin-bottom: 18px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.07);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }`}
        </style>
        </div>
    )
}

export default Films;