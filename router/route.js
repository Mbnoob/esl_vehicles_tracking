const express = require('express');
const router = express.Router();
const { userLogin } = require('../controller/userLogin');
const { isAdmin } = require('../auth/isAdmin');
const { addPreload } = require('../controller/feedIndex');
const { allUsers, usersByid, addNewuser, updateUser, deleteUser } = require('../controller/users'); // Users
const { allRoles, addRole, updateRoles } = require('../controller/roles');  // Roles
const { allVehicles, vehiclesByName, addVehicles, editVehicles, deleteVehicles } = require('../controller/vehicle');   // Vehicles
const { GetAll, addType, updateType } = require('../controller/vehicles_types'); // Vehicles types

// User loging......
router.post('/login', userLogin)

// Prefetch api call...
router.post('/preload', addPreload);

// Add user.....
router.get('/allUser', isAdmin, allUsers);

router.get('/search-user/:id', isAdmin, usersByid);

router.post('/new-user', isAdmin, addNewuser);

router.put('/edit-users/:id', isAdmin, updateUser);

router.patch('/user-delete/:id', isAdmin, deleteUser);

//Roles part..........
router.get('/list-roles', isAdmin, allRoles);

router.post('/new-role', isAdmin, addRole);

router.patch('/edit-role/:id', isAdmin, updateRoles);

// Vehicles parts.......
router.get('/list-vehicles', isAdmin, allVehicles);

router.get('/search-vehicle/:id', isAdmin, vehiclesByName);

router.post('/add-vehicles', isAdmin, addVehicles);

router.patch('/edit-vehicles/:id', isAdmin, editVehicles);

router.patch('/delete-vehicles/:id', isAdmin, deleteVehicles);

// Vehicles Types........
router.get('/list', GetAll);

router.post('/add-new-type', addType); 

router.put('/edit-types/:id', updateType); 

module.exports = router;