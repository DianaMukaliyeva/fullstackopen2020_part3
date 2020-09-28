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

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.get('/info', (req, res) => {
    const message = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`;
    res.send(message);
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
