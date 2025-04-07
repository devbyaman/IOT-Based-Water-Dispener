// controllers/recordController.js
import Record from '../models/record.model.js';
import { errorHandler } from '../utils/error.js';
import moment from 'moment-timezone';

// Create a new record
export const createRecord = async (req, res, next) => {
    const { data } = req.query;

    if (!data) {
        return next(errorHandler(400, 'Data field must be provided'));
    }

    // Split the data from the query string
    const [location, username, deviceId, phoneNo] = data.split(',');

    if (!location || !username || !deviceId || !phoneNo) {
        return next(errorHandler(400, 'All required fields must be provided'));
    }

    const istDatetime = moment().tz('Asia/Kolkata').format();

    // Create the new record
    const newRecord = new Record({
        datetime: istDatetime,
        location,
        username,
        deviceId,
        phoneNo,
    });

    try {
        await newRecord.save();
        res.status(201).json({ message: "Record created successfully" });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            return next(errorHandler(400, 'Device ID must be unique'));
        }
        next(error);
    }
};

// Get all records
export const getRecords = async (req, res, next) => {
    console.log("getRecords method is called.");
    try {
        const records = await Record.find();
        console.log("check point 2");
        
        res.status(200).json(records);
    } catch (error) {
        next(error);
    }
};

// Update a record by ID
export const updateRecord = async (req, res, next) => {
    const { id } = req.params;
    const { location, username, deviceId, phoneNo } = req.body;

    try {
        const updatedRecord = await Record.findByIdAndUpdate(id, { location, username, deviceId, phoneNo }, { new: true });
        if (!updatedRecord) return next(errorHandler(404, 'Record not found'));
        res.status(200).json(updatedRecord);
    } catch (error) {
        next(error);
    }
};

// Delete a record by ID
export const deleteRecord = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedRecord = await Record.findByIdAndDelete(id);
        if (!deletedRecord) return next(errorHandler(404, 'Record not found'));
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        next(error);
    }
};
