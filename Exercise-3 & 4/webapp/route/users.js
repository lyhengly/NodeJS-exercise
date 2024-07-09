const express = require('express');
const router  = express.Router();
const {check, validationResult} = require('express-validator');

const customers = require("../Models/DataCustomer.json")

// // Get all Customer
// router.get('/all/customers', (req, res) => {
//     res.json(customers);
// });

// Get all Customer with pagination
router.get('/customers', paginatedResults(customers), (req, res) => {
    if(req.query.page || req.query.limit){
        res.json(res.paginatedResults);
    }else{
        res.json(customers);
    }
})
function paginatedResults(model) {
    return (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        const results = {}
        if(endIndex < model.length){
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        if(startIndex > 0){
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        results.results = model.slice(startIndex, endIndex);
        res.paginatedResults = results;
        next();
    }
}
//Get customer by id
router.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    const customer = customers.filter((customer) => customer.id === id);

    if (!customer) {
        return res.status(404).json({ message: 'User not found' });
    }
});

// Create a new Customer
router.post('/create-customers', [check('date_of_birth').isDate()], (req, res) => {
    const errors = validationResult(req);
    const { username, last_name, age,  date_of_birth, nid_passport_number, current_address} = req.body;
    // Simple validation
    if (!username || !last_name || !age || !date_of_birth || !nid_passport_number || !current_address) {
      return res.status(400).json({ message: 'All fields are required, please check again to input them.' });
    }
    if(!errors.isEmpty()){
        console.log(errors)
        return res.status(422).json({errors: errors.array()})
    }
  
    const newCustomer = { id: customers.length + 1, username, last_name, age, date_of_birth, nid_passport_number, current_address};
    customers.push(newCustomer);
  
    res.status(201).json(newCustomer);
});

// Update an existing Customer by ID
router.put('/update-customers/:id', [check('date_of_birth').isDate()], (req, res) => {
    const errors = validationResult(req);
    const { id } = req.params;
    const { username, last_name, age,  date_of_birth, nid_passport_number, current_address} = req.body;
    // Simple validation
    if (!username || !last_name || !age || !date_of_birth || !nid_passport_number || !current_address) {
      return res.status(400).json({ message: 'All fields are required, please check again to input them.' });
    }
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }
    
    const customer = customers.find((customer) => customer.id === id);
    
    console.log(customer);
    if (!customer) {
      return res.status(404).json({ message: 'User not found' });
    }
  
  
    customer.username = username;
    customer.last_name = last_name;
    customer.age = age;
    customer.date_of_birth = date_of_birth;
    customer.nid_passport_number = nid_passport_number;
    customer.current_address = current_address;
  
    res.json(customer);
});

// Delete a user by ID
router.delete('/delete-customers/:id', (req, res) => {
    const {id} = req.params;
    console.log(id);
    // customers = customers.find((customer) => customer.id !== id);
    res.sendStatus(204);
  });
  
  module.exports = router;