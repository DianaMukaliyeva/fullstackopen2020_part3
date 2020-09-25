import React from 'react';

const Contacts = ({ persons, deleteContactAction }) =>
    persons.map(person => (
        <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deleteContactAction(person.id, person.name)}>delete</button>
        </div>
    ));

export default Contacts;
