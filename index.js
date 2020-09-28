require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const Contact = require('./models/phonebook');

app.use(express.json());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.static('build'));

app.get('/api/persons', (req, res, next) => {
    Contact.find({})
        .then(contacts => {
            res.json(contacts);
        })
        .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    Contact.findById(req.params.id)
        .then(contact => {
            if (contact) {
                res.json(contact);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
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

    contact
        .save()
        .then(savedContact => res.json(savedContact))
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const contact = {
        name: body.name,
        number: body.number,
    };

    Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
        .then(updatedContact => {
            res.json(updatedContact);
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Contact.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

app.get('/info', (req, res, next) => {
    const amount = Contact.count()
        .then(count => {
            const message = `
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>`;
            res.send(message);
        })
        .catch(error => next(error));
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
