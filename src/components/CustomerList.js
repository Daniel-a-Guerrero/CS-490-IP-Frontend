import {useEffect, useState} from 'react' //React hooks for managing states
import { useLocation } from 'react-router-dom';
const CustomerList = (props) => {
    const callBase="http://localhost:3000/api/films/"
    
    const [furtherCall, setFurtherCall]=useState([props.message])
    const [customers, setCustomers] = useState([]); // State to hold customer data
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [totalPages, setTotalPages] = useState(0); // State for total pages
    const [perPage, setPerPage]=useState(10); // Number of customers per page
    const [backendPagination, setBackendPagination] = useState(null); 

    // Get query parameters from URL
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    useEffect(() => {
        console.log(parseInt(searchParams.get('page')) || 1);
        setCurrentPage(parseInt(searchParams.get('page')) || 1);
        setPerPage(parseInt(searchParams.get('perPage')) || 10);
        console.log(parseInt(searchParams.get('limit')) || 10);
    }, [location.search]);
    useEffect(() => {
        setFurtherCall(`${props.message}`);
        setCurrentPage(1);
    }, [props.message]);
    
    // Fetch customer data from the API when the component mounts
    const fetchCustomers = async () => {
        try {
            const decider = furtherCall.includes('?') ? '&' : '?';
            const responseMessage=`${callBase}${furtherCall}${decider}page=${currentPage}&limit=${perPage}`
            console.log(`Further Call: ${furtherCall}`)
            console.log("Fetching customers from: ", responseMessage)
            const response = await fetch(responseMessage);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            
            setBackendPagination(data.pagination);
            setCurrentPage(data.pagination.currentPage);
            setPerPage(data.pagination.itemsPerPage);
            setTotalPages(data.pagination.totalPages);
            //
            setCustomers(data.items); // Assuming the API returns an object with an 'items' array
            //console.log('Fetched customers:', data.items);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };
    
    useEffect(() => {
        fetchCustomers();
    }, [furtherCall, currentPage, perPage,]); 
    
    
    return (
        <div>
            {//<button className='search' onClick={fetchCustomers}>Search:</button>
            }
            {customers && 
                customers.map((customer) => (
                    <div key={customer.customer_id} className="customerCard">
                        <h3>{customer.first_name} {customer.last_name}</h3>
                        <p><strong>Customer ID:</strong> {customer.customer_id}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Address ID:</strong> {customer.address_id}</p>
                        <p><strong>Active:</strong> {customer.active ? 'Yes' : 'No'}</p>
                        <p><strong>Create Date:</strong> {new Date(customer.create_date).toLocaleDateString()}</p>
                        {customer.last_update && <p><strong>Last Update:</strong> {new Date(customer.last_update).toLocaleDateString()}</p>}
                        {/*<button onClick={()=>{console.log(customer.customer_id)}}>Delete</button>*/}
                    </div>
                ))
            }
            <button onClick={()=>setCurrentPage(1)} disabled={currentPage===1}>Start</button>
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>
            <span> Page {currentPage} of {totalPages} </span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
            <button onClick={()=>setCurrentPage(totalPages)} disabled={currentPage===totalPages}>End</button>
        </div>
    )
}
export default CustomerList