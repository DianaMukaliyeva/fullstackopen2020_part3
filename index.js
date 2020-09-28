require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Contact = require('./models/phonebook');

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
    Contact.find({}).then(contacts => {
        res.json(contacts);
    });
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'fields should not be empty',
        });
    }

    const contact = new Contact({
        name: body.name,
        number: body.number,
    });

    contact.save().then(savedContact => res.json(savedContact));
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
});

app.get('/info', (req, res) => {
    const message = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`;
    res.send(message);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
