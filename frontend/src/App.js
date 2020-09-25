import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Form from './components/Form';
import Contacts from './components/Contacts';
import Header from './components/Header';
import personService from './services/persons';
import Notification from './components/Notification';

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        personService.getAll().then(initialPersons => setPersons(initialPersons));
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setMessage(null);
            setError(null);
        }, 5000);
    }, [message]);

    const personsToShow =
        filter === ''
            ? persons
            : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

    const handleFilter = event => {
        setFilter(event.target.value);
    };

    const handleName = event => {
        setNewName(event.target.value);
    };

    const handleNumber = event => {
        setNewNumber(event.target.value);
    };

    const addNotification = (message, error) => {
        setError(error);
        setMessage(message);
        setNewName('');
        setNewNumber('');
    };

    const addContact = event => {
        event.preventDefault();
        const sameNameContact = persons.filter(person => person.name === newName)[0];

        if (newName === '' || newNumber === '') {
            addNotification('Fields should not be empty', true);
        } else if (sameNameContact) {
            const confirm = window.confirm(`${sameNameContact.name} is already added to phonebook,
                replace the old number with a  new one?`);
            if (confirm) {
                personService
                    .update({ ...sameNameContact, number: newNumber })
                    .then(updatedContact => {
                        setPersons(
                            persons.map(person => (person.id === sameNameContact.id ? updatedContact : person))
                        );
                        addNotification(`Contact ${newName} was successfully updated`, false);
                    })
                    .catch(() => {
                        setPersons(persons.filter(person => person.id !== sameNameContact.id));
                        addNotification(`Contact ${newName} does not exists`, true);
                    });
            }
        } else {
            const newContact = { name: newName, number: newNumber };
            personService.create(newContact).then(returnedContact => {
                setPersons(persons.concat(returnedContact));
                addNotification(`Added ${returnedContact.name}`, false);
            });
        }
    };

    const deleteContact = (id, name) => {
        if (window.confirm(`Delete ${name}?`)) {
            personService
                .remove(id)
                .then(() => {
                    addNotification(`Information of ${name} has been removed from server`, false);
                })
                .catch(() => {
                    addNotification(`Information of ${name} has already been removed from server`, true);
                })
                .finally(() => {
                    setPersons(persons.filter(person => person.id !== id));
                });
        }
    };

    return (
        <div>
            <Header title='Phonebook' />
            <Notification message={message} error={error} />
            <Filter filter={filter} handleFilter={handleFilter} />
            <Header title='add a new' />
            <Form
                newName={newName}
                newNumber={newNumber}
                addContact={addContact}
                handleName={handleName}
                handleNumber={handleNumber}
            />
            <Header title='Numbers' />
            <Contacts persons={personsToShow} deleteContactAction={deleteContact} />
        </div>
    );
};

export default App;
