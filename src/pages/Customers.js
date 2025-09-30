import {useEffect, useState} from 'react' //React hooks for managing states
import CustomerList from '../components/CustomerList';
function Customers(){
    return(
        <div>
            <h1>Welcome to video rental webiste customer page!</h1>
            <h2>Here, you can:</h2>
            <ul>
                <li>view a list of all customers (Pref. using pagination)</li>
                <li>filter/search customers by their customer id, first name or last name</li>
                <li>add a new customer</li>
                <li>update a customer's information</li>
                <li>delete a customer if they no longer want to be a patron</li>
                <li>view customer details and see their past and present rental history</li>
                <li>indicate that a customer has returned a rented movie</li>
            </ul>
            <div className='customerList'>
                <CustomerList/>
            </div>
            <style>{`
                .customerList{
                    border: 1px solid black;
                    padding: 10px;
                    margin: 10px;
                    max-height: 500px;
                    overflow-y: scroll;
                }
            `}</style>
        </div>
    )
}

export default Customers;