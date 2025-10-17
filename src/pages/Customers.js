import {useEffect, useState} from 'react' 
import {useRef} from 'react'
import CustomerList from '../components/CustomerList';
import CustomerDetails from '../components/CustomerDetails';
function Customers(){
    const myRef=useRef(null)
    const [baseCall, setBaseCall]=useState(`customers`)
    const [searchBy, setSearchBy] = useState('customerID')
    const [searchTerm, setSearchTerm] = useState("")
    const [countries, setCountries] = useState([])
    const [cities, setCities]=useState([])
    const [addresses,setAddresses] = useState([])
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false); 
    const [newAddr, setNewAddr]=useState(true)
    const [newCustomer, setNewCustomer]=useState({address:'', address2:'',city:'',postal_code:"",phone:"",location:""})
    const [selectedCustomer, setSelectedCustomer]=useState(null)
    const [chosenExistAddr,setChosenExistAddr]=useState(0)
    const [incFie, setIncFie]=useState(false)

    const [address1, setAddress1]=useState('')
    const [address2, setAddress2]=useState('')
    const [district, setDistrict]=useState("")
    const [city, setCity]=useState(1)
    const [postal, setPostal]=useState(null)
    const [phone, setPhone]=useState("")
    const [lat, setLat]=useState(0)
    const [long, setLong]=useState(0)

    const [editingCustomer, setEditingCustomer] = useState(null); 
    const [editForm, setEditForm] =useState({});

    const [customerData, setCustomerData]=useState({store_id:1,first_name:"",last_name:"",email:"",address_id:1,active:1})

    const testButton=()=>{
        console.log(`${address1}\t${address2}\t${district}\t${phone}\t${lat}\t${long}`);
        console.log("New customer: ",customerData);
    }
    const handleEditClick = (customer) => {
    setEditingCustomer(customer.customer_id);
    setEditForm({...customer}); // preload current customer data into the form
    };

    // Universal input change handler for add-customer form
    const handleInputChange = (e) => {
        console.log(e.target)
        const { name, value, type } = e.target;
        // coerce number inputs to numbers, leave empty as ''
        let parsed = value;
        if (type === 'number') {
            parsed = value === '' ? '' : Number(value);
        }
        setCustomerData(prev => ({
            ...prev,
            [name]: parsed
        }));
    }
    const handleAddr1Change=(e)=>{
        const {name, value, type}=e.target
        let parsed = value;
        if (type === 'number') {
            parsed = value === '' ? '' : Number(value);
        }
        if(name==="address1"){
            setAddress1(parsed)}
        else if(name==="address2"){
            setAddress2(parsed)}
        else if (name==="district"){
            setDistrict(parsed)}
        else if (name==="city"){
            setCity(parsed)}
        else if(name==="postal_code"){
            setPostal(parsed)}
        else if(name==="phone_number"){
            console.log(value)
            setPhone(parsed)}
        else if(name==="lat"){
            setLat(parsed)}
        else if(name==="long"){
            setLong(parsed)}
    }

    const submitCustomer = async()=>{
        try{
            console.log(newAddr)
            var potentiality=customerData.address_id
            if(newAddr){
                if(address1===""||address2===""||district==="")
                {console.log('no')}
                console.log(`${address1}\t${address2}\t${district}\t${city}\t${postal}\t${phone}\t${lat}\t${long}`);
                const submittedAddress={address:address1, address2:address2, district:district, city_id:city, postal_code:postal,phone:phone,lat:lat,long:long};
                console.log(JSON.stringify(submittedAddress))
                const result1 = await fetch("http://localhost:3000/api/films/address", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(submittedAddress)
                });
                if (!result1.ok) throw new Error('Failed to fetch search results');
                const data = await result1.json();
                potentiality=data.item.insertId
            }
            customerData.first_name=customerData.first_name.toUpperCase()
            customerData.last_name=customerData.last_name.toUpperCase()
            customerData.email=`${customerData.first_name}.${customerData.last_name}@sakilacustomer.org`
            customerData.address_id=potentiality
            console.log("THIS IS THE CUSTOMER DATA: ", JSON.stringify(customerData))
            if (customerData.first_name===""||customerData.last_name==="") {throw new Error('Empty fields');}
            const result1 = await fetch("http://localhost:3000/api/films/customers/insert", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customerData)
                });
            const data = await result1.json();
            console.log("data:", data)
        }
        catch(error){
            console.error('Error adding customer:',error);
        }
    }

    
    const deleteCustomer = async(e)=>{
        try{
            console.log(`e.target.value: ${e.target.value}`)
            const r=`http://localhost:3000/api/films/customer/${encodeURIComponent(e.target.value)}`
            const response = await fetch(r, {method: 'DELETE',})
            if (!response.ok) throw new Error('Failed to fetch search results');
            const data = await response.json();
            const response1 = await fetch(`http://localhost:3000/api/films/customers/filter?${searchBy}=${encodeURIComponent(e.target.value)}`)
            if (!response1.ok) throw new Error('Failed to fetch search results');
            const data1 = await response1.json();
            setSearchResults(data1.items || []); // assume API returns { item: [...] }
            setShowSearchResults(true);
        }catch (error) {
                console.error('Error deleting customer:', error);
            }

    }

        const handleSearchClick = async (e)=>
        {
            e.preventDefault();
            if (searchTerm && searchTerm.trim!==""){
                try{
                    const response = await fetch(`http://localhost:3000/api/films/customers/filter?${searchBy}=${encodeURIComponent(searchTerm)}`)
                    if (!response.ok) throw new Error('Failed to fetch search results');
                    const data = await response.json();
                    setSearchResults(data.items || []); // assume API returns { item: [...] }
                    setShowSearchResults(true);
                    console.log(`Search for: http://localhost:3000/api/films/customers/filter?${searchBy}=${encodeURIComponent(searchTerm)}`)
            }catch (error) {
                console.error('Error fetching search results:', error);
            }
            }else {
            setShowSearchResults(false);}
        }

        const handleCustAddr=(e)=>{
            const z=parseInt(e.target.value)
            setChosenExistAddr(z)
            console.log(z)
            console.log(z==0)
            setNewAddr(z==0?true:false)
            const la =z!==0&&addresses.length>0
            console.log(la?addresses[z]:"na")
            setAddress1(la?addresses[z].address:"");
            setAddress2(la?addresses[z].address2:"");
            setDistrict(la?addresses[z].district:"");
            setPhone(la?addresses[z].phone:"");
            setLat(la?addresses[z].location.x:0);
            setLong(la?addresses[z].location.y:0)
        }
        const handleSearchByChange = (e) => 
        {
        setSearchBy(e.target.value)
        console.log(searchBy)
        }
        const handleSearch = (e) => {
            e.preventDefault();
            console.log(searchTerm && searchTerm.trim() !== '')
            if (searchTerm && searchTerm.trim() !== '') {
                setBaseCall(`customers/filter?${searchBy}=${encodeURIComponent(searchTerm)}`);
            } else {
                setBaseCall('customers');
            }
}
    const submitEdit = async (updatedCustomer) => {
    try {
        updatedCustomer.email=`${updatedCustomer.first_name}.${updatedCustomer.last_name}@sakilacustomer.org`
        console.log(`http://localhost:3000/api/films/customer/${updatedCustomer.customer_id}`)
        const response = await fetch(`http://localhost:3000/api/films/customer/${updatedCustomer.customer_id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({first_name:updatedCustomer.first_name,last_name:updatedCustomer.last_name, email:updatedCustomer.email}),
        });
        if (!response.ok) throw new Error('Failed to update customer');
        const data = await response.json();

        // update UI after save
        setSearchResults((prev) =>
            prev.map(c => c.customer_id === updatedCustomer.customer_id ? updatedCustomer : c)
        );
        setEditingCustomer(null);
      } catch (err) {
        console.error('Error updating customer:', err);
      }
    };

    useEffect(() => {
        const fetchCountriesAndAddr = async()=>
    {
        try{
        const response = await fetch('http://localhost:3000/api/films/countries')
        const response2= await fetch('http://localhost:3000/api/films/addresses')
        const response3=await fetch('http://localhost:3000/api/films/cities')
        if (!response.ok || !response2.ok || !response3.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const data2 = await response2.json();
            const data3 = await response3.json();
            setCountries(data.item)
            setAddresses(data2.item)
            setCities(data3.item)
        }
        catch (error) {
            console.error('Error fetching customers:', error);
        }
    }
        fetchCountriesAndAddr();
    },[]); 
    return(
        <div ref={myRef} className='principalDiv'>
            <h1>Welcome to video rental webiste customer page!</h1>
            <label htmlFor="thingsToDo">Things you can do as a customer:</label>
            <ol className="thingsToDo">
                <li>View a list of all customers</li>
                <li>Filter/search customers by their customer id, first name or last name</li>
                <li>Add a new customer</li>
                <li>Edit a customer’s details</li>
                <li>Delete a customer if they no longer wish to patron at store</li>
                <li>View customer details and see their past and present rental history</li>
                <li>Indicate that a customer has returned a rented movie</li>
            </ol>
            <form className="searchForm" onSubmit={handleSearchClick}>
                <label htmlFor="searchBy">Search by:</label>
                <br/>
                <select onChange={(e)=>{handleSearchByChange(e)}} name="searchBy" id="searchBy" disabled={!(searchTerm && searchTerm.trim() !== '')}>
                    <option value="skip"></option>
                    <option value="customerID">Customer ID</option>
                    <option value="firstName">First Name</option>
                    <option value="lastName">Last Name</option>
                </select>
                <input 
                    value={searchTerm}
                    onChange={(e)=>{setSearchTerm(e.target.value)}}
                    type="text"
                    placeholder="Enter search term"/>
                    <button type="submit" disabled={searchBy==="skip"}>Search Customers</button>
            </form>
            {<CustomerDetails customerID={selectedCustomer}/>}
            {showSearchResults && (
                <div className="customerList searchResults">
                    <h2>Search Results</h2>
                    {searchResults.length > 0 ? searchResults.map((customer) => (
                    <div key={customer.customer_id} className="customerCard">
                        <h3>{customer.first_name} {customer.last_name}</h3>
                        <button onClick={()=>setSelectedCustomer(customer.customer_id)}>Get Further Info:</button>
                        <button id="editButton" onClick={()=>{handleEditClick(customer)}}>Edit</button>
                        <button value={customer.customer_id} onClick={deleteCustomer}>Delete</button>
                        <p><strong>Customer ID:</strong> {customer?.customer_id}</p>
                        <p><strong>Email:</strong> {customer?.email}</p>
                        <p><strong>Address ID:</strong> {customer?.address_id}</p>
                        <p><strong>Active:</strong> {customer?.active ? 'Yes' : 'No'}</p>
                        <p><strong>Create Date:</strong> {new Date(customer?.create_date).toLocaleDateString()}</p>
                        {customer?.last_update && <p><strong>Last Update:</strong> {new Date(customer?.last_update).toLocaleDateString()}</p>}

                        {editingCustomer === customer.customer_id && (
                            <div className="editForm">
                                <input
                                name="first_name"
                                value={editForm.first_name}
                                onChange={(e)=>setEditForm({...editForm, first_name: e.target.value.toUpperCase()})}/>
                                <input
                                  name="last_name"
                                  value={editForm.last_name}
                                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value.toUpperCase()})}
                                />
                                <button onClick={() => {submitEdit(editForm)}}>Save</button>
                                <button onClick={() => setEditingCustomer(null)}>Cancel</button>
                            </div>
                        )}
                    </div>
                )) : (
                        <p>No customers found for that query.</p>
                    )}
                </div>
            )}
            <div className='customerList'>
                <CustomerList message={baseCall}/>
            </div>
            <div className='addCustomer'>
                <h2>Add a new customer:</h2>
                <form className="addCustomerForm">
                    <label htmlFor="firstName">First Name:</label>
                    <br/>
                    <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    onChange={handleInputChange}
                    placeholder="Enter first name"/>
                    <br/>
                    <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    onChange={handleInputChange}
                    placeholder="Enter last name"/>
                    <br/>
                    <p>Default Email Format: FIRSTNAME.LASTNAME@sakilacustomer.org</p>
                    <br/>
                    <h3>Address Information:</h3>
                    <h4>Street Address:</h4>
                    <br/>
                    <label>Select from existing addresses or create a new one:</label>             
                    <select name="existingAddress" onChange={handleCustAddr} id="existingAddress">
                        <option key={0} value={0}></option>
                        {addresses && addresses.map((addr)=>(
                            <option key={addr.address_id} value={addr.address_id}>{addr.address}</option>
                        ))}
                    </select>
                    <br/>
                    <h4>New Street Address:</h4>

                    <br/>
                    <label htmlFor="address1">Address:</label>
                    <input name="address1" id="address1" onChange={handleAddr1Change}/>
                    <br/>
                    <label htmlFor="address2">Address 2:</label>
                    <input name="address2" id="address2" onChange={handleAddr1Change}/>
                    <br/>
                    <label htmlFor="district">District:</label>
                    <input type="text" name="district" id="district" placeholder="Enter district" onChange={handleAddr1Change}/>
                    {/* Location Geometry Insert */}
                    <br/>
                    <br/>
                    <label htmlFor='city' >City:</label>

                    <select name="city" id="city" disabled={!newAddr} onChange={handleAddr1Change}>
                        {cities && cities.map((city)=>(
                            <option key={city.city_id} value={city.city_id}>{city.city}</option>
                        ))}
                    </select>
                    <br/>
                    <label htmlFor="postal_code">Postal Code:</label>
                    <br/>
                    <input
                    type="number"
                    disabled={!newAddr}
                    name="postal_code"
                    id="postal_code"
                    onChange={handleAddr1Change}
                    placeholder="Enter postal code"/>
                    {/*<br/>
                    <label htmlFor="country">Country</label>
                    <select name="country" id="country" disabled={!newAddr} onChange={insertCustomer}>
                        {countries && countries.map((country)=>(
                            <option key={country.country_id} value={country.id}>{country.country}</option>
                        ))}
                    </select>*/}
                    <br/>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                    type="number"
                    name="phone_number"
                    id="phone_number"
                    onChange={handleAddr1Change}
                    disabled={!newAddr}
                    placeholder="Enter phone number"/>
                    <br/>
                    <label htmlFor="lat">Location Latitude:</label>
                    <input type="number" disabled={!newAddr} step="any" name="lat" id="lat" placeholder="Latitude"
                    onChange={handleAddr1Change}/>
                    <br/>
                    <label htmlFor="long">Location Longitude:</label>
                    <input type="number" disabled={!newAddr} step="any" name="long" id="long" placeholder="Longitude" 
                    onChange={handleAddr1Change}/>
                    <br/>
                    <button ></button>
                </form>
                <button onClick={submitCustomer} disabled={(customerData.first_name==="")||(customerData.last_name==="")||(newAddr&&(address1===""||district===""))}>Submit</button>
            </div>
            <style>{`
                .customerList{
                    border: 1px solid black;
                    padding: 10px;
                    margin: 10px;
                    max-height: 500px;
                    overflow-y: scroll;
                    
                }
                    .searchResults {
                    border-color: blue;
                    background: gold;
                color:blue;
                margins:5px;
                padding:15px;
                border:5px solid red;
                border-radius: 10px;
                text-align: center;
                }

            `}</style>
        </div>
    )
}

export default Customers;