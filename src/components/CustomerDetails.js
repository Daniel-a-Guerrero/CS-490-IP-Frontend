import React, { useEffect, useState } from 'react';

function CustomerDetails(props) {
    const [customer, setCustomer] = useState(null);
    const [address, setAddress] = useState(null);
    const [city, setCity] = useState(null)
    const [country, setCountry]=useState(null)
    const [rentals, setRentals]=useState([])
    const [outstanding, setOutstanding]=useState(false)

    useEffect(() => {
        if (!props.customerID) return;
        const fetchInfo = async ()=>{
            console.log(`http://localhost:3000/api/films/customers/filter?customerID=${encodeURIComponent(props.customerID)}`)
            try{
                const response= await fetch(`http://localhost:3000/api/films/customers/filter?customerID=${encodeURIComponent(props.customerID)}`)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data.items[0].address_id)
            setCustomer(data.items[0])
            const response2=await fetch(`http://localhost:3000/api/films/address/${encodeURIComponent(data.items[0].address_id)}`)
            if (!response2.ok) {throw new Error('Network response was not ok');}
            const data2=await response2.json();
            console.log(data2)
            setAddress(data2)
            const response3=await fetch(`http://localhost:3000/api/films/city/${encodeURIComponent(data2.city_id)}`)
            if (!response3.ok) {throw new Error('Network response was not ok');}
            const data3=await response3.json();
            setCity(data3)
            const response4=await fetch(`http://localhost:3000/api/films/country/${encodeURIComponent(data3.country_id)}`)
            if (!response4.ok) {throw new Error('Network response was not ok');}
            const data4=await response4.json();
            setCountry(data4)
            const response5=await fetch(`http://localhost:3000/api/films/rental/${encodeURIComponent(props.customerID)}`)
            if (!response5.ok) {throw new Error('Network response was not ok');}
            const data5=await response5.json();
            const isOutstanding = Array.isArray(data5) ? data5.filter(rental => !rental.return_date).length : false;
            setOutstanding(isOutstanding);
            setRentals(data5)
            }
        catch (error) {
            console.error('Error fetching customer detail:', error);
        }
        }
            fetchInfo()
    }, [props.customerID]);


    if (customer===null) return <div>No customer ID provided.</div>;


    return (
        <div>
            <button onClick={()=>{console.log(customer.first_name)}}>Testing</button>
            {/* */}<h2>Customer Details</h2>
            <p><strong>ID:</strong> {props.customerID}</p>
            <p><strong>Name:</strong> {`${customer.first_name}`}</p>
            <p><strong>Name:</strong> {customer.last_name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {address?.phone}</p>

            <p><strong>Address:</strong> {address?.address}</p>
            <p><strong>District:</strong> {address?.district}</p>
            <p><strong>City:</strong> {city?.city}, {country?.country}</p>
            <br/>
            <p><strong>Rental History:</strong></p>
            <p>Outstanding rentals: {outstanding}</p>
            <div className='customerList'>
            {rentals && rentals.map((rental)=>(
                <div key={rental.rental_id} className='rentalDetails'>
                    <p><strong>Rental ID: </strong>{rental?.rental_id} (Inventory ID: {rental?.inventory_id})</p>
                    <p><strong>Rented film: </strong>{rental?.title}</p>
                    <p><strong>Rental time: </strong>{rental?.rental_date} - {rental.return_date?rental.return_date:'present'}</p>
                    <br/>
                </div>
            ))}
            </div>
             {/*Add more fields as needed */}
        </div>
    );
}

export default CustomerDetails;